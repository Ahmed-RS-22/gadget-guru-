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
          
          // Dispatch a custom event to notify other components
          window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userInfo }));
          
          // Call the login handler
          onLogin();
          
          // Force a small delay to ensure all state updates complete
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 200);
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
        color: '#007aff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>Finishing login...</div>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007aff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}