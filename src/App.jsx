import React, { useEffect, useState, useCallback, } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import axios from "axios";
import Header from "./components/header";
import IcInfo from "./pages/ic";
import Description from "./components/description";
import Features from "./components/features";
import Params from "./components/parameters";
import Package from "./components/package";
import Saved from "./pages/saved";
import Popular from "./pages/popular";
import ErrorPage from "./pages/error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SocialCallback from "./pages/SocialCallback";
import Verfiy from "./pages/verfiy";
import Footer from "./components/footer";
import Profile from "./pages/profile";
import ForgetPassword from "./pages/forget-password";
import OTPVerification from "./pages/otp-verfication";
import ResetPassword from "./pages/reset-password";
import Logic from "./pages/logic";
import Home from "./pages/main";
import TermsAndConditions from "./pages/terms-conditions";
import ProtectedRoute from "./components/privateRoute";
import VerfiyError from "./pages/verfiyError";
function App() {
  // Initialize userInfo from localStorage
  const [isVerfied, setIsVerified] = useState(false); 
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored
        ? JSON.parse(stored)
        : {
            token: "",
            isUserLoggedIn: false,
          };
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return {
        token: "",
        isUserLoggedIn: false,
      };
    }
  });

  const [isUserLogged, setIsUserLogged] = useState(
    userInfo?.isUserLoggedIn || false
  );

  // Listen for storage changes (for social login and other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userInfo" || e.key === null) {
        try {
          const stored = localStorage.getItem("userInfo");
          if (stored) {
            const parsedUserInfo = JSON.parse(stored);
            // Update both userInfo and isUserLogged states
            setUserInfo(parsedUserInfo);
            setIsUserLogged(parsedUserInfo.isUserLoggedIn);
          }
        } catch (error) {
          console.error("Error parsing userInfo from storage event:", error);
        }
      }
    };

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", handleStorageChange);
// chech if user is verfied 
  const checkVerfication = async () => {
    if (userInfo?.isUserLoggedIn && userInfo?.token) {
      try {
        const response = await axios.get(
          "https://gadetguru.mgheit.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
              Accept: "application/json",
            },
          }
        );
        const result = response.data.data;
        setIsVerified(result.is_verified);
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          // If unauthorized, reset userInfo and isUserLogged
          setIsVerified(false);
        }
      }
    }
  };
    checkVerfication();
    // Listen for custom userLoggedIn event (for verification and social login)
    const handleUserLoggedIn = (event) => {
      console.log('UserLoggedIn event received:', event.detail);
      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          const parsedUserInfo = JSON.parse(stored);
          setUserInfo(parsedUserInfo);
          setIsUserLogged(parsedUserInfo.isUserLoggedIn);
        }
      } catch (error) {
        console.error("Error handling userLoggedIn event:", error);
      }
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  // Update localStorage whenever userInfo changes - but prevent infinite loops
  useEffect(() => {
    try {
      const currentStored = localStorage.getItem("userInfo");
      const newUserInfoString = JSON.stringify(userInfo);

      // Only update if the data has actually changed
      if (currentStored !== newUserInfoString) {
        localStorage.setItem("userInfo", newUserInfoString);
      }

      // Update isUserLogged state only if it's different
      if (isUserLogged !== userInfo.isUserLoggedIn) {
        setIsUserLogged(userInfo.isUserLoggedIn);
      }
    } catch (error) {
      console.error("Error saving userInfo to localStorage:", error);
    }
  }, [userInfo, isUserLogged]);

  // Memoize the login handler to prevent unnecessary re-renders
  const handleLogin = useCallback((user) => {
    console.log('handleLogin called with:', user);
    
    if (user && user.token) {
      const newUserInfo = {
        token: user.token,
        isUserLoggedIn: true,
      };
      
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      setUserInfo(newUserInfo);
      setIsUserLogged(true);
      
      console.log('User logged in successfully:', newUserInfo);
    } else {
      // Fallback - try to read from localStorage
      try {
        const latestUserInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (latestUserInfo && latestUserInfo.isUserLoggedIn && latestUserInfo.token) {
          setUserInfo(latestUserInfo);
          setIsUserLogged(true);
        } else {
          console.error('No valid user data provided for login');
        }
      } catch (error) {
        console.error("Error reading userInfo during login:", error);
      }
    }
  }, []);

  // Memoize the logout handler
  const handleLogout = useCallback(() => {
    const resetUserInfo = {
      token: "",
      isUserLoggedIn: false,
    };
    setUserInfo(resetUserInfo);
    setIsUserLogged(false);
    localStorage.setItem("userInfo", JSON.stringify(resetUserInfo));
    console.log('User logged out successfully');
  }, []);

  return (
    <HashRouter basename="/">
      <Header
        isUserLogged={isUserLogged}
        onLogout={handleLogout}
        userInfo={userInfo} // Pass userInfo as well for better sync
      />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/register"
          element={<Register onRegister={handleLogin} />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/social-callback"
          element={<SocialCallback onLogin={handleLogin} />}
        />
        <Route
          path="/verify"
          element={<Verfiy onLogin={handleLogin} />}
        />
        <Route path="/profile" element={<ProtectedRoute allowed ={isVerfied} redirectPath ="/home"><Profile/> </ProtectedRoute>} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/logic" element={<Logic />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ic-info/:Slug" element={<IcInfo />}>
          <Route index element={<Navigate to="params" replace />} />
          <Route path="description" element={<Description />} />
          <Route path="features" element={<Features />} />
          <Route path="params" element={<Params />} />
          <Route path="package" element={<Package />} />
        </Route>
        <Route
          path="/tersms-and-conditions"
          element={<TermsAndConditions></TermsAndConditions>}
        />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/erorr"
          element={<VerfiyError />} 
        />
      </Routes>
      <Footer></Footer>
    </HashRouter>
  );
}

export default App;