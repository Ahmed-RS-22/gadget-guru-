import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Verify({ onLogin }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const processVerification = async () => {
      try {
        const params = new URLSearchParams(search);
        const email = params.get('email');
        const token = params.get('token');
        
        console.log('Verification params:', { email: !!email, token: !!token });
        
        if (!email || !token) {
          console.error('Missing email or token parameters');
          setVerificationStatus('error');
          setMessage('Invalid verification link. Missing required parameters.');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Call the backend verification endpoint
        const response = await axios.post('https://gadetguru.mgheit.com/api/verify', {
          email: email,
          token: token
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        console.log('Verification response:', response.data);

        if (response.data && response.data.data) {
          const userData = response.data.data;
          
          // Check if user data contains a token for auto-login
          if (userData.token) {
            setVerificationStatus('success');
            setMessage('Email verified successfully! Logging you in...');
            
            // Create proper user info object
            const userInfo = {
              token: userData.token,
              isUserLoggedIn: true,
            };

            // Save to localStorage immediately
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            // Dispatch a custom event to notify other components
            window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userInfo }));
            
            // Call the login handler
            onLogin(userData);
            
            // Navigate to home after a short delay
            setTimeout(() => {
              navigate('/home', { replace: true });
            }, 2000);
          } else {
            // Email verified but no auto-login token
            setVerificationStatus('success');
            setMessage('Email verified successfully! Please log in to continue.');
            setTimeout(() => {
              navigate('/home', { replace: true });
            }, 3000);
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        
        let errorMessage = 'Email verification failed. ';
        
        if (error.response) {
          // Server responded with error status
          if (error.response.status === 400) {
            errorMessage += 'Invalid or expired verification link.';
          } else if (error.response.status === 404) {
            errorMessage += 'Verification link not found.';
          } else if (error.response.data && error.response.data.message) {
            errorMessage += error.response.data.message;
          } else {
            errorMessage += 'Please try again or contact support.';
          }
        } else if (error.request) {
          // Network error
          errorMessage += 'Network error. Please check your connection and try again.';
        } else {
          errorMessage += 'An unexpected error occurred.';
        }
        
        setVerificationStatus('error');
        setMessage(errorMessage);
        
        // Redirect to login after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
      } finally {
        setIsProcessing(false);
      }
    };

    processVerification();
  }, [search, navigate, onLogin]);

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return '#4cd964';
      case 'error':
        return '#ff4d4d';
      default:
        return '#007aff';
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      default:
        return '';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Poppins, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          color: getStatusColor()
        }}>
          {verificationStatus === 'processing' ? (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007aff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(),
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '40px',
              fontWeight: 'bold'
            }}>
              {getStatusIcon()}
            </div>
          )}
        </div>
        
        <h2 style={{
          color: '#1a1a1a',
          marginBottom: '15px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {verificationStatus === 'processing' && 'Verifying Email'}
          {verificationStatus === 'success' && 'Verification Successful'}
          {verificationStatus === 'error' && 'Verification Failed'}
        </h2>
        
        <p style={{
          color: '#808080',
          fontSize: '16px',
          lineHeight: '1.5',
          marginBottom: '20px'
        }}>
          {message}
        </p>
        
        {verificationStatus === 'error' && (
          <button
            onClick={() => navigate('/login', { replace: true })}
            style={{
              backgroundColor: '#007aff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007aff'}
          >
            Go to Login
          </button>
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}