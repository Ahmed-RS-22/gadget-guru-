import React, { use, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import markerIcon from "../assets/marker.png";

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32], // middle bottom
  popupAnchor: [0, -32],
});

const DraggableMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      icon={customMarkerIcon}
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    />
  );
};

const MapPicker = ({ lat, lng, setLatLng, isEditMode, token }) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat:"",
    lng: "", 
  });
  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        "https://gadetguru.mgheit.com/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const result = response.data.data;
      console.log(result);
      setCurrentPosition((prev) => ({
        ...prev,
        lat: result.latitude,
        lng: result.longitude,
      }));
     
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
      getUserInfo();
      
    }, []);
    

  const [position, setPosition] = useState([lat || currentPosition.lat, lng || currentPosition.lng]);

  const updatePosition = (pos) => {
    setPosition(pos);
    setLatLng({ lat: pos[0], lng: pos[1] });
  };
  return (
    <div style={{ height: "300px", width: "100%", marginTop: "1rem" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {isEditMode && (
          <DraggableMarker position={position} setPosition={updatePosition} />
        )}
        {!isEditMode && (
          <Marker
            position={position}
            icon={customMarkerIcon}
        
          ></Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
