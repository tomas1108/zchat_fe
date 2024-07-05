import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import { MagnifyingGlass, Phone } from "phosphor-react";
import React, { useEffect, useState } from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";

import { useTheme } from "@mui/material/styles";
import { CallLogElement } from "../../components/CallElement";
import StartCall from "../../sections/Dashboard/StartCall";
import { useDispatch, useSelector } from "react-redux";
import { FetchCallLogs } from "../../redux/slices/app";
import ScrollbarNormal from "../../components/ScrollbarNormal";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import NotificationBell from "../../components/NotificationBell";
const Call = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchCallLogs());
  }, []);
  const { call_logs } = useSelector((state) => state.app);
  const [openDialog, setOpenDialog] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const theme = useTheme();
  return (
    <>
   <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Call Logs</Typography>

              <Stack direction={"row"} alignItems="center" spacing={1}>

                <Tooltip title= "Make a call">
                <IconButton
                  onClick={() => {
                    handleOpenDialog();
                  }}
                  sx={{ width: "max-content" }}
                >
                  <Phone />
                </IconButton>
                </Tooltip>
            
                <NotificationBell />
              </Stack>
            </Stack>

            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>

            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
             
            </Stack>
            <Divider />
            <Stack sx={{ flexGrow: 1, height: "100%" }}>
            <ScrollbarNormal autoHeightMin="75vh" >
                <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  All Calls
                </Typography>
                  {call_logs.map((el, idx) => {
                    return <CallLogElement key={idx} {...el} />;
                  })}
                </Stack>
              </ScrollbarNormal>
            </Stack>
          </Stack>
        </Box>
 
      {openDialog && (
        <StartCall open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Call;
