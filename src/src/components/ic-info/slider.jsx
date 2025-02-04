import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function SliderImages({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const avimages = images.filter((img) => img !== undefined);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === avimages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? avimages.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
    setShowPreview(true);
  };

  return (
    <div className="slideshow-wrapper">
      {/* Main Slider */}
      <div className="slider">
        <div className="slide">
          <img
            src={avimages[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            onClick={() => handleImageClick(avimages[currentIndex])}
          />
        </div>

        {/* Navigation Buttons */}
        <button onClick={prevSlide} className="nav-button prev">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="nav-button next">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="thumbnails">
        {avimages.map((image, index) => (
          <div
            key={index}
            className={`thumbnail ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal">
          <button
            onClick={() => setShowPreview(false)}
            className="close-button"
          >
            <X size={32} />
          </button>
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
}

export default SliderImages;
