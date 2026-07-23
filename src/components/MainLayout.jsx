import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import HomeView from "./HomeView";
import CategoryView from "./CategoryView";
import WishlistView from "./WishlistView";
import ProductDetailPage from "./ProductDetailPage";
import CartPage from "./CartPage";
import LoginPage from "./LoginPage";
import AccountDashboardPage from "./AccountDashboardPage";
import Footer from "./Footer";
import Toast from "./Toast";
import AboutUsPage from "./AboutUsPage";
import ContactUsPage from "./ContactUsPage";
import CareersPage from "./CareersPage";
import SellerPortalPage from "./SellerPortalPage";
import MyOrdersPage from "./MyOrdersPage";
import StoriesPage from "./StoriesPage";
import PressReleasesPage from "./PressReleasesPage";
import PaymentsHelpPage from "./PaymentsHelpPage";
import ShippingHelpPage from "./ShippingHelpPage";
import ReturnsHelpPage from "./ReturnsHelpPage";
import FAQPage from "./FAQPage";
import ReturnPolicyPage from "./ReturnPolicyPage";
import TermsOfUsePage from "./TermsOfUsePage";
import SecurityPage from "./SecurityPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import AdvertisePage from "./AdvertisePage";
import GiftCardsPage from "./GiftCardsPage";

import { PRODUCTS_DATABASE } from "../data/products";
import { safeLocalStorage } from "../utils/localStorage";
import { apiService } from "../services/api";

function MainLayout() {
  // Global States
  const [productsList, setProductsList] = useState(PRODUCTS_DATABASE);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [view, setView] = useState("home"); // 'home' | 'category' | 'product-detail' | 'cart' | 'login' | 'wishlist' | 'account'
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = safeLocalStorage.getItem("darkMode");
    return saved === "true";
  });
  const [activeProductDetails, setActiveProductDetails] = useState(null); // Selected product object
  const [userEmail, setUserEmail] = useState(() => {
    return safeLocalStorage.getItem("userEmail") || null;
  });
  const [toast, setToast] = useState(null);

  // Fetch products from backend server on mount or when category/search updates
  useEffect(() => {
    const refreshProducts = async () => {
      const apiProducts = await apiService.getProducts(activeCategory, searchQuery);
      if (apiProducts) {
        setProductsList(apiProducts);
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    };
    refreshProducts();
  }, [activeCategory, searchQuery]);


  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      safeLocalStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark");
      safeLocalStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Add to Shopping Cart
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        triggerToast(`Increased quantity of ${product.name.split(" (")[0]}!`, "info");
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      triggerToast(`Added ${product.name.split(" (")[0]} to Cart!`, "success");
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    const removedItem = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (removedItem) {
      triggerToast(`Removed ${removedItem.name.split(" (")[0]} from Cart.`, "info");
    }
  };

  // Wishlist Handling
  const handleToggleWishlist = (id) => {
    setWishlistItems((prev) => {
      const isExist = prev.includes(id);
      const product = productsList.find((p) => p.id === id);
      const productName = product ? product.name.split(" (")[0] : "Product";

      if (isExist) {
        triggerToast(`Removed ${productName} from Wishlist.`, "info");
        return prev.filter((itemId) => itemId !== id);
      } else {
        triggerToast(`Added ${productName} to Wishlist! ❤️`, "success");
        return [...prev, id];
      }
    });
  };

  // Login handlers
  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    safeLocalStorage.setItem("userEmail", email);
    triggerToast(`Successfully logged in as ${email}!`, "success");
  };

  const handleLogout = () => {
    setUserEmail(null);
    safeLocalStorage.removeItem("userEmail");
    triggerToast("Logged out successfully.", "info");
  };

  // Checkout handling with backend API integration
  const handleCheckout = async () => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const result = await apiService.createOrder({
      items: cartItems,
      totalAmount,
      userEmail: userEmail || "guest@adrsmart.com",
    });

    setCartItems([]);
    setView("home");

    if (result.success) {
      triggerToast(`Order ${result.order.id} placed successfully! Thank you for shopping with AdrsMart.`, "success");
    } else {
      triggerToast("Order placed locally! Thank you for shopping with AdrsMart.", "success");
    }
  };

  // Buy Now flow from detail page
  const handleBuyNow = (product) => {
    const alreadyInCart = cartItems.find((item) => item.id === product.id);
    if (!alreadyInCart) {
      setCartItems((prev) => [...prev, { ...product, qty: 1 }]);
    }
    setView("cart");
  };

  // Filter products by active category & search query
  const filteredProducts = productsList.filter((product) => {
    if (view === "wishlist") {
      const matchWishlist = wishlistItems.includes(product.id);
      if (!matchWishlist) return false;
    }

    const matchesCategory =
      activeCategory === "all" || product.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleProductSelect = (product) => {
    setActiveProductDetails(product);
    setView("product-detail");
  };

  const handleBackNavigation = () => {
    if (activeCategory && activeCategory !== "all") {
      setView("category");
    } else {
      setView("home");
    }
  };

  const handleAddProduct = async (productData) => {
    const res = await apiService.addProduct(productData);
    if (res && res.success) {
      triggerToast(`Product "${productData.name}" saved directly to Database! 🚀`, "success");
      const updatedList = await apiService.getProducts(activeCategory, searchQuery);
      if (updatedList) setProductsList(updatedList);
    } else {
      triggerToast(`Product "${productData.name}" saved!`, "success");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-150 transition-colors font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
        wishlistCount={wishlistItems.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        setView={setView}
        view={view}
        userEmail={userEmail}
        onLogout={handleLogout}
        isBackendConnected={isBackendConnected}
      />

      {/* Categories Selection Bar */}
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          if (cat === "all") {
            setView("home");
          } else {
            setView("category");
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        
        {/* Dynamic Page Switcher */}
        {view === "home" && (
          <HomeView
            searchQuery={searchQuery}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setView("category");
            }}
            filteredProducts={filteredProducts}
            handleAddToCart={handleAddToCart}
            handleProductSelect={handleProductSelect}
            wishlistItems={wishlistItems}
            handleToggleWishlist={handleToggleWishlist}
            triggerToast={triggerToast}
          />
        )}

        {view === "category" && (
          <CategoryView
            activeCategory={activeCategory}
            onResetCategory={() => {
              setActiveCategory("all");
              setView("home");
              setSearchQuery("");
            }}
            filteredProducts={filteredProducts}
            handleAddToCart={handleAddToCart}
            handleProductSelect={handleProductSelect}
            wishlistItems={wishlistItems}
            handleToggleWishlist={handleToggleWishlist}
          />
        )}

        {view === "wishlist" && (
          <WishlistView
            wishlistItems={wishlistItems}
            filteredProducts={filteredProducts}
            onBackToHome={() => setView("home")}
            handleAddToCart={handleAddToCart}
            handleProductSelect={handleProductSelect}
            handleToggleWishlist={handleToggleWishlist}
          />
        )}

        {view === "product-detail" && (
          <ProductDetailPage
            product={activeProductDetails}
            addToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={
              activeProductDetails ? wishlistItems.includes(activeProductDetails.id) : false
            }
            toggleWishlist={handleToggleWishlist}
            onBack={handleBackNavigation}
          />
        )}

        {view === "cart" && (
          <CartPage
            cartItems={cartItems}
            updateQuantity={handleUpdateCartQuantity}
            removeFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onBack={handleBackNavigation}
          />
        )}

        {view === "login" && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={handleBackNavigation}
          />
        )}

        {view === "account" && (
          <AccountDashboardPage
            userEmail={userEmail}
            onLogout={handleLogout}
            setView={setView}
            onBack={handleBackNavigation}
          />
        )}

        {view === "about" && (
          <AboutUsPage onBack={() => setView("home")} />
        )}

        {view === "contact" && (
          <ContactUsPage onBack={() => setView("home")} triggerToast={triggerToast} />
        )}

        {view === "careers" && (
          <CareersPage onBack={() => setView("home")} triggerToast={triggerToast} />
        )}

        {view === "seller" && (
          <SellerPortalPage
            onBack={() => setView("home")}
            triggerToast={triggerToast}
            onAddProduct={handleAddProduct}
          />
        )}

        {view === "orders" && (
          <MyOrdersPage
            onBack={() => setView("home")}
            handleAddToCart={handleAddToCart}
            triggerToast={triggerToast}
          />
        )}

        {view === "stories" && (
          <StoriesPage onBack={() => setView("home")} />
        )}

        {view === "press" && (
          <PressReleasesPage onBack={() => setView("home")} />
        )}

        {view === "payments" && (
          <PaymentsHelpPage onBack={() => setView("home")} />
        )}

        {view === "shipping" && (
          <ShippingHelpPage onBack={() => setView("home")} />
        )}

        {view === "returns" && (
          <ReturnsHelpPage onBack={() => setView("home")} />
        )}

        {view === "faq" && (
          <FAQPage onBack={() => setView("home")} />
        )}

        {view === "return-policy" && (
          <ReturnPolicyPage onBack={() => setView("home")} />
        )}

        {view === "terms" && (
          <TermsOfUsePage onBack={() => setView("home")} />
        )}

        {view === "security" && (
          <SecurityPage onBack={() => setView("home")} />
        )}

        {view === "privacy" && (
          <PrivacyPolicyPage onBack={() => setView("home")} />
        )}

        {view === "advertise" && (
          <AdvertisePage onBack={() => setView("home")} triggerToast={triggerToast} />
        )}

        {view === "gift-cards" && (
          <GiftCardsPage onBack={() => setView("home")} triggerToast={triggerToast} />
        )}

      </main>

      {/* Footer Area (Render everywhere except LoginPage) */}
      {view !== "login" && <Footer setView={setView} />}

      {/* Toast popup notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default MainLayout;
