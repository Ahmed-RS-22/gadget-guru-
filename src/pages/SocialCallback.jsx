import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SocialCallback({ onLogin }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(search);
        const token = params.get('token');
        
        if (token) {
          // Create proper user info object
          const userInfo = {
            token: token,
            isUserLoggedIn: true,
          };

          // Save to localStorage immediately
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          // Call the login handler
          onLogin();
          
          // Small delay to ensure state updates
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 100);
        } else {
          console.error('No token received from social login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error processing social callback:', error);
        navigate('/login', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [search, navigate, onLogin]);

  if (isProcessing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#007aff'
      }}>
        Finishing login...
      </div>
    );
  }

  return null;
}