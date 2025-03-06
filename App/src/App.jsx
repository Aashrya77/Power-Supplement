import React, { useState } from "react";
import Navbar from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import LatestHome from "./Components/Latest/LatestHome";
import ImgLinks from "./Components/ImgLinks/ImgLinks";
import CTA1 from "./Components/CTA1/CTA1.jsx";
import CTA2 from "./Components/CTA2/CTA2.jsx";
import BestSeller from "./Components/BestSeller/BestSeller.jsx";
import Testimonials from "./Components/Testimonials/Testimonials.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Auth from "./Auth/Auth.jsx";
import { Route, Routes } from "react-router-dom";
import TeamPower from "./Components/TeamPower/TeamPower.jsx";
import Stack_Save from "./Components/Stack&Save/Stack&Save.jsx";
import PreWorkout from "./Components/PreWorkout/PreWorkout.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import FatBurner from './Components/FatBurner/FatBurner';
import Protein from './Components/Protein/Protein';
import ShopAll from './Components/ShopAll/ShopAll';
import Sidebar from './Components/Cart/Sidebar/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Cart from './Components/Cart/Cart';
import UserProfile from './Components/UserProfile/UserProfile';
import AccountLayout from './Components/Account/AccountLayout';
import Orders from './Components/Account/Orders';
import Settings from './Components/Account/Settings';
import ScrollToTop from './Components/ScrollToTop.jsx';
import CheckoutForm from './components/Checkout/CheckoutForm';
import PaymentResult from './pages/PaymentResult/PaymentResult';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <>
          <ScrollToTop />
          <Navbar setCartOpen={setIsCartOpen} />
          <Sidebar isOpen={isCartOpen} closeSidebar={() => setIsCartOpen(false)} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home setCartOpen={setIsCartOpen} />
                  <LatestHome />
                  <ImgLinks />
                  <CTA1 />
                  <CTA2 />
                  <BestSeller />
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
          </Routes>
          <Footer />
        </>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
