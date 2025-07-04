import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-1.png";
import "../styles/models.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {Cpu} from "lucide-react"; 

const Header = ({ isUserLogged, onLogout, userInfo: propUserInfo }) => {
  const darkRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef();
  
  // Use userInfo from props if available, otherwise from localStorage
  const [userInfo, setUserInfo] = useState(() => {
    if (propUserInfo && propUserInfo.token) {
      return propUserInfo;
    }
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update header class based on scroll
  useEffect(() => {
    if (headerRef.current) {
      if (isScrolled) {
        headerRef.current.classList.add('scrolled');
      } else {
        headerRef.current.classList.remove('scrolled');
      }
    }
  }, [isScrolled]);

  // Update userInfo when props change (important for social login)
  useEffect(() => {
    if (propUserInfo && propUserInfo.token && 
        (propUserInfo.token !== userInfo.token || 
         propUserInfo.isUserLoggedIn !== userInfo.isUserLoggedIn)) {
      setUserInfo(propUserInfo);
    }
  }, [propUserInfo, userInfo.token, userInfo.isUserLoggedIn]);

  // Memoize getUserInfo to prevent unnecessary re-renders
  const getUserInfo = useCallback(async () => {
    // Check both prop and state for login status
    const isLoggedIn = isUserLogged || userInfo?.isUserLoggedIn;
    const token = userInfo?.token;
    
    if (isLoggedIn && token) {
      try {
        const response = await axios.get("https://gadetguru.mgheit.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        
        const result = response.data.data;
        setMyuser(prevUser => {
          // Only update if the data has actually changed
          if (JSON.stringify(prevUser) !== JSON.stringify(result)) {
            return result;
          }
          return prevUser;
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If token is invalid, logout the user
        if (error.response?.status === 401) {
          handlelogout();
        }
      }
    }
  }, [userInfo?.token, userInfo?.isUserLoggedIn, isUserLogged]);

  // Listen for localStorage changes (for social login and cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
          const parsedUserInfo = JSON.parse(stored);
          // Only update if the data has actually changed
          if (parsedUserInfo.token !== userInfo.token || 
              parsedUserInfo.isUserLoggedIn !== userInfo.isUserLoggedIn) {
            setUserInfo(parsedUserInfo);
          }
        }
      } catch (error) {
        console.error("Error parsing userInfo from storage:", error);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event we'll dispatch after social login
    const handleLoginEvent = () => {
      handleStorageChange();
    };
    window.addEventListener('userLoggedIn', handleLoginEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, [userInfo.token, userInfo.isUserLoggedIn]);

  // Call getUserInfo when userInfo or login status changes, but with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getUserInfo();
    }, 100); // Small delay to prevent rapid calls

    return () => clearTimeout(timeoutId);
  }, [getUserInfo]);

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
  const closeMenus = useCallback((e) => {
    if (
      !e.target.closest(".fa-bars") &&
      !e.target.closest(".fa-user") &&
      !e.target.closest("#navLinks") &&
      !e.target.closest("#userData")
    ) {
      setShowNav(false);
      setShowUserMenu(false);
    }
  }, []);

  const closeUserMenus = useCallback((e) => {
    if (
      !e.target.closest(".fa-user") &&
      !e.target.closest(".fa-circle-user") &&
      !e.target.closest(".user-control")
    ) {
      setIsMenuOpen(false);
    }
  }, []);

  // Add event listener to close menus on click outside
  useEffect(() => {
    document.addEventListener("click", closeMenus);
    document.addEventListener("click", closeUserMenus);
    
    return () => {
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("click", closeUserMenus);
    };
  }, [closeMenus, closeUserMenus]);

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

  const handleDarkMode = () => {
    if (darkRef.current.checked) {
      setIsDark(true);
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("darkMode", "false");
    }
  };

  // Load dark mode preference on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setIsDark(true);
      document.body.classList.add("dark");
      if (darkRef.current) {
        darkRef.current.checked = true;
      }
    }
  }, []);

  // Check if user is logged in using both props and userInfo state
  const isLoggedIn = isUserLogged || (userInfo?.isUserLoggedIn && userInfo?.token);

  if (isLoggedIn) {
    return (
      <header className="header" ref={headerRef}>
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <Link to="/home">
              <img src={logo} alt="Gadget Guru Logo" className="logo" />
            </Link>
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
              <Link className="icon icon-1 sp" to={"/logic"} title="Karnaugh Map Tool">
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
                          ? myuser.first_name
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
                        Account
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-bookmark"></i>
                      </div>
                      <Link className="uc-link" to="/saved">
                        Saved ICs
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
                        Karnaugh Map 
                      </Link>
                    </li>
                    <li className="item">
                      <div className="icon-2">
                        <i className="fa-solid fa-circle-question"></i>
                      </div>
                      <Link className="uc-link" to="/tersms-and-conditions">
                        Help Center
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
                       &nbsp;  Dark Mode
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
                    Log Out
                  </div>
                </div>
              </li>
              <span>{myuser?.first_name || "User"}</span>
            </ul>
          </div>

          {/* Mobile Icons */}
          <i className="fa fa-user" onClick={toggleUserMenu}></i>
          <i className="fa fa-bars" onClick={toggleNav}></i>
        </div>
      </header>
    );
  } else {
    return (
      <header className="header" ref={headerRef}>
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <Link to="/home">
              <img src={logo} alt="Gadget Guru Logo" className="logo" />
            </Link>
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

          {/* Mobile Icons */}
          <i className="fa fa-user" onClick={toggleUserMenu}></i>
          <i className="fa fa-bars" onClick={toggleNav}></i>
        </div>
      </header>
    );
  }
};

export default Header;