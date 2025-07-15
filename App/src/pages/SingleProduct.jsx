import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BASE_URL from '../config';
import ProductSEO from '../Components/SEO/ProductSEO';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setMainImage(`${BASE_URL}${response.data.images[0]}`);
        }
        if (response.data.flavors && response.data.flavors.length > 0) {
          setSelectedFlavor(response.data.flavors[0]._id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (product.stock === 0) {
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      // You can add a success toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You can add an error toast notification here
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (!product) {
    return <ErrorContainer>Product not found</ErrorContainer>;
  }

  const getImageUrl = (imagePath) => {
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <ProductContainer>
      <ProductSEO product={product} />
      <ProductGrid>
        <ImageSection>
          <MainImage src={mainImage} alt={product.name} />
          <ThumbnailContainer>
            {product.images?.map((image, index) => (
              <Thumbnail 
                key={index}
                src={getImageUrl(image)} 
                alt={`${product.name} view ${index + 1}`}
                onClick={() => setMainImage(getImageUrl(image))}
                $active={mainImage === getImageUrl(image)}
              />
            ))}
          </ThumbnailContainer>
        </ImageSection>

        <ProductDetails>
          <BrandName>Power Supplement</BrandName>
          <ProductName>{product.name}</ProductName>
          
          <PriceContainer>
            <CurrentPrice>Rs. {(product.price)} NPR</CurrentPrice>
            
          </PriceContainer>

          <ServingInfo>
            Only Rs. {((product.price * 0.9) / 2500).toFixed(2)} per serving
          </ServingInfo>

          {product.flavors && product.flavors.length > 0 && (
            <FlavorSection>
              <Label>Flavor</Label>
              <FlavorOptions>
                {product.flavors.map(flavor => (
                  <FlavorButton
                    key={flavor._id}
                    $selected={selectedFlavor === flavor._id}
                    onClick={() => setSelectedFlavor(flavor._id)}
                  >
                    {flavor.name}
                  </FlavorButton>
                ))}
              </FlavorOptions>
            </FlavorSection>
          )}

          <QuantitySection>
            <Label>Quantity</Label>
            <QuantityControl>
              <QuantityButton onClick={() => handleQuantityChange(-1)}>−</QuantityButton>
              <QuantityDisplay>{quantity}</QuantityDisplay>
              <QuantityButton onClick={() => handleQuantityChange(1)}>+</QuantityButton>
            </QuantityControl>
          </QuantitySection>

          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            $outOfStock={product.stock === 0}
          >
            {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </AddToCartButton>

          <Description>
            <h3>Description</h3>
            <p>{product.description}</p>
          </Description>
        </ProductDetails>
      </ProductGrid>
    </ProductContainer>
  );
};

// Styled Components
const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: red;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#007bff' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BrandName = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: #333;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OriginalPrice = styled.span`
  color: #999;
  text-decoration: line-through;
  font-size: 1.2rem;
`;

const CurrentPrice = styled.span`
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
`;

const SaleBadge = styled.span`
  background-color: #ff4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ServingInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const FlavorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const FlavorOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FlavorButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$selected ? '#007bff' : '#ddd'};
  background: ${props => props.$selected ? '#007bff' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #007bff;
  }
`;

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f5f5f5;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: 1.1rem;
`;

const AddToCartButton = styled.button`
  padding: 1rem;
  background-color: ${props => props.$outOfStock ? '#cccccc' : 'cornflowerblue'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.$outOfStock ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$outOfStock ? '#cccccc' : '#007bff'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Description = styled.div`
  h3 {
    margin: 0 0 1rem;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

export default SingleProduct;
