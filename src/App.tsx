import React, { useState, useMemo } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_ACTIVITIES, 
  INITIAL_USERS,
  INITIAL_ORDERS,
  MEAL_KITS
} from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { 
  Product, 
  CartItem, 
  Language, 
  User, 
  Order, 
  CustomerReview, 
  SystemActivity, 
  PaymentMethod,
  ColorTheme,
  MealKit
} from './types';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { AboutSection } from './components/AboutSection';
import { DeliverySection } from './components/DeliverySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { SystemLoginModal } from './components/SystemLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { WishlistModal } from './components/WishlistModal';
import { ThemeSelector } from './components/ThemeSelector';
import { Footer } from './components/Footer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { FarmPassportModal } from './components/FarmPassportModal';
import { MealKitsSection } from './components/MealKitsSection';

// Icons
import { SlidersHorizontal, CheckCircle2, Activity, ShieldCheck, Palette, Navigation } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [activities, setActivities] = useState<SystemActivity[]>(INITIAL_ACTIVITIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modal States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSystemLoginOpen, setIsSystemLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'catalog' | 'orders' | 'customers' | 'activity'>('activity');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('mtn');

  // New Features: Order Tracking Radar & Farm Passport
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [farmPassportProduct, setFarmPassportProduct] = useState<Product | null>(null);

  // Theme / Color Palette State
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('lush-emerald');
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // Homepage Banner Minimization State (allows toggling between clear hero banner & compact store mode)
  const [isHeroMinimized, setIsHeroMinimized] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('fofo_hero_minimized');
      if (stored !== null) return stored === 'true';
      return false; // Show the clear, bright homepage by default
    } catch {
      return false;
    }
  });

  const handleToggleHeroMinimized = () => {
    setIsHeroMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fofo_hero_minimized', String(next));
      } catch {}
      showToast(next ? 'Homepage minimized — full navigation & store visible' : 'Homepage banner expanded');
      return next;
    });
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleThemeChange = (newTheme: ColorTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showToast(`Color theme updated`);
  };

  // Translations shortcut
  const t = TRANSLATIONS[currentLang];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesFarmer = p.farmer.toLowerCase().includes(q);
        const matchesOrigin = p.origin.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesFarmer && !matchesOrigin) {
          return false;
        }
      }
      // In stock only
      if (inStockOnly && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured maintains original order
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to basket`);
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter((p) => p.id !== product.id);
      }
      showToast(`Saved ${product.name} to wishlist`);
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Checkout handling
  const handleProceedToCheckout = (discount: number, payment: PaymentMethod) => {
    setCheckoutDiscount(discount);
    setCheckoutPaymentMethod(payment);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    
    // Log system activity
    const newAct: SystemActivity = {
      id: `ACT-ORD-${newOrder.id}`,
      title: `Order #${newOrder.id} Placed & Paid`,
      detail: `${newOrder.customerName} (${newOrder.phone}) authorized ${newOrder.total.toLocaleString()} FRW via ${newOrder.paymentMethod.toUpperCase()} (${newOrder.district})`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'order',
      status: 'success',
      actor: newOrder.customerName,
      actorRole: 'customer',
      metadata: {
        orderId: newOrder.id,
        itemsCount: newOrder.items.length,
        total: newOrder.total,
        payment: newOrder.paymentMethod,
        district: newOrder.district
      }
    };
    setActivities((prev) => [newAct, ...prev]);
    setTrackingOrderId(newOrder.id);
  };

  const handleOpenOrderTracker = (orderId?: string) => {
    if (orderId) setTrackingOrderId(orderId);
    setIsOrderTrackerOpen(true);
  };

  const handleOpenFarmPassport = (product: Product) => {
    setFarmPassportProduct(product);
  };

  const handleAddBundleToCart = (kit: MealKit) => {
    kit.productIds.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) {
        handleAddToCart(prod, 1);
      }
    });
    const newAct: SystemActivity = {
      id: `ACT-KIT-${Date.now().toString().slice(-4)}`,
      title: 'Harvest Meal Kit Added to Cart',
      detail: `Customer selected "${kit.name}" recipe bundle (${kit.bundlePrice.toLocaleString()} FRW).`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'order',
      status: 'info',
      actor: currentUser ? currentUser.name : 'Customer',
      actorRole: 'customer',
      metadata: { kitId: kit.id, price: kit.bundlePrice }
    };
    setActivities((prev) => [newAct, ...prev]);
    showToast(`Added ${kit.name} to cart!`);
    setIsCartOpen(true);
  };

  // Admin operations
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added ${newProd.name} to product catalog`);
    const newAct: SystemActivity = {
      id: `ACT-PRD-${Date.now().toString().slice(-4)}`,
      title: `Harvest Item Added to Catalog`,
      detail: `${newProd.name} (${newProd.price.toLocaleString()} FRW) registered from ${newProd.origin}`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'product',
      status: 'success',
      actor: currentUser ? currentUser.name : 'System Admin',
      actorRole: 'admin',
      metadata: { productId: newProd.id, name: newProd.name, category: newProd.category, price: newProd.price }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteProduct = (productId: number) => {
    const deleted = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog');
    const newAct: SystemActivity = {
      id: `ACT-DEL-${Date.now().toString().slice(-4)}`,
      title: `Product Removed from Store`,
      detail: `Item "${deleted?.name || productId}" was removed from the live inventory`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'product',
      status: 'warning',
      actor: currentUser ? currentUser.name : 'System Admin',
      actorRole: 'admin',
      metadata: { productId, name: deleted?.name }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleToggleStock = (productId: number) => {
    const target = products.find((p) => p.id === productId);
    const newStatus = target ? !target.inStock : false;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    );
    const newAct: SystemActivity = {
      id: `ACT-STK-${Date.now().toString().slice(-4)}`,
      title: `Stock Status Updated: ${newStatus ? 'In Stock' : 'Out of Stock'}`,
      detail: `"${target?.name}" marked as ${newStatus ? 'AVAILABLE' : 'OUT OF STOCK'}`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'product',
      status: newStatus ? 'success' : 'warning',
      actor: currentUser ? currentUser.name : 'System Admin',
      actorRole: 'admin',
      metadata: { productId, name: target?.name, inStock: newStatus }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} marked as ${status}`);
    const newAct: SystemActivity = {
      id: `ACT-ORD-${Date.now().toString().slice(-4)}`,
      title: `Order Status Changed: ${status.toUpperCase()}`,
      detail: `Order #${orderId} was updated to status: ${status}`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'order',
      status: 'success',
      actor: currentUser ? currentUser.name : 'System Admin',
      actorRole: 'admin',
      metadata: { orderId, newStatus: status }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleToggleUserRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newRole = u.role === 'admin' ? 'customer' : 'admin';
          showToast(`User ${u.name} role changed to ${newRole.toUpperCase()}`);
          
          const newAct: SystemActivity = {
            id: `ACT-ROLE-${Date.now().toString().slice(-4)}`,
            title: `User Role Modified: ${newRole.toUpperCase()}`,
            detail: `User ${u.name} (${u.email}) was ${newRole === 'admin' ? 'promoted to Administrator' : 'demoted to Customer'}`,
            time: 'Just now',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            type: 'user',
            status: 'success',
            actor: currentUser ? currentUser.name : 'System Admin',
            actorRole: 'admin',
            metadata: { userId: u.id, name: u.name, newRole }
          };
          setActivities((actPrev) => [newAct, ...actPrev]);
          
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  // Simulate Actions for Admin
  const handleSimulateOrderAction = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const simulatedOrder: Order = {
      id: `FGG-${orderNum}`,
      customerName: 'Jean-Luc Habimana',
      phone: '+250 783 994 012',
      items: [{ product: randomProduct, quantity: 2 }],
      subtotal: randomProduct.price * 2,
      discount: 0,
      deliveryFee: 2000,
      total: randomProduct.price * 2 + 2000,
      paymentMethod: 'mtn',
      address: 'Kacyiru, KG 563 St',
      district: 'Gasabo',
      status: 'Preparing',
      createdAt: 'Just now'
    };

    setOrders((prev) => [simulatedOrder, ...prev]);
    showToast(`⚡ Simulated Order #${simulatedOrder.id} placed by ${simulatedOrder.customerName}`);

    const newAct: SystemActivity = {
      id: `ACT-ORD-${orderNum}`,
      title: `Simulated Live Order #${simulatedOrder.id}`,
      detail: `${simulatedOrder.customerName} ordered 2x ${randomProduct.name} (${simulatedOrder.total.toLocaleString()} FRW via MTN MoMo *182#)`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'order',
      status: 'success',
      actor: 'Jean-Luc Habimana',
      actorRole: 'customer',
      metadata: { orderId: simulatedOrder.id, items: 2, total: simulatedOrder.total, district: 'Gasabo' }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleSimulatePaymentAction = () => {
    const ref = `MTN-RW-${Math.floor(100000 + Math.random() * 900000)}`;
    showToast(`📱 MTN Mobile Money USSD payment authorized (${ref})`);

    const newAct: SystemActivity = {
      id: `ACT-PAY-${Date.now().toString().slice(-4)}`,
      title: 'MTN Mobile Money *182# Payment Verified',
      detail: `Instant USSD push confirmed for 18,500 FRW. TxRef: ${ref}. Push gateway response code: 200 OK.`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'payment',
      status: 'success',
      actor: 'MTN MoMo Gateway',
      actorRole: 'system',
      metadata: { ref, amount: 18500, gateway: 'MTN MoMo Rwanda', ussdCode: '*182*8*1#', status: 'COMPLETED' }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleClearActivities = () => {
    setActivities(INITIAL_ACTIVITIES);
    showToast('System action logs reset to default test state');
  };

  // User login handler
  const handleUserLogin = (user: User) => {
    setCurrentUser(user);
    
    const authAct: SystemActivity = {
      id: `ACT-AUTH-${Date.now().toString().slice(-4)}`,
      title: user.role === 'admin' ? 'Admin Session Authenticated' : 'Customer Account Login',
      detail: `${user.name} (${user.email}) signed in with role: ${user.role.toUpperCase()}`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'user',
      status: 'success',
      actor: user.name,
      actorRole: user.role,
      metadata: { email: user.email, phone: user.phone, role: user.role }
    };
    setActivities((prev) => [authAct, ...prev]);

    if (user.role === 'admin') {
      showToast(`👑 Logged in as Administrator: ${user.name}`);
      // Immediately open Admin Panel on the Activity / System Actions Audit tab!
      setAdminInitialTab('activity');
      setIsAdminOpen(true);
    } else {
      showToast(`Welcome back, ${user.name}!`);
    }
  };

  // Reviews operations
  const handleAddReview = (newRevData: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => {
    const newReview: CustomerReview = {
      ...newRevData,
      id: Date.now(),
      date: 'Just now',
      verified: true
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you! Your review has been published.');

    const newAct: SystemActivity = {
      id: `ACT-REV-${Date.now().toString().slice(-4)}`,
      title: 'Customer Review Posted',
      detail: `${newRevData.name} gave ${newRevData.rating}/5 stars: "${newRevData.comment.slice(0, 45)}..."`,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: 'review',
      status: 'info',
      actor: newRevData.name,
      actorRole: 'customer',
      metadata: { rating: newRevData.rating, location: newRevData.location }
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isRtl = currentLang === 'ar';

  return (
    <div className={`min-h-screen bg-[#fafaf8] text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Notification Bar if logged in as Admin */}
      {currentUser?.role === 'admin' && (
        <div className="bg-stone-900 text-white border-b border-stone-800 px-4 py-1.5 text-xs relative z-30 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-extrabold text-amber-400">ADMINISTRATOR SESSION:</span>
              <span className="font-semibold text-stone-200">{currentUser.name}</span>
              <span className="text-stone-500">({currentUser.email})</span>
              <span className="hidden md:inline text-stone-400">· Full system audit permissions</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAdminInitialTab('activity');
                  setIsAdminOpen(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Check All System Actions ({activities.length})</span>
              </button>

              <button
                onClick={() => {
                  setAdminInitialTab('catalog');
                  setIsAdminOpen(true);
                }}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Manage Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        cartCount={cartTotalItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          setAdminInitialTab('activity');
          setIsAdminOpen(true);
        }}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully');
        }}
        activitiesCount={activities.length}
        currentTheme={currentTheme}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
        onOpenOrderTracker={() => handleOpenOrderTracker()}
        isHeroMinimized={isHeroMinimized}
        onToggleMinimizeHero={handleToggleHeroMinimized}
      />

      {/* Hero Section with Live Search and Minimize Mode */}
      <HeroSection
        currentLang={currentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickCategoryClick={(cat) => setSelectedCategory(cat)}
        currentTheme={currentTheme}
        isMinimized={isHeroMinimized}
        onToggleMinimize={handleToggleHeroMinimized}
      />

      {/* Category Pills Bar */}
      <CategoryFilter
        currentLang={currentLang}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Featured Products Grid Section */}
      <section id="shop" className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Fresh Harvest
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              {t.shop.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t.shop.subtitle}
            </p>
          </div>

          {/* Controls: Search notice, In-stock checkbox & Sort dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-2xs cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>{t.shop.inStockOnly}</span>
            </label>

            <div className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs text-stone-500 font-medium">{t.shop.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-stone-800 outline-hidden cursor-pointer"
              >
                <option value="featured">{t.shop.sortFeatured}</option>
                <option value="price-asc">{t.shop.sortPriceLow}</option>
                <option value="price-desc">{t.shop.sortPriceHigh}</option>
                <option value="rating">{t.shop.sortRating}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count / Search indicator */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6 pb-2 border-b border-stone-200/80">
          <div>
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> fresh harvest items
            {selectedCategory !== 'all' && (
              <span> in <strong className="text-emerald-800 capitalize">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-emerald-800">{searchQuery}</strong>"</span>
            )}
          </div>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">No produce found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              We couldn't find any products matching your current category or search criteria. Try clearing filters or exploring other categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Show All 26 Harvest Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={wishlist.some((w) => w.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  cartQuantity={cartItem ? cartItem.quantity : 0}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onOpenFarmPassport={handleOpenFarmPassport}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Rwandan Harvest Recipe Meal Kits & Veggie Baskets Section */}
      <MealKitsSection
        currentLang={currentLang}
        products={products}
        onAddBundleToCart={handleAddBundleToCart}
      />

      {/* About Section */}
      <AboutSection currentLang={currentLang} />

      {/* Customer Reviews & Feedback Section */}
      <ReviewsSection
        currentLang={currentLang}
        reviews={reviews}
        onAddReview={handleAddReview}
      />

      {/* Delivery Zones & Logistics */}
      <DeliverySection 
        currentLang={currentLang} 
        onShopClick={() => {
          const el = document.getElementById('shop');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Contact Section */}
      <ContactSection currentLang={currentLang} />

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={Boolean(quickViewProduct && wishlist.some((w) => w.id === quickViewProduct.id))}
        onOpenFarmPassport={handleOpenFarmPassport}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currentLang={currentLang}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Checkout Modal with Reliable Return Button & Live Tracker Handlers */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentLang={currentLang}
        discountAmount={checkoutDiscount}
        initialPaymentMethod={checkoutPaymentMethod}
        onOrderComplete={handleOrderComplete}
        onReturnToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        onOpenOrderTracker={(orderId) => {
          setIsCheckoutOpen(false);
          handleOpenOrderTracker(orderId);
        }}
      />

      {/* Auth Modal with Admin Role and Customer Role */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleUserLogin}
        onOpenSystemLogin={() => setIsSystemLoginOpen(true)}
        currentLang={currentLang}
      />

      {/* System Login Modal (Terminal) */}
      <SystemLoginModal
        isOpen={isSystemLoginOpen}
        onClose={() => setIsSystemLoginOpen(false)}
        onAdminAuthenticated={(adminUser) => {
          handleUserLogin(adminUser);
        }}
      />

      {/* Admin Panel Console & All System Actions Audit */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleStock={handleToggleStock}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        users={users}
        onToggleUserRole={handleToggleUserRole}
        activities={activities}
        onSimulateOrderAction={handleSimulateOrderAction}
        onSimulatePaymentAction={handleSimulatePaymentAction}
        onClearActivities={handleClearActivities}
        cartCount={cartTotalItems}
        initialTab={adminInitialTab}
      />

      {/* Theme / Color Palette Selector Modal */}
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        orders={orders}
        currentLang={currentLang}
        initialOrderId={trackingOrderId}
      />

      {/* Rwandan Farm-to-Fork Digital Transparency Passport Modal */}
      <FarmPassportModal
        product={farmPassportProduct}
        isOpen={Boolean(farmPassportProduct)}
        onClose={() => setFarmPassportProduct(null)}
        currentLang={currentLang}
      />

    </div>
  );
}
