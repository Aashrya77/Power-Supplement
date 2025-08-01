import React, { useState, useEffect, lazy, Suspense } from "react";
import Preloader from "./Components/Preloader/Preloader";
import HomeSEO from "./Components/SEO/HomeSEO";
// Essential components loaded immediately
import Navbar from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer.jsx";
import Sidebar from './Components/Cart/Sidebar/Sidebar';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './Components/ScrollToTop.jsx';

// Simple loading component
const ComponentLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif'
  }}>
    <div>Loading...</div>
  </div>
);

// Lazy load non-critical components
const Home = lazy(() => import("./Components/Home/Home"));
const LatestHome = lazy(() => import("./Components/Latest/LatestHome"));
const ImgLinks = lazy(() => import("./Components/ImgLinks/ImgLinks"));
const CTA1 = lazy(() => import("./Components/CTA1/CTA1.jsx"));
const CTA2 = lazy(() => import("./Components/CTA2/CTA2.jsx"));
const LazyBestSeller = lazy(() => import("./Components/BestSeller/LazyBestSeller.jsx"));
const Testimonials = lazy(() => import("./Components/Testimonials/Testimonials.jsx"));
const Auth = lazy(() => import("./Auth/Auth.jsx"));
const TeamPower = lazy(() => import("./Components/TeamPower/TeamPower.jsx"));
const Stack_Save = lazy(() => import("./Components/Stack&Save/Stack&Save.jsx"));
const PreWorkout = lazy(() => import("./Components/PreWorkout/PreWorkout.jsx"));
const SingleProduct = lazy(() => import("./pages/SingleProduct.jsx"));
const FatBurner = lazy(() => import('./Components/FatBurner/FatBurner'));
const Protein = lazy(() => import('./Components/Protein/Protein'));
const ShopAll = lazy(() => import('./Components/ShopAll/ShopAll'));
const Cart = lazy(() => import('./Components/Cart/Cart'));
const UserProfile = lazy(() => import('./Components/UserProfile/UserProfile'));
const AccountLayout = lazy(() => import('./Components/Account/AccountLayout'));
const Orders = lazy(() => import('./Components/Account/Orders'));
const Settings = lazy(() => import('./Components/Account/Settings'));
const CheckoutForm = lazy(() => import('./Components/Checkout/CheckoutForm'));
const PaymentResult = lazy(() => import('./pages/PaymentResult/PaymentResult'));
const NotFound = lazy(() => import('./Components/NotFound/NotFound'));
const UnderConstruction = lazy(() => import('./Components/UnderConstruction/UnderConstruction'));
const Contact = lazy(() => import('./Components/Contact/Contact'));

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the app is ready to render
  useEffect(() => {
    // Simulate checking API connection
    const checkApiConnection = async () => {
      try {
        // Add a small delay to ensure backend is ready
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false); // Still proceed even if there's an error
      }
    };

    checkApiConnection();
  }, []);

  // Show a minimal loading state while checking API
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.5rem'
      }}>
        <div>Initializing Power Supplement...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <>
          <Preloader />
          <ScrollToTop />
          <Navbar setCartOpen={setIsCartOpen} />
          <Sidebar isOpen={isCartOpen} closeSidebar={() => setIsCartOpen(false)} />
          <Suspense fallback={<ComponentLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomeSEO />
                  <Home setCartOpen={setIsCartOpen} />
                  <LatestHome />
                  <ImgLinks />
                  <CTA1 />
                  <CTA2 />
                  <LazyBestSeller />
                  <Testimonials />
                </>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<Cart />} />
            {/* Account Routes */}
            <Route path="/account" element={<AccountLayout />}>
              <Route path="orders" element={<Orders />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path='/partner-program' element={<TeamPower />} />
            <Route path="/collections/stacks" element={<Stack_Save/>}/>
            <Route path="/collections/pre-workout" element={<PreWorkout setCartOpen={setIsCartOpen} />}/>
            <Route path="/product/:id" element={<SingleProduct setCartOpen={setIsCartOpen} />} />
            <Route path="/fat-burner" element={<FatBurner setCartOpen={setIsCartOpen} />} />
            <Route path="/protein" element={<Protein setCartOpen={setIsCartOpen} />} />
            <Route path="/shop-all" element={<ShopAll setCartOpen={setIsCartOpen} />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/failure" element={<PaymentResult />} />
            {/* Under Construction routes */}
            <Route path="/about" element={<UnderConstruction />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<UnderConstruction />} />
            <Route path="/faq" element={<UnderConstruction />} />
            <Route path="/terms" element={<UnderConstruction />} />
            <Route path="/refund-policy" element={<UnderConstruction />} />
            <Route path="/shipping-policy" element={<UnderConstruction />} />
            <Route path="/privacy-policy" element={<UnderConstruction />} />
            <Route path="/accessibility" element={<UnderConstruction />} />
            <Route path="/personal-info" element={<UnderConstruction />} />
            {/* Catch-all route for 404 - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <Footer />
        </>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
