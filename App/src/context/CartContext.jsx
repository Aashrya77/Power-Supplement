import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import BASE_URL from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/cart`, {
        headers: getAuthHeader()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/v1/cart/add`,
        { productId, quantity },
        { headers: getAuthHeader() }
      );
      setCart(response.data);
      setIsSidebarOpen(true); // Open sidebar when item is added
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/api/v1/cart/update`,
        { productId, quantity },
        { headers: getAuthHeader() }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/api/v1/cart/remove/${productId}`,
        { headers: getAuthHeader() }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/api/v1/cart/clear`,
        { headers: getAuthHeader() }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/v1/cart/coupon`,
        { couponCode },
        { headers: getAuthHeader() }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    isSidebarOpen,
    setIsSidebarOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
