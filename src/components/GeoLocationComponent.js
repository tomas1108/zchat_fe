import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GeoLocationComponent = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get('https://ipinfo.io?token=16101f36e1d9f0'); // Thay YOUR_API_TOKEN bằng token của bạn
        setLocation(response.data);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      {location ? (
        <div>
          <h2>Your Location Information:</h2>
          <p>IP: {location.ip}</p>
          <p>City: {location.city}</p>
          <p>Region: {location.region}</p>
          <p>Country: {location.country}</p>
          <p>Location: {location.loc}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default GeoLocationComponent;
