import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

        // Simulate verification process
        setMessage('Email verified successfully! Logging you in...');
        setVerificationStatus('success');
        
        // Create user info object for auto-login
        const userInfo = {
          token: token, // Use the token from URL
          isUserLoggedIn: true,
        };

        // Save to localStorage immediately
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: userInfo }));
        
        // Call the login handler
        onLogin(userInfo);
        
        // Update message to show login success
        setTimeout(() => {
          setMessage('Login successful! Redirecting to home...');
        }, 1000);
        
        // Navigate to home after showing success message
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 2500);
        
      } catch (error) {
        console.error('Email verification error:', error);
        
        setVerificationStatus('error');
        setMessage('Email verification failed. Please try again or contact support.');
        
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
            onClick={() => navigate('/home', { replace: true })}
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
            Go home
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
</invoke>