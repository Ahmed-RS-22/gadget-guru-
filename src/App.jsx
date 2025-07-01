import React, { useEffect, useState } from "react";
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
  // const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
      token:JSON.parse(localStorage.getItem("userInfo"))?.token || "",
      isUserLoggedIn:JSON.parse(localStorage.getItem("userInfo"))?.isUserLoggedIn || false,
    });
    useEffect(() => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));      
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

    <HashRouter basename="/"> 
      <Header isUserLogged={isUserLogged} onLogout={handleLogout} ></Header>
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
