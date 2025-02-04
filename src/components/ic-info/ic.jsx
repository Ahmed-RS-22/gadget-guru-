import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import "../../styles/models.css";
import SliderImages from "./slider";
import TruthTable from "./truthtable";
import axios from "axios";

const IcInfo = () => {
  const { Slug } = useParams();
  const location = useLocation();
  const [id, setId] = useState(location.state?.id);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Controls fade effect
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
    Ic_details: [],
  });
  const [isSaved, setIsSaved] = useState(false);

  // Function to open modal with fade-in effect
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 10); // Small delay to trigger animation
  };

  // Function to close modal with fade-out effect
  const closeModal = () => {
    setIsVisible(false); // Start fade-out animation
    setTimeout(() => setIsOpen(false), 50); // Wait for animation to finish before hiding
  };

  const fetchIcInfo = async (id) => {
    try {
      const response = await axios.get(`https://gadetguru.mgheit.com/api/ic/show?id=${id}`);
      const selectedIC = response.data.data;
      setIcInfo({
        Id: selectedIC?.ID,
        Ic_name: selectedIC?.IC_commercial_name,
        Ic_code: selectedIC?.IC_code,
        Ic_details: selectedIC?.IC_Details,
        IC_vendor_name: selectedIC?.IC_vendor_name,
        Slug: selectedIC?.Slug,
        Ic_video: selectedIC?.IC_video,
        Ic_files: selectedIC?.IC_file,
        Images: [
          selectedIC?.IC_image,
          selectedIC?.IC_blogDiagram,
          selectedIC.IC_Details[0]?.Chip_image,
          selectedIC.IC_Details[0]?.Logic_DiagramImage,
        ],
        truth_table: selectedIC?.IC_truth_table,
      });
    } catch (error) {
      console.error("Error fetching IC info:", error);
    }
  };

  const getAllICs = async () => {
    try {
      const response = await axios.get('https://gadetguru.mgheit.com/api/ic');
      const ICS = response.data?.data;
      const foundIC = ICS.find((item) => item.Slug === Slug);
      if (foundIC) {
        setIcInfo({
          Id: foundIC?.ID,
          Ic_name: foundIC?.IC_commercial_name,
          Ic_code: foundIC?.IC_code,
          Ic_details: foundIC?.IC_Details,
          IC_vendor_name: foundIC?.IC_vendor_name,
          Slug: foundIC?.Slug,
          Ic_video: foundIC?.IC_video,
          Ic_files: foundIC?.IC_file,
          Images: [
            foundIC?.IC_image,
            foundIC?.IC_blogDiagram,
            foundIC.IC_Details[0]?.Chip_image,
            foundIC.IC_Details[0]?.Logic_DiagramImage,
          ],
          truth_table: foundIC?.IC_truth_table,
        });
        setId(foundIC.ID)        
      } else {
        setId(0);
      }
    } catch (error) {
      console.error("Error fetching all ICs:", error);
    }
  };

  useEffect(() => {
    if (location.state?.id) {
      fetchIcInfo(id);
    } else {
      getAllICs();
    }
  }, [id, location.state?.id, Slug]);

  const checkSaved = async () => {
    try {
      const response = await axios.get(
        "https://gadetguru.mgheit.com/api/ic/saved",
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        }
      );
      const savedICs = response.data.data;            
      const currentIC = savedICs
        .filter((ic) => ic.ID === id)
        .some((ic) => ic.ID === id);     
        if (currentIC) {
          setIsSaved(true);
        }
        else{
          setIsSaved(false);
        }   
      } catch (error) {
      console.error("Error fetching saved ICs:", error);
    }
  };
  useEffect(() => {
    checkSaved();
  },);

  const handleSaving = async () => {
    const formData = new FormData();
    formData.append("ic_id", icInfo.Id);
    try {
      await axios.post("https://gadetguru.mgheit.com/api/ic/save", formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
        },
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving IC:", error);
    }
  };

  const handleRemoving = async () => {    
    const formData = new FormData();
    formData.append("ic_id", icInfo.Id);
    try {
      await axios.post("https://gadetguru.mgheit.com/api/ic/remove", formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
        },
      });
      setIsSaved(false);
    } catch (error) {
      console.error("Error saving IC:", error);
    }
  };

  if (id === 0) {
    return (
      <section className="ic-info" id="icInfo">
        <div className="container">
          <h2>Wrong IC</h2>
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
                <i className="fa-solid fa-file-pdf" />
                Download Datasheet
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