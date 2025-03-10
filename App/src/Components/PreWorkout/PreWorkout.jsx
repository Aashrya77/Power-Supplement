import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PreWorkout.css';
import { FaStar } from 'react-icons/fa';
import BASE_URL from '../../config';

const PreWorkout = () => {
  const [products, setProducts] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    fetchCategoryId();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  useEffect(() => {
    fetchFlavors();
  }, []);

  const fetchCategoryId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/categories`);
      const preWorkoutCategory = response.data.find(
        category => category.name.toLowerCase() === 'pre-workout'
      );
      if (preWorkoutCategory) {
        setCategoryId(preWorkoutCategory._id);
      } else {
        console.error('Pre-workout category not found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    if (!categoryId) {
      console.error('No category ID available');
      return;
    }
    
    try {
      console.log('Fetching products for category:', categoryId);
      const response = await axios.get(`${BASE_URL}/api/v1/products?category=${categoryId}`);
      console.log('Fetched products:', response.data);
      setProducts(response.data.products || []); 
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      try {
        const allResponse = await axios.get(`${BASE_URL}/api/v1/products`);
        const filteredProducts = allResponse.data.products?.filter(
          product => product.category?._id === categoryId
        ) || [];
        setProducts(filteredProducts);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setProducts([]); 
      }
    }
  };

  const fetchFlavors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/flavors`);
      setFlavors(response.data);
    } catch (error) {
      console.error('Error fetching flavors:', error);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    let result = [...products];

    if (selectedFlavor !== 'all') {
      result = result.filter(product => 
        product.flavors?.some(flavor => flavor._id === selectedFlavor)
      );
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedFlavor, sortBy]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? 'star filled' : 'star'} />
    ));
  };

  const formatPrice = (price) => {
    return `$${(price / 100).toFixed(2)} USD`;
  };

  return (
    <div className="pre-workout-container">
      <div className="preworkout-header">
        <h1>Pre-Workout Supplements</h1>
        <p>
          Get the most out of your workouts with pre-workout supplements from
          BPI Sports. Our range of pre-workout products will help you push
          yourself to the limit.
        </p>
      </div>
      <div className="filters-header">
        <div className="filter-section">
          <span>Filter:</span>
          <select 
            value={selectedFlavor} 
            onChange={(e) => setSelectedFlavor(e.target.value)}
            className="flavor-select"
          >
            <option value="all">All Flavors</option>
            {flavors.map(flavor => (
              <option key={flavor._id} value={flavor._id}>
                {flavor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-section">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
          <span className="product-count">{filteredAndSortedProducts.length} products</span>
        </div>
      </div>

      <div className="products-grid">
        {filteredAndSortedProducts.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
              <div className="product-image">
                {product.images && product.images.length > 0 && (
                  <img
                    src={`${BASE_URL}${product.images[0]}`}
                    alt={product.name} 
                  />
                )}
                {product.stock === 0 && <div className="sold-out-badge">Sold out</div>}
                {product.salePrice && <div className="sale-badge">Sale</div>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-rating">
                  {renderStars(product.rating || 0)}
                </div>
                <div className="product-price">
                  {product.salePrice ? (
                    <>
                      <span className="original-price">{formatPrice(product.price)}</span>
                      <span className="sale-price">{formatPrice(product.salePrice)}</span>
                    </>
                  ) : (
                    <span>{formatPrice(product.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="descriptions-preworkout">
        <div className="paragraph">
          <h2>Top Pre-Workout Supplements for Women and Men</h2>
          <p>
            Lately products known as pre-workouts have gained main-streem
            awareness with ingredients dosed optimally to provide a hardcore
            workout experience. Are you looking to maximize your gym
            performance? Pre-workout supplements may help you achieve that.
            Built with ingredients to boost energy, focus, and endurance, these
            supplements are manufactured/produced/designed to help you conquer
            even the most brutal workouts. Whether you're an avid athlete or
            just starting out, a pre-workout supplement may be the tool to take
            your training to the next level.
          </p>
        </div>
        <div className="paragraph">
          <h2>What are Pre-Workout Supplements?</h2>
          <p>
            <strong>Pre-workout supplements,</strong> known as ‘Pre-Workouts,’
            are generally multi-ingredient advanced dietary formulations
            designed to amplify your energy levels before and during workouts.
            Typically available in pill or powder form, these supplements are
            consumed before an athletic session. Key constituents in
            pre-workouts include creatine, caffeine, minerals, amino acids,
            beta-alanine, and vitamins.{" "}
          </p>
        </div>
        <div className="paragraph">
          <h2>Intended Benefits of Pre-Workout Supplements</h2>
          <ul>
            <li>
              <strong>Boosts Energy and Performance: </strong>The addition of
              caffeine in pre-workout supplements lifts energy more,
              contributing to enhanced performance.{" "}
            </li>
            <li>
              <strong>Cognitive Alertness:</strong> Pre-workouts prevent
              mental fatigue while exercising. This helps in improving your
              concentration and performance levels.
            </li>
            <li>
              <strong>Loaded with Nutrition:</strong> These supplements serve
              as a dietary powerhouse, packed with nutrients, minerals, and
              multivitamins.{" "}
            </li>
            <li>
              <strong>Improves Performance & Endurance:</strong> Ingredients
              in pre-workout powders positively impact performance, delaying
              fatigue after intense workouts.
            </li>
            <li>
              <strong>Accelerates Recovery:</strong> Potent ingredients like
              leucine, creatine monohydrate, and caffeine increase insulin
              levels, regulate glucose levels, minimize muscle soreness, and
              increase muscle size to support faster recovery.
            </li>
          </ul>
        </div>
        <div className="paragraph">
          <h2>How Do They Work?</h2>
          <p>
            Incorporating a pre-workout supplement into your fitness regimen can
            be a key factor leading to significant enhancements, including:
          </p>
          <ol>
            <li>
              <strong>Promotes Weight Loss & Boosts Metabolism</strong>
              <p>
                Most Pre-workout supplements promote weight loss and boost
                metabolism through ingredients that positively impact these
                processes. Caffeine, a key component, enhances body
                thermogenesis, fat oxidation, and metabolism, which helps
                delay hunger onset. Many pre-workout supplements include amino
                acids that have been studied to preserve muscle mass while
                encouraging fat loss. A woman looking to reduce weight can use
                a pre workout for women to leverage these benefits and support
                specific fitness goals while combining them with proper
                exercise.
              </p>
            </li>
            <li>
              <strong>Enhances Blood Flow with Electrolyte Balance</strong>
              <p>
                Ingredients like nitric oxide boosters (e.g., L-arginine,
                L-citrulline) are marketed to blood flow by dilating blood
                vessels, delivering more oxygen and nutrients to your muscles,
                thus improving endurance and reducing fatigue. Some
                pre-workout formulas include electrolytes (e.g., sodium,
                potassium, magnesium) to maintain hydration and support muscle
                function, especially during intense sweating.
              </p>
            </li>
            <li>
              <strong>Increases Workout Energy, Strength, & Power</strong>
              <p>
                Pre-workout supplements often contain caffeine, which boosts
                alertness and energy and reduces fatigue. Creatine replenishes
                ATP, enhancing strength and power during high-intensity
                exercise. Amino acids and creatine improve endurance and
                stamina, increasing workout performance. The combination of
                these ingredients provides the energy needed for more
                effective and intense workouts.
              </p>
            </li>
          </ol>
        </div>
        <div className="paragraph">
          <h2>How to use Pre-Workout Supplements?</h2>
          <p>
            <strong>Pre-workout powders </strong>are the most commonly available
            in the market. To effectively use these, mix the powder with water
            or your beverage of choice 20-30 minutes before your workout. If
            it’s a capsule or tablet, follow recommended dosages as suggested by
            your dietician and those on the specific product you consume.{" "}
          </p>
        </div>
        <div className="paragraph">
          <h2>Top Pre-Workout for Men and Women</h2>
          <ol>
            <li>
              <strong>1MR™ the "OG" Formula</strong>
              <div>
                <Link to="#">1MR™</Link> is an iconic pre-workout supplement
                known for providing sustained energy without the crash. This
                powerful formula enhances workout performance, allowing you to
                push through intense training sessions and maximize every rep.{" "}
              </div>
            </li>
            <li>
              <strong>1.M.R Vortex™</strong>
              <div>
                <Link to="#">1.M.R Vortex™</Link> is a pre-workout supplement
                designed to boost workout performance through increased
                strength, focus, and energy. This potent formula boosts
                endurance. Also, enhances overall workout performance, making
                it ideal for pushing boundaries and achieving peak physical
                results.
              </div>
            </li>
          </ol>
        </div>
        <div className="paragraph">
          <h2>
            Importance of Combining Pre-Workout Powders With Diet and Exercise{" "}
          </h2>
          <div>
            While pre-workout powders can be a powerful tool to intensify your
            workouts, just like any supplement, they work best alongside a
            healthy diet and exercise routine. Here's why:
          </div>
          <ul>
            <li>
              <strong>Supports Muscle Preservation</strong>
              <div>
                Properly formulated pre-workout powders promote better muscle
                oxygenation and nutrient delivery, aiding muscle mass and
                minimizing muscle breakdown.{" "}
              </div>
            </li>
            <li>
              <strong>Enhances Mental Focus</strong>
              <div>
                The ingredients in pre-workout powders, such as caffeine and
                amino acids, enhance mental focus and motivation, helping
                individuals stay committed to their fitness regimen.
              </div>
            </li>
          </ul>
        </div>
        <div className="paragraph">
          <h2>Are Pre-Workout Supplements Safe to use?</h2>
          <p>
            Pre-workout supplements can be safe when used appropriately and in
            accordance with recommended guidelines. However, it's essential to
            consider individual tolerance levels, potential allergies, and any
            pre-existing health conditions. Consult a fitness expert for
            personalized advice on dosage and timing, especially regarding
            caffeine intake and potential sleep disturbances. Always read labels
            carefully and seek medical advice if you have health concerns or are
            on medication.
          </p>
        </div>
        <div className="paragraph">
          <h2>Where to Buy the Best Pre-Workout Supplements Online?</h2>
          <p>
            The primary reason for using pre-workout supplements is to help
            attain fitness goals that might be harder to reach without an extra
            energy boost. Everyone needs a bit of extra motivation occasionally,
            and pre-workout supplements can provide the push you need to excel
            in your next workout session. These above-listed pre workout
            supplements from Power Supplement offer booster doses to energize
            the body. From muscle restoration to enhanced bodily performance,
            these dietary supplements can assist in protein synthesis and normal
            fitness gains. You can even contribute to your fitness with these
            supplements. So, look no further and choose Power Supplements'
            pre-workout formulas to achieve all your health goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreWorkout;
