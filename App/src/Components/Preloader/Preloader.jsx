import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const PreloaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
  opacity: ${props => props.$isLoading ? 1 : 0};
  visibility: ${props => props.$isLoading ? 'visible' : 'hidden'};
`;

const LoadingContent = styled.div`
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  margin-top: 15px;
  color: #333;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if the page has been loaded before
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // If already visited, show shorter loading time
      setProgress(50);
    }

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (hasVisited ? 10 : 5);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    // Preload critical resources
    const preloadResources = async () => {
      try {
        // Check if API server is ready
        const healthCheck = await fetch('/api/health')
          .then(res => res.json())
          .catch(() => ({ status: 'error' }));
        
        // Wait for progress animation to complete
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, hasVisited ? 1000 : 2000);
      } catch (error) {
        console.error('Preload error:', error);
        // Still hide preloader even if there's an error
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, 2000);
      }
    };

    preloadResources();
    return () => clearInterval(interval);
  }, []);

  return (
    <PreloaderContainer $isLoading={isLoading}>
      <LoadingContent>
        <Logo src="/PowerLogo.png" alt="Power Supplement Logo" />
        <Spinner />
        <LoadingText>Loading Power Supplement... {progress}%</LoadingText>
      </LoadingContent>
    </PreloaderContainer>
  );
};

export default Preloader;
