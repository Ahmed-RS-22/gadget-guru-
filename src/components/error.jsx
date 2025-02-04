import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../assets/images/erorr.png"
import "../styles/models.css"; // Assuming your CSS file for styling
const ErrorPage = () => {
  return (
    <main>
      <div className="container error" >
        <div className="page">
          {/* Message Section */}
          <section className="message">
            <h1 className="title">
              We lost our way, but you can <span>go home safely.</span>
            </h1>
            <Link to="/" className="go-home">
              Go home
            </Link>
          </section>

          {/* Image Section */}
          <section className="img-holder">
            <img src={errorImg} alt="Error" />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
