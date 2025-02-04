import React, { useEffect, useState } from "react";
import "../styles/main.css";
import { useLocation,useNavigate } from "react-router-dom";
import home from "../assets/images/home-1.png"
import about from "../assets/images/about.png"
import card1 from "../assets/images/card-1.png"
import card2 from "../assets/images/card-2.png"
import card3 from "../assets/images/card-3.png"
import card4 from "../assets/images/card-4.png"
import team1 from "../assets/images/team-1.jpg"
import axios from "axios";
import Search from "../components/search";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message ,setMessage]=useState({
    name:"",
    email:"",
    subject:"",
    message:""
  })
  const handleMessage= async(e)=>{
    e.preventDefault();
    console.log(message);
    
    const formData = new FormData();
    formData.append("name", message.name);
    formData.append("email", message.email);
    formData.append("subject", message.subject);
    formData.append("message", message.message);
    try{
      const response = await axios.post("https://gadetguru.mgheit.com/api/message",
      formData,{
        headers:{
          Accept:"application/json",
        },
        
      });
      console.log(response.data);
    }catch(error){
      console.log(error);
    }
  }
  
  let goToSearch = () => {
    navigate({
      hash:"searching"
    });
  };
  useEffect(() => {
    const hash = location.hash.replace("#", ""); // Extract section ID from hash
    if (hash) {
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <main className="home" id="home">
      <section className="home-section" id="home-Section">
        <div className="container">
          <section className="sec-1">
            <span className="discover link">Discover ICs</span>
            <h1 className="title">Identify , Understand , and Master ICs</h1>
            <p className="message">
              Your trusted platform to easily identify and understand integrated
              circuits, empowering you to take your electronics expertise to the
              next level.
            </p>
            <div className="btns">
              <button className="identify link" onClick={goToSearch}>
                IDENTIFY NOW
                <i className="fa-solid fa-circle-chevron-right icon"></i>
              </button>
              <a className="link" href="#">
                WATCH DEMO
                <i className="fa-solid fa-circle-play icon"></i>
              </a>
            </div>
          </section>
          <section className="sec-2">
            <div className="images">
              <img src={home}alt="..." />
            </div>
          </section>
        </div>
      </section>

      {/* About Us */}
      <section className="about-us" id="about-us">
        <div className="container">
          <section className="sec-1">
            <div className="image">
              <img src={about} alt="" />
            </div>
          </section>
          <section className="sec2">
            <div className="content">
              <p className="title">About Us</p>
              <h2>IC-Centered Assistance</h2>
              <p className="description">
                We are dedicated to simplifying IC identification in a
                user-friendly and efficient platform. Our team of experienced
                and passionate professionals is here to make your journey in
                electronics smooth and hassle-free.
              </p>
              <h3 className="sub-title">Our Mission</h3>
              <p className="description">
                At Gadget Guru, our mission is to help users identify,
                understand, and master ICs effortlessly.
              </p>
              <a href="#" className="learn link">
                Learn More <i className="fa-solid fa-location-arrow"></i>
              </a>
            </div>
          </section>
        </div>
      </section>

      {/* Identification */}
      <section className="idintify" id="ic-id">
        <div className="container">
          <section className="sec-1">
            <div className="testimonials">
              {[
                {
                  img:card1,
                  title: "Easy Identification",
                  desc: "Upload an image or enter an IC number to quickly identify and understand integrated circuits.",
                },
                {
                  img: card2,
                  title: "Extensive Database",
                  desc: "Access a comprehensive IC library with detailed datasheets and specifications",
                },
                {
                  img:card3,
                  title: "Guided Learning",
                  desc: "Learn how to identify and use ICs effectively with our easy-to-follow tutorials and resources.",
                },
                {
                  img: card4,
                  title: "Accurate Results",
                  desc: "Experience seamless IC identification with our advanced tools, ensuring precision every time.",
                },
              ].map((card, index) => (
                <div className="card" key={index}>
                  <div className="image">
                    <img src={card.img} alt="..." />
                  </div>
                  <h3 className="title">{card.title}</h3>
                  <p className="description">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="sec-2" id="searching">
            <div className="content">
              <h2 className="title">Get Started with Gadget Guru Today</h2>
              <p className="description">
                We provide a seamless platform for IC identification, allowing
                you to search by text or upload an image to find detailed
                information about your components in seconds.
              </p>
          <Search ></Search>
            </div>
          </section>
        </div>
      </section>

      {/* Team */}
      <section className="team">
        <div className="pointer"></div>
        <div className="container">
          <section className="sec-title">
            <h2 className="title">Our Team</h2>
            <p className="description">
              At Gadget Guru, we focus on making IC identification simple and
              accessible. Our team has the knowledge and experience to help
              users find accurate information about their components quickly. We
              are committed to supporting both beginners and professionals in
              their journey to understand and use ICs effectively.
            </p>
          </section>
          <section className="sec-mission">
            <div className="back-lay">
              <p className="description">
                Our mission is to be the go-to platform for anyone looking to
                identify and understand ICs while providing an intuitive and
                reliable experience for all our users.
              </p>
            </div>
          </section>
          <section className="sec-team">
            <div className="team-members side-scrolling-container ">
              {[
                {
                  name: "Mohamed Saad",
                  image: team1,
                  role: "Back-End Developer",
                },
                {
                  name: "Reham Hassan",
                  image: team1,
                  role: "UI/UX Designer",
                },
                {
                  name: "Omnia Emad",
                  image: team1,
                  role: "Android Developer",
                },
                {
                  name: "Amina Kamal",
                  image: team1,
                  role: "Android Developer",
                },
                {
                  name: "Ahmed Reda",
                  image: team1,
                  role: "Front-End Developer",
                },
              ].map((member, index) => (
                <div className="scrolling">
                  <div className="card top" key={index}>
                    <div className="image">
                      <img src={member.image} alt="..." />
                    </div>
                    <h3 className="name">{member.name}</h3>
                    <p className="desc">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Contact Us */}
      <section className="contact-US" id="contactUS">
        <div className="container">
          <section className="sec-1">
            <ul className="social">
              {["facebook-f", "instagram", "x-twitter"].map((icon, index) => (
                <li key={index}>
                  <a href="#" className="social-link">
                    <i className={`fa-brands fa-${icon}`}></i>
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="title">Contact Us</h2>
            <p className="description">
              Get in touch with us. We're here to assist you.
            </p>
          </section>
          <section className="sec-2">
            <form id="contact-Form" onSubmit={handleMessage}>
              <div className="form-group">
                {[
                  {
                    id: "Fname",
                    label: "First Name",
                    type: "text",
                    placeholder: "enter your first name",
                    key:"name"
                  },
                  {
                    id: "Lname",
                    label: "Last Name",
                    type: "text",
                    placeholder: "enter your last name",
                    key:"name"
                  },
                  {
                    id: "Contact-email",
                    label: "E-mail",
                    type: "email",
                    placeholder: "enter your email address",
                    key:"email"
                  },
                  {
                    id: "subject",
                    label: "Subject",
                    type: "text",
                    placeholder: "enter subject",
                    key:"subject"
                  },
                ].map((input, index) => (
                  <div className="input-holder" key={index}>
                    <label htmlFor={input.id}>{input.label}</label>
                    <input
                      type={input.type}
                      id={input.id}
                      name={input.id}
                      required
                      placeholder={input.placeholder}
                      onChange={(e)=>{
                        setMessage((prev)=>({
                          ...prev,
                          [input.key]:`${e.target.value}`
                        }))
                      }}
                    />
                  </div>
                ))}
                <div className="input-holder area">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Enter your message"
                    onChange={(e)=>{
                      setMessage((prev)=>({
                        ...prev,
                        message:`${e.target.value}`
                      }))
                    }}
                  ></textarea>
                </div>
              </div>
              <input type="submit" value="Send a message" id="Contact-submit" />
            </form>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Home;
