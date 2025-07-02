import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SocialCallback({ onLogin }) {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    console.log('Token from URL:', token);
    if (token) {
      localStorage.setItem("userInfo", JSON.stringify(token));
      onLogin();
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [search, navigate, onLogin]);

  return <p>Finishing login...</p>;
}