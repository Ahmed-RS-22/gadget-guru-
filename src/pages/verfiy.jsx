import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Verify({ onLogin }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(search);
        const token = params.get('token');
        console.log('Token from URL:', token);
        
        if (!token) {
          console.error('No token received from social login');
          return navigate('/login', { replace: true });
        }

        // 1) Build your userInfo object
        const userInfo = {
          token,
          isUserLoggedIn: true,
        };

        // 2) Persist to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // 3) Configure axios (or your fetch wrapper) to send the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 4) Notify the rest of the app that we’re logged in
        onLogin(userInfo);

        // 5) Finally, navigate to the protected home
        navigate('/home', { replace: true });
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
