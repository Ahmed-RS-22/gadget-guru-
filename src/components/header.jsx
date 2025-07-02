import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-1.png";
import "../styles/models.css"; // Assuming your CSS file for styling
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {Cpu} from "lucide-react"; 

const Header = ({ isUserLogged, onLogout }) => {
  const darkRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get userInfo from localStorage consistently
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const stored = localStorage.getItem("userInfo");
      return stored ? JSON.parse(stored) : { token: "", isUserLoggedIn: false };
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      return { token: "", isUserLoggedIn: false };
    }
  });

  const [myuser, setMyuser] = useState({});
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update userInfo when localStorage changes (for social login)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          const parsedUserInfo = JSON.parse(stored);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.error("Error parsing userInfo from storage:", error);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on component mount and when isUserLogged changes
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isUserLogged]);

  const getUserInfo = async () => {
    // Use the current userInfo state instead of localStorage directly
    if ((userInfo?.isUserLoggedIn && userInfo?.token) || isUserLogged) {
      try {
        const token = userInfo?.token;
        if (!token) {
          console.error("No token available for API call");
          return;
        }

        const response = await axios.get("https://gadetguru.mgheit.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        
        const result = response.data.data;
        setMyuser(result);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If token is invalid, logout the user
        if (error.response?.status === 401) {
          handlelogout();
        }
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [userInfo, isUserLogged]);

  const handleNavigation = (path, sectionId) => {
    if (location.pathname === path) {
      // Scroll within the current page
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to another page with hash
      navigate(`${path}#${sectionId}`);
    }
  };

  // Toggle nav menu
  const toggleNav = () => {
    setShowNav((prev) => !prev);
    if (showUserMenu) setShowUserMenu(false); // Close user menu if open
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    if (showNav) setShowNav(false); // Close nav menu if open
  };

  // Close menus when clicking outside
  const closeMenus = (e) => {
    if (
      !e.target.closest(".fa-bars") &&
      !e.target.closest(".fa-user") &&
      !e.target.closest("#navLinks") &&
      !e.target.closest("#userData")
    ) {
      setShowNav(false);
      setShowUserMenu(false);
    }
  };

  // Add event listener to close menus on click outside
  React.useEffect(() => {
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  React.useEffect(() => {
    document.addEventListener("click", closeUserMenus);
    return () => document.removeEventListener("click", closeUserMenus);
  }, []);

  useEffect(() => {
    // Select all sections and nav links
    const sections = document.querySelectorAll(
      "main  > section:not(:nth-child(4))"
    );
    const navLinks = document.querySelectorAll(".navbar .link a");
    // Function to remove 'active' class from all nav links
    const removeActiveClasses = () => {
      navLinks.forEach((link) => link.classList.remove("active"));
    };

    // Function to add 'active' class to the current nav link
    const addActiveClass = (id) => {
      const activeLink = document.querySelector(
        `.navbar .link a[name="${id}"]`
      );
      if (activeLink) activeLink.classList.add("active");
    };

    // Event listener for scrolling
    const onScroll = () => {
      let currentSection = "";

      // Iterate over each section and check if it is in the viewport
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const pageOffset = window.scrollY;

        // Check if section is within the current scroll position
        if (pageOffset >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      // Remove previous active classes and set the new one
      removeActiveClasses();
      if (currentSection) {
        addActiveClass(currentSection);
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", onScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  const handlelogout = async () => {
    // sending token  to api endpoint
    try {
      const token = userInfo?.token;
      if (token) {
        const response = await fetch("https://gadetguru.mgheit.com/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);

        if (!response.ok) {
          throw new Error("Logout failed.");
        }
        const result = await response.json();
        console.log("Success:", result);
      }

      // Clear user data
      const resetUserInfo = {
        token: "",
        isUserLoggedIn: false,
      };
      
      setUserInfo(resetUserInfo);
      setMyuser({});
      localStorage.setItem("userInfo", JSON.stringify(resetUserInfo));
      
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data
      const resetUserInfo = {
        token: "",
        isUserLoggedIn: false,
      };
      setUserInfo(resetUserInfo);
      setMyuser({});
      localStorage.setItem("userInfo", JSON.stringify(resetUserInfo));
      onLogout();
      navigate("/login");
    }
  };

  const handleUserMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeUserMenus = (e) => {
    if (
      !e.target.closest(".fa-user") &&
      !e.target.closest(".fa-circle-user") &&
      !e.target.closest(".user-control")
    ) {
      setIsMenuOpen(false);
    }
  };

  const handleDarkMode = () => {
    if (darkRef.current.checked) {
      setIsDark(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      setIsDark(false);
    }
  };

  // Check if user is logged in using both props and userInfo state
  const isLoggedIn = isUserLogged || (userInfo?.isUserLoggedIn && userInfo?.token);

  if (isLoggedIn) {
    return (
      <header className="header">
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <img src={logo} alt="logo" className="logo" />
          </div>

          {/* Navbar */}
          <nav className="navbar">
            <ul className={`nav-links ${showNav ? "show" : ""}`} id="navLinks">
              <li className="link">
                <a
                  className="active"
                  onClick={() => handleNavigation("/home", "home-Section")}
                  name="home-Section"
                >
                  Home
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "about-us")}
                  name="about-us"
                >
                  About US
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "ic-id")}
                  name="ic-id"
                >
                  Services
                </a>
              </li>
              <li className="link">
                <a
                  onClick={() => handleNavigation("/home", "contactUS")}
                  name="contactUS"
                >
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Search */}
            <div className="search">
              <a
                onClick={() => handleNavigation("/home", "ic-id")}
                name="ic-id"
              >
                <Link
                  to={{ hash: "#searching" }}
                  style={{
                    padding: "0",
                    border: "none",
                    textDecoration: "none",
                  }}
                >
                  search
                </Link>
                <i className="fa-solid fa-magnifying-glass"></i>
              </a>
            </div>
          </nav>

          {/* User Actions */}
          <div className={`user ${showUserMenu ? "show" : ""}`} id="userData">
            <ul className="user-actions">
              <Link className="icon icon-1 sp" to={"/logic"}>
                <Cpu size={32}/>
              </Link>
              <li className="icon icon-1 dropdown">
                <i className="fa-solid fa-circle-user" onClick={handleUserMenu}></i>
                {/* user control  */}
                <div
                  className={`user-control ${
                    isMenuOpen ? "user-control shown" : "user-control"
                  }`}
                >
                  <div className="username">
                    <div className="icon">
                      <i className="fa-solid fa-circle-user"></i>
                    </div>
                    <div className="user-detailes">
                      <span className="name">
                        {myuser.first_name
                          ? myuser.first_name + " " + myuser.last_name
                          : "username"}
                      </span>
                      <span className="email">{myuser?.email}</span>
                    </div>
                  </div>
                  <ul className="items">
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-user-large"></i>
                      </div>
                      <Link className="uc-link" to="/profile">
                        account
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-bookmark"></i>
                      </div>
                      <Link className="uc-link" to="/saved">
                        saved ICs
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <Link className="uc-link" to="/popular">
                        Popular ICs
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <Cpu size={24}/>
                      </div>
                      <Link className="uc-link" to="/logic">
                        Karnough map 
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-circle-question"></i>
                      </div>
                      <Link className="uc-link" to="/tersms-and-conditions">
                        help center{" "}
                      </Link>
                    </li>
                  </ul>
                  <div className="dark-mode">
                    <div className="info">
                      <div className="icon-2">
                        <i
                          className={`${
                            isDark ? "fa-solid fa-moon" : "fa-solid fa-sun "
                          }`}
                        ></i>
                      </div>
                       &nbsp;  dark mode
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        ref={darkRef}
                        onChange={handleDarkMode}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="log-out" onClick={handlelogout}>
                    <div className="icon-2">
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    log out
                  </div>
                </div>
              </li>
              <span>{myuser?.first_name || "username"}</span>
            </ul>
          </div>

          {/* Icons */}
          <i className="fa fa-user" onClick={toggleUserMenu}></i>
          <i className="fa fa-bars" onClick={toggleNav}></i>
        </div>
      </header>
    );
  } else {
    return (
      <>
        <header className="header">
          <div className="container">
            {/* Logo */}
            <div className="logo">
              <img src={logo} alt="logo" className="logo" />
            </div>

            {/* Navbar */}
            <nav className="navbar">
              <ul
                className={`nav-links ${showNav ? "show" : ""}`}
                id="navLinks"
              >
                <li className="link">
                  <a
                    className="active"
                    onClick={() => handleNavigation("/home", "home-Section")}
                    name="home-Section"
                  >
                    Home
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "about-us")}
                    name="about-us"
                  >
                    About US
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "ic-id")}
                    name="ic-id"
                  >
                    Services
                  </a>
                </li>
                <li className="link">
                  <a
                    onClick={() => handleNavigation("/home", "contactUS")}
                    name="contactUS"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>

              {/* Search */}
              <div className="search">
                <a
                  onClick={() => handleNavigation("/home", "ic-id")}
                  name="ic-id"
                >
                  <Link
                    to={{ hash: "#searching" }}
                    style={{
                      padding: "0",
                      border: "none",
                      textDecoration: "none",
                    }}
                  >
                    search
                  </Link>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </a>
              </div>
            </nav>

            {/* User Actions */}
            <div className={`user ${showUserMenu ? "show" : ""}`} id="userData">
              <Link to="/login" className="signin" id="signIn">
                Sign In
              </Link>
              <Link to="/register" className="register" id="Reg">
                Sign Up
              </Link>
            </div>

            {/* Icons */}
            <i className="fa fa-user" onClick={toggleUserMenu}></i>
            <i className="fa fa-bars" onClick={toggleNav}></i>
          </div>
        </header>{" "}
      </>
    );
  }
};

export default Header;