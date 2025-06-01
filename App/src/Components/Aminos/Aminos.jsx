import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Aminos.css';
import baseUrl from "@/config";

const Aminos = () => {
  const [products, setProducts] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    fetchCategoryId();
    fetchFlavors();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  const fetchCategoryId = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/categories`);
      
      const possibleNames = ['Aminos', 'amino acids', 'amino-acids', 'aminos'];
      const category = response.data.find(cat => 
        possibleNames.includes(cat.name.toLowerCase())
      );
      console.log(category)
      if (category) {
        setCategoryId(category._id);
      } else {
        console.error('Aminos category not found');
      }
    } catch (error) {
      console.error('Error fetching category ID:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/products?category=${categoryId}`);
      let sortedProducts = [...(response.data.products || [])];

      if (sortBy === 'price-low-high') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high-low') {
        sortedProducts.sort((a, b) => b.price - a.price);
      }

      if (selectedFlavor !== 'all') {
        sortedProducts = sortedProducts.filter(product => 
          product.flavor.toLowerCase() === selectedFlavor.toLowerCase()
        );
      }

      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchFlavors = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/flavors`);
      setFlavors(response.data);
    } catch (error) {
      console.error('Error fetching flavors:', error);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    fetchProducts();
  };

  const handleFlavorChange = (event) => {
    setSelectedFlavor(event.target.value);
    fetchProducts();
  };

  return (
    <div className="aminos-container">
      <div className="filter-section">
        <select value={sortBy} onChange={handleSortChange} className="sort-select">
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>

        <select value={selectedFlavor} onChange={handleFlavorChange} className="flavor-select">
          <option value="all">All Flavors</option>
          {flavors.map(flavor => (
            <option key={flavor._id} value={flavor.name}>
              {flavor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            {console.log(products)}
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-flavor">Flavor: {product.flavor}</p>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="descriptions-aminos">
        <h2>About Amino Acids Supplements</h2>
        <p>Amino acids are the building blocks of protein and play a crucial role in muscle recovery and growth. Our amino acid supplements are designed to support:</p>
        <ul>
          <li><strong>Muscle Recovery:</strong> Help reduce muscle soreness and speed up recovery</li>
          <li><strong>Muscle Growth:</strong> Support protein synthesis for muscle building</li>
          <li><strong>Performance:</strong> Enhance endurance and reduce fatigue during workouts</li>
          <li><strong>Hydration:</strong> Aid in maintaining proper hydration during intense training</li>
        </ul>
      </div>
    </div>
  );
};

export default Aminos;