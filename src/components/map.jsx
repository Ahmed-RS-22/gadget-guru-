import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import markerIcon from "../assets/marker.png";

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
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
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
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
        const latValue = result.latitude || 30.0444;
        const lngValue = result.longitude || 31.2357;

        const pos = [latValue, lngValue];
        setPosition(pos);
        setLatLng({ lat: latValue, lng: lngValue });
      } catch (error) {
        console.log(error);
        setPosition([30.0444, 31.2357]); // fallback Cairo
      }
    };

    fetchUserInfo();
  }, [ ]);

  const updatePosition = (pos) => {
    setPosition(pos);
    setLatLng({ lat: pos[0], lng: pos[1] });
  };

  return (
    <div style={{ height: "450px", width: "100%", marginTop: "1rem" }}>
      {position ? (
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {isEditMode ? (
            <DraggableMarker position={position} setPosition={updatePosition} />
          ) : (
            <Marker position={position} icon={customMarkerIcon} />
          )}
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapPicker;
