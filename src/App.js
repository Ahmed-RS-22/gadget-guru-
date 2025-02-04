import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/all.css";
import Header from "./components/header";
import IcInfo from "./components/ic-info/ic";
import Description from "./components/ic-info/description";
import Features from "./components/ic-info/features";
import Params from "./components/ic-info/parameters";
import Package from "./components/ic-info/package";
import Saved from "./pages/saved";
import ErrorPage from "./components/error";
import Register from "./components/Register";
import Login from "./components/Login";
import Footer from "./components/footer";
import Profile from "./components/profile";
import ForgetPassword from "./components/otp-verfication/forget-password";
import OTPVerification from "./components/otp-verfication/otp-verfication";
import ResetPassword from "./components/otp-verfication/reset-password";
import Home from "./pages/main";
import TermsAndConditions from "./pages/terms-conditions";
function App() {
  // const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
      token:JSON.parse(localStorage.getItem("userInfo"))?.token || "",
      isUserLoggedIn:JSON.parse(localStorage.getItem("userInfo"))?.isUserLoggedIn || false,
    });
    useEffect(() => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      console.log("app");
      
    },[userInfo]);
  
  const [isUserLogged, setIsUserLogged] = useState(userInfo?.isUserLoggedIn || false);
  // Check if user is already logged in
  function updateLoginStatus() {
    setIsUserLogged(isUserLogged );
  }
useEffect(() => {
  updateLoginStatus();
} );

  const handleLogin = () => {
    setIsUserLogged(true); // Set to true after login    
  };

  const handleLogout = () => {
    setIsUserLogged(false); // Set to false on logout
  };
  return (

    <Router> 
      <Header isUserLogged={isUserLogged} onLogout={handleLogout} ></Header>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved" element={<Saved />} />
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
    </Router>
  );
}

export default App;
