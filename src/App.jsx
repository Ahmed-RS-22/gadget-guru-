import React, { useEffect, useState, useCallback } from "react";
import {  Routes, Route, Navigate ,HashRouter} from "react-router-dom";
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
import Footer from "./components/footer";
import Profile from "./pages/profile";
import ForgetPassword from "./pages/forget-password";
import OTPVerification from "./pages/otp-verfication";
import ResetPassword from "./pages/reset-password";
import Logic from "./pages/logic";
import Home from "./pages/main";
import TermsAndConditions from "./pages/terms-conditions";

function App() {
  // Initialize userInfo from localStorage
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : {
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

  const [isUserLogged, setIsUserLogged] = useState(userInfo?.isUserLoggedIn || false);

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
  }, [userInfo]); // Remove isUserLogged from dependencies to prevent loop

  // Memoize the login handler to prevent unnecessary re-renders
  const handleLogin = useCallback(() => {
    try {
      const latestUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (latestUserInfo && latestUserInfo.isUserLoggedIn && latestUserInfo.token) {
        // Only update state if it's actually different
        if (latestUserInfo.token !== userInfo.token || 
            latestUserInfo.isUserLoggedIn !== userInfo.isUserLoggedIn) {
          setUserInfo(latestUserInfo);
        }
        if (!isUserLogged) {
          setIsUserLogged(true);
        }
      } else {
        if (!isUserLogged) {
          setIsUserLogged(true);
        }
      }
    } catch (error) {
      console.error("Error reading userInfo during login:", error);
      if (!isUserLogged) {
        setIsUserLogged(true);
      }
    }
  }, [userInfo.token, userInfo.isUserLoggedIn, isUserLogged]);

  // Memoize the logout handler
  const handleLogout = useCallback(() => {
    const resetUserInfo = {
      token: "",
      isUserLoggedIn: false,
    };
    setUserInfo(resetUserInfo);
    setIsUserLogged(false);
    localStorage.setItem("userInfo", JSON.stringify(resetUserInfo));
  }, []);

  return (
    <HashRouter basename="/"> 
      <Header isUserLogged={isUserLogged} onLogout={handleLogout} />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/social-callback" element={<SocialCallback onLogin={handleLogin} />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/logic" element={<Logic />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/ic-info/:Slug" element={<IcInfo />} >
          <Route index element={<Navigate to="params" replace />}/> 
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
      </Routes>
      <Footer></Footer>
    </HashRouter>
  );
}

export default App;