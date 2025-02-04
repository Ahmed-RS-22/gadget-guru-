import { useState } from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  const [subEmail, setSubEmail] = useState("");
  const [subError, setSubError] = useState("");
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
    const sendEamil = async()=>{
      try{
        if (isValidEmail(subEmail)) {
        }
        else {
          setSubError("enter a valid Email");
        }
      }catch(error){
        setSubError(error);
      }
    } 

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="content">
          <p className="message">{subError}</p>
          <div className="subscribe">
            <h2>Subscribe to our newsletter</h2>
            <div className="input-box">
              <input
                type="email"
                className="sub-inp"
                placeholder="enter your email"
                onChange={(e) => setSubEmail(e.target.value)}
              />
              <button className="sub-btn" onClick={sendEamil}>Subscribe</button>
            </div>
          </div>
          <div className="foot-nav">
            <ul className="f-links">
              <li>
                <Link to="/home#home-Section">Home</Link>
              </li>
              <li>
                <Link to="/home#about-us">About</Link>
              </li>
              <li>
                <Link to="/home#ic-id">Services</Link>
              </li>
              <li>
                <Link to="/home#contactUS">Contact</Link>
              </li>
            </ul>
            <ul className="social-links">
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i class="fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://x.com/" target="_blank" rel="noreferrer">
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i class="fa-brands fa-linkedin-in"></i>
                </a>
              </li>
              <li>
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <i class="fa-brands fa-github"></i>
                </a>
              </li>
            </ul>
          </div>
          <hr />
          <div className="copyright">
            <p>&copy; 2025 Gadget Guru, All rights reserved.</p>
            <Link to="/tersms-and-conditions">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
