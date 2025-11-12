import React, { useState, lazy, Suspense } from "react";
import HomeSEO from "./Components/SEO/HomeSEO";
// Essential components loaded immediately
import Navbar from "./Components/Nav/Nav";
import Footer from "./Components/Footer/Footer.jsx";
import Sidebar from './Components/Cart/Sidebar/Sidebar';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './Components/ScrollToTop.jsx';

// Import skeleton components
import { PageSkeleton } from './Components/Skeleton/Skeleton';


// Modern skeleton loader component
const ComponentLoader = () => <PageSkeleton />;

// Lazy load non-critical components
const Home = lazy(() => import("./Components/Home/Home"));
const LatestHome = lazy(() => import("./Components/Latest/LatestHome"));
const ImgLinks = lazy(() => import("./Components/ImgLinks/ImgLinks"));
const CTA1 = lazy(() => import("./Components/CTA1/CTA1.jsx"));
const CTA2 = lazy(() => import("./Components/CTA2/CTA2.jsx"));
const LazySponsors = lazy(() => import("./Components/Sponsors/LazySponsors.jsx"));
const LazyStoreLocations = lazy(() => import("./Components/StoreLocations/LazyStoreLocations.jsx"));
const Testimonials = lazy(() => import("./Components/Testimonials/Testimonials.jsx"));
const LazyBlogs = lazy(() => import("./Components/Blogs/LazyBlogs.jsx"));
const LazyBlogDetail = lazy(() => import("./Components/Blogs/LazyBlogDetail.jsx"));
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
const AdminDashboard = lazy(() => import('./Components/AdminDashboard/AdminDashboard'));
const AdminProtectedRoute = lazy(() => import('./Components/AdminDashboard/AdminProtectedRoute'));
const Recovery = lazy(() => import('./Components/Recovery/Recovery.jsx'));
const Aminos = lazy(() => import('./Components/Aminos/Aminos.jsx'));
const TermsOfService = lazy(() => import('./pages/Legal/TermsOfService.jsx'));
const RefundPolicy = lazy(() => import('./pages/Legal/RefundPolicy.jsx'));
const ShippingPolicy = lazy(() => import('./pages/Legal/ShippingPolicy.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/Legal/PrivacyPolicy.jsx'));
const Accessibility = lazy(() => import('./pages/Legal/Accessibility.jsx'));
const PersonalInfo = lazy(() => import('./pages/Legal/PersonalInfo.jsx'));
const FAQ = lazy(() => import('./pages/FAQ/FAQ.jsx'));

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <>
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
                  <LazySponsors />
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
            <Route path="/recovery" element={<Recovery setCartOpen={setIsCartOpen} />} />
            <Route path="/aminos" element={<Aminos setCartOpen={setIsCartOpen} />} />
            <Route path="/shop-all" element={<ShopAll setCartOpen={setIsCartOpen} />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/payment/success" element={<PaymentResult />} />
            <Route path="/payment/failure" element={<PaymentResult />} />
            {/* Under Construction routes */}
            <Route path="/about" element={<UnderConstruction />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/stores" element={<LazyStoreLocations />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/articles" element={<LazyBlogs />} />
            <Route path="/blog/:id" element={<LazyBlogDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
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
