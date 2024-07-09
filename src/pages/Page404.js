import React, { useState, useEffect } from 'react';
import GeoLocationComponent from "../components/GeoLocationComponent";
import MusicPlayer from "../components/MusicPlayer";
import { dateTime, compareDateTime } from "../utils/dateTime";


const Page404 = () => {
  // return <>404</>;
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
//   useEffect(() => {
//     const interval = setInterval(() => {
//         const now = dateTime();
//         setCurrentDateTime(now);
//         const inputDateTime = '05/07/2024 20:18:14'; // Định dạng dd/MM/yyyy HH:mm:ss
//         const result = compareDateTime(inputDateTime);
//         setComparisonResult(result);
//     }, 1000); // Cập nhật mỗi giây

//     return () => clearInterval(interval); // Xóa interval khi component unmount
// }, []);

  return (
    <div>
      <h1>Welcome to My Website</h1>
      <GeoLocationComponent />
      {/* <MusicPlayer fileName="Tieng-dang-soan-tin-nhan-messenger-www_tiengdong_com (mp3cut.net).mp3" /> */}
      {/* <h1>Ngày giờ hiện tại:</h1>
            <p>{currentDateTime}</p>
            <h1>Kết quả so sánh:</h1>
            <p>{comparisonResult}</p> */}
    </div>
  );
};


export default Page404;