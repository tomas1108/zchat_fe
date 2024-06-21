import React, { useState, useEffect } from 'react';
/* import { useTheme } from "@mui/material/styles"; */
import { Box, Stack, Typography } from "@mui/material";

import { Link } from "react-router-dom";
import ChatComponent from "./Conversation";
import Chats from "./Chats";
import Contact from "../../sections/Dashboard/Contact";

import { useSelector } from "react-redux";
import StarredMessages from "../../sections/Dashboard/StarredMessages";
import Media from "../../sections/Dashboard/SharedMessages";

import Pic3 from "../../assets/Images/pic3.png";
import Pic4 from "../../assets/Images/pic4.png";
import Pic5 from "../../assets/Images/pic6.png";


const GeneralApp = () => {
 /*  const [searchParams] = useSearchParams();

  const theme = useTheme(); */

  const { sideBar, room_id, chat_type } = useSelector((state) => state.app);


  const [imageIndex, setImageIndex] = useState(0);
  const images = [Pic3, Pic4, Pic5]; // Thay đổi đường dẫn đến hình ảnh tại đây

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Thay đổi hình sau mỗi 3 giây

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Chats />
        <Box
          sx={{
            height: "100%",
            width: sideBar.open
              ? `calc(100vw - 740px )`
              : "calc(100vw - 420px )",
            backgroundColor: "background.paper"
          
          }}
        >
          {chat_type === "individual" &&
            room_id !== null ? (
            <ChatComponent />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <Typography variant="h4">
                Welcome to ZChat Web
              </Typography>
              <img src={images[imageIndex]} alt="Mô tả hình ảnh" />
              <Typography variant="subtitle2">
                Select a Conversation or start
                <Link > new one</Link>
              </Typography>

            </Stack>
          )}
        </Box>
        {sideBar.open &&
          (() => {
            switch (sideBar.type) {
              case "CONTACT":
                return <Contact />;

              case "STARRED":
                return <StarredMessages />;

              case "SHARED":
                return <Media />;

              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default GeneralApp;
