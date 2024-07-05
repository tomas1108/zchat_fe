// import React, { useEffect } from 'react';

// const MusicPlayer = ({ fileName }) => {
//   useEffect(() => {
//     const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/${fileName}`);
//     audio.play().catch(error => {
//       console.error("Failed to play audio:", error);
//     });
//   }, [fileName]);

//   return null; // Không cần render bất cứ gì
// };

// export default MusicPlayer;

export const playMuisic = (fileName) => {
    const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/${fileName}`);
    audio.play().catch(error => {
        console.error("Failed to play audio:", error);
    });
    }
