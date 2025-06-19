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

  // Try to get an initial id from location.state
  const [id, setId] = useState(location.state?.id || null);
  const [icInfo, setIcInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch logic: by ID if we have one, otherwise by Slug
  useEffect(() => {
    let cancelled = false;

    const loadIc = async () => {
      try {
        let data;
        if (id) {
          // 1) fetch by numeric ID
          const res = await axios.get(
            `https://gadetguru.mgheit.com/api/ic/show?id=${id}`
          );
          data = res.data.data;
        } else {
          // 2) fallback: fetch all ICs, find by Slug
          const resAll = await axios.get(
            "https://gadetguru.mgheit.com/api/ic"
          );
          const found = resAll.data.data.find((item) => item.Slug === Slug);

          if (!found) {
            // nothing matched
            data = null;
          } else {
            data = found;
            // save the newly discovered ID so future reloads get it
            window.history.replaceState({ id: found.ID }, "");
            setId(found.ID);
          }
        }

        if (!cancelled) {
          if (data) {
            setIcInfo({
              Id: data.ID,
              Ic_name: data.IC_commercial_name,
              Ic_code: data.IC_code,
              IC_vendor_name: data.IC_vendor_name,
              Slug: data.Slug,
              Ic_video: data.IC_video,
              Ic_files: data.IC_file,
              Images: [
                data.IC_image,
                data.IC_blogDiagram,
                data.IC_Details?.Chip_image,
                data.IC_Details?.Logic_DiagramImage,
              ],
              truth_table: data.IC_truth_table,
              Ic_details: data.IC_Details,
            });
          } else {
            setIcInfo({ notFound: true });
          }
        }
      } catch (err) {
        console.error("Error loading IC:", err);
      }
    };

    loadIc();
    return () => {
      cancelled = true;
    };
  }, [Slug]);

  // Check saved state once we have a valid id
  useEffect(() => {
    if (!id) return;

    const checkSaved = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo")).token;
        const res = await axios.get(
          "https://gadetguru.mgheit.com/api/ic/saved",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSaved(res.data.data.some((ic) => ic.ID === id));
      } catch (err) {
        console.error(err);
      }
    };

    checkSaved();
  }, [id]);

  const handleSaving = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const fd = new FormData();
      fd.append("ic_id", icInfo.Id);
      await axios.post(
        "https://gadetguru.mgheit.com/api/ic/save",
        fd,
        { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
      );
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoving = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const fd = new FormData();
      fd.append("ic_id", icInfo.Id);
      await axios.post(
        "https://gadetguru.mgheit.com/api/ic/remove",
        fd,
        { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
      );
      setIsSaved(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Modal fade-in / fade-out
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 10);
  };
  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  // Render guards
  if (!icInfo) {
    return (
      <section className="ic-info" id="icInfo">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (icInfo.notFound) {
    return (
      <section className="ic-info" id="icInfo">
        <div className="container">
          <h2>IC Not Found</h2>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="ic-info" id="icInfo">
      <div className="container">
        <div className="row up">
          <aside className="box left">
            <SliderImages images={icInfo.Images} />
          </aside>
          <aside className="box right">
            <div className="ic-names">
              <div className="text">
                <h2>{icInfo.Ic_code}</h2>
                <p>{icInfo.Ic_name}</p>
              </div>
              <button
                className="save"
                onClick={isSaved ? handleRemoving : handleSaving}
              >
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
              <button
                className="download"
                onClick={() => window.open(icInfo.Ic_files, "_blank")}
              >
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
