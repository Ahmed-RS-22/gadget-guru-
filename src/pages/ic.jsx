import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import "../styles/models.css";
import SliderImages from "../components/slider";
import TruthTable from "../components/truthtable";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
const IcInfo = () => {
  const { Slug } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [icInfo, setIcInfo] = useState({
    Id: "",
    Ic_name: "",
    Ic_code: "",
    IC_vendor_name: "",
    Slug: "",
    Ic_video: "",
    Ic_files: "",
    Images: [],
    truth_table: [],
    Ic_details: {},
  });
  const [isSaved, setIsSaved] = useState(false);

  // Function to open modal with fade-in effect
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };

  // Function to close modal with fade-out effect
  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const fetchIcInfoById = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`https://gadetguru.mgheit.com/api/ic/show?id=${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const selectedIC = data.data;
      
      if (!selectedIC) {
        throw new Error('IC not found');
      }

      setIcInfo({
        Id: selectedIC?.ID || "",
        Ic_name: selectedIC?.IC_commercial_name || "",
        Ic_code: selectedIC?.IC_code || "",
        Ic_details: selectedIC?.IC_Details || {},
        IC_vendor_name: selectedIC?.IC_vendor_name || "",
        Slug: selectedIC?.Slug || "",
        Ic_video: selectedIC?.IC_video || "",
        Ic_files: selectedIC?.IC_file || "",
        Images: [
          selectedIC?.IC_image,
          selectedIC?.IC_blogDiagram,
          selectedIC?.IC_Details?.Chip_image,
          selectedIC?.IC_Details?.Logic_DiagramImage,
        ].filter(Boolean),
        truth_table: selectedIC?.IC_truth_table || [],
      });
    } catch (error) {
      console.error("Error fetching IC info by ID:", error);
      setError("Failed to load IC information");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIcInfoBySlug = async (slug) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://gadetguru.mgheit.com/api/ic');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const ICS = data?.data || [];
      const foundIC = ICS.find((item) => item.Slug === slug);
      
      if (!foundIC) {
        throw new Error('IC not found');
      }

      setIcInfo({
        Id: foundIC?.ID || "",
        Ic_name: foundIC?.IC_commercial_name || "",
        Ic_code: foundIC?.IC_code || "",
        Ic_details: foundIC?.IC_Details || {},
        IC_vendor_name: foundIC?.IC_vendor_name || "",
        Slug: foundIC?.Slug || "",
        Ic_video: foundIC?.IC_video || "",
        Ic_files: foundIC?.IC_file || "",
        Images: [
          foundIC?.IC_image,
          foundIC?.IC_blogDiagram,
          foundIC?.IC_Details?.Chip_image,
          foundIC?.IC_Details?.Logic_DiagramImage,
        ].filter(Boolean),
        truth_table: foundIC?.IC_truth_table || [],
      });
    } catch (error) {
      console.error("Error fetching IC info by slug:", error);
      setError("IC not found");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSaved = async (icId) => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;

      const token = JSON.parse(userInfo).token;
      const response = await fetch("https://gadetguru.mgheit.com/api/ic/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const savedICs = data.data || [];
        const currentIC = savedICs.some((ic) => ic.ID === icId);
        setIsSaved(currentIC);
      }
    } catch (error) {
      console.error("Error fetching saved ICs:", error);
    }
  };

  // Main useEffect for data fetching
  useEffect(() => {
    const locationId = location.state?.id;
    
    if (locationId) {
      // Priority 1: Use ID from location state (navigation from another page)
      fetchIcInfoById(locationId);
    } else if (Slug) {
      // Priority 2: Use slug from URL params (direct URL access or refresh)
      fetchIcInfoBySlug(Slug);
    } else {
      // No valid identifier found
      setError("No IC identifier provided");
      setIsLoading(false);
    }
  }, [Slug, location.state?.id]);

  // Check if IC is saved when icInfo.Id changes
  useEffect(() => {
    if (icInfo.Id) {
      checkSaved(icInfo.Id);
    }
  }, [icInfo.Id]);

  const handleSaving = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;

      const token = JSON.parse(userInfo).token;
      const formData = new FormData();
      formData.append("ic_id", icInfo.Id);

      const response = await fetch("https://gadetguru.mgheit.com/api/ic/save", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving IC:", error);
    }
  };

  const handleRemoving = async () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return;

      const token = JSON.parse(userInfo).token;
      const formData = new FormData();
      formData.append("ic_id", icInfo.Id);

      const response = await fetch("https://gadetguru.mgheit.com/api/ic/remove", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error removing IC:", error);
    }
  };

  const handleVideoClick = () => {
    if (icInfo.Ic_video) {
      openModal();
    }
  };

  const handleDownloadClick = () => {
    if (icInfo.Ic_files) {
      window.open(icInfo.Ic_files, "_blank");
    }
  };

  if (isLoading) {
    return (
      <section className="ic-info" id="icInfo">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading IC information...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ic-info" id="icInfo">
        <div className="container">
          <div className="error-container">
            <h2>IC Not Found</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className="ic-info" id="icInfo">
      <div className="container">
        <div className="row up">
          <aside className="box left">
            <SliderImages images={icInfo.Images.map((img) => img)} />
          </aside>
          <aside className="box right">
            <div className="ic-names">
              <div className="text">
                <h2>{icInfo.Ic_code}</h2>
                <p>{icInfo.Ic_name}</p>
              </div>
              <button className="save" onClick={isSaved ? handleRemoving : handleSaving}>
                <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark`} />
              </button>
            </div>
            <div className="ic-details">
              <h2>Product Details</h2>
              <nav className="navbar">
                <ul className="details">
                  <li className="detail">
                    <NavLink to="params">Parameters</NavLink>
                  </li>
                  <li className="detail">
                    <NavLink to="package">Package | Pins | Size</NavLink>
                  </li>
                  <li className="detail">
                    <NavLink to="features">Features</NavLink>
                  </li>
                  <li className="detail">
                    <NavLink to="description">Description</NavLink>
                  </li>
                </ul>
                <hr />
              </nav>
              <div className="info">
                <Outlet context={{ icInfo }} />
              </div>
            </div>
            <div className="btns">
              <button className="download" onClick={() => window.open(icInfo.Ic_files, "_blank")}>
                <i className="fa-solid fa-file-pdf" /> Download Datasheet
              </button>
              <button className="video-btn" onClick={openModal}>
                <i className="fa-brands fa-square-youtube" /> Watch Video
              </button>
              {isOpen && (
                <div className={`video ${isVisible ? "fade-in" : "fade-out"}`}>
                  <div className="box">
                    <span className="close" onClick={closeModal}>
                      <i className="fa-solid fa-xmark" />
                    </span>
                    <div className="content">
                      <iframe
                        className="video-frame"
                        src={icInfo.Ic_video.replace(/watch\?v=/, "embed/")}
                        title="IC Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
        <div className="row down">
          <TruthTable data={icInfo.truth_table} />
        </div>
      </div>
    </section>
  );
};

export default IcInfo;