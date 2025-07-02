import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SocialCallback({ onLogin }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [userInfo, setUserInfo] = useState({
    token:"",
    isUserLoggedIn: false,
  })
  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    if (token) {
      setUserInfo({
        token: token || "",
        isUserLoggedIn:true,
      });

      localStorage.setItem(
        'userInfo',
        JSON.stringify(userInfo)
      );
      onLogin();
      navigate('#/home');
    } else {
      navigate('/login');
    }
  }, [search, navigate, onLogin,userInfo]);

  return <p>Finishing login...</p>;
}