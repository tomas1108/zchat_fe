import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  Bell,
  CircleDashed,
  MagnifyingGlass,
  UserPlus,
  Users,
} from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import Friends from "../../sections/Dashboard/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations } from "../../redux/slices/conversation";

import ScrollbarNormal from "../../components/ScrollbarNormal";
import NotificationBell from "../../components/NotificationBell";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { GroupAdd, PersonAdd, PersonAddAlt, PersonAddAlt1 } from "@mui/icons-material";
import CreateGroup from "../../sections/main/CreateGroup";

const user_id = window.localStorage.getItem("user_id");

// const Chats = () => {
//   const theme = useTheme();
//   const isDesktop = useResponsive("up", "md");
//   const dispatch = useDispatch();
//   const {conversations} = useSelector((state) => state.conversation.direct_chat);

//   useEffect(() => {
//     socket.emit("get_direct_conversations", {user_id} , (data) => {
//       console.log("Get direct" ,data); // this data is the list of conversations
//       // dispatch action
//       dispatch(FetchDirectConversations({ conversations: data }));
//     });
//   }, [dispatch ]);

//   const [openDialog, setOpenDialog] = useState(false);

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };
//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };
//   /// group
//   const { group_conversation, connections } = useSelector((state) => state.group);
//   const [activeGroupId, setActiveGroupId] = useState(null);

//   const handleSelectGroup = (groupId) => {
//     setActiveGroupId(groupId);
//   };
//   const [openNewGroup, setOpenNewGroup] = useState(false);

//   const handleCloseCreateGroup = () => {
//     setOpenNewGroup(false);
//   };
//   const handleOpenCreateGroup = () => {
//     setOpenNewGroup(true);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           position: "relative",
//           height: "100%",
//           width: isDesktop ? 320 : "100vw",
//           backgroundColor:
//             theme.palette.mode === "light"
//               ? "#F8FAFF"
//               : theme.palette.background,

//           boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
//         }}
//       >
//         {!isDesktop && (
//           // Bottom Nav
//           <BottomNav />
//         )}

//         <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
//           <Stack
//             alignItems={"center"}
//             justifyContent="space-between"
//             direction="row"
//           >

//             <Typography variant="h5">Chats</Typography>

//             <Stack direction={"row"} alignItems="center" spacing={1}>
//               <Tooltip title="Add friend">
//               <IconButton
//                 onClick={() => {
//                   handleOpenDialog();
//                 }}
//                 sx={{ width: "max-content" }}
//               >
//                 <PersonAddAlt1 />
//               </IconButton>
//               </Tooltip>

//               <Tooltip title="Create group">
//               <IconButton
//                  onClick={() => {
//                   handleOpenCreateGroup();
//                  }} > 
//                 <GroupAdd />
//               </IconButton>
//               </Tooltip>

//               {/* <NotificationButton  /> */}
//               <NotificationBell />


//             </Stack>
//           </Stack>
//           <Stack sx={{ width: "100%" }}>
//             <Search>
//               <SearchIconWrapper>
//                 <MagnifyingGlass color="#709CE6" />
//               </SearchIconWrapper>
//               <StyledInputBase
//                 placeholder="Search"
//                 inputProps={{ "aria-label": "search" }}
//               />
//             </Search>
//           </Stack>
//           <Stack spacing={1}>
//             <Stack direction={"row"} spacing={1.5} alignItems="center">

//             </Stack>
//             <Divider />
//           </Stack>
//           <Stack sx={{ flexGrow: 1,  height: "100%" }}>
//            <ScrollbarNormal autoHeightMin="75vh" >
//               <Stack spacing={2.4}>
//                 {/* <Typography variant="subtitle2" sx={{ color: "#676667" }}>
//                   Pinned
//                 </Typography> */}
//                 {/* Chat List */}
//                 {/* {ChatList.filter((el) => el.pinned).map((el, idx) => {
//                   return <ChatElement {...el} />;
//                 })} */}
//                 <Typography variant="subtitle2" sx={{ color: "#676667" }}>
//                   All Chats
//                 </Typography>
//                 {/* Chat List */}

//                 {conversations.filter((el) => !el.pinned).map((el, idx) => {
//                               // console.log("conversations", conversations);  
//                   return <ChatElement key={idx} {...el} />;
//                 })}
//               </Stack>
//             </ScrollbarNormal>
//           </Stack>
//         </Stack>
//       </Box>
//       {openDialog && (
//         <Friends open={openDialog} handleClose={handleCloseDialog} />
//       )}
//         {openNewGroup && (
//         <CreateGroup open={openNewGroup} handleClose={handleCloseCreateGroup} />
//       )}
//     </>
//   );
// };


const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();

  // Lấy danh sách cuộc trò chuyện từ Redux
  const { conversations } = useSelector((state) => state.conversation.direct_chat);

  // Sử dụng useEffect để fetch danh sách cuộc trò chuyện khi component mount
  useEffect(() => {
    const user_id = window.localStorage.getItem("user_id"); // Lấy user_id từ local storage
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      console.log("Get direct conversations", data);
      // Dispatch action để lưu danh sách cuộc trò chuyện vào Redux
      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, [dispatch]);

  // State và hàm xử lý cho dialog Add friend
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // State và hàm xử lý cho dialog Create group
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const handleOpenCreateGroup = () => {
    setOpenNewGroup(true);
  };
  const handleCloseCreateGroup = () => {
    setOpenNewGroup(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.default,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && <BottomNav />}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh", overflowY: "auto" }}>
          <Stack alignItems="center" justifyContent="space-between" direction="row">
            <Typography variant="h5">Chats</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tooltip title="Add friend">
                <IconButton onClick={handleOpenDialog} sx={{ width: "max-content" }}>
                  <PersonAddAlt1 />
                </IconButton>
              </Tooltip>
              <Tooltip title="Create group">
                <IconButton onClick={handleOpenCreateGroup}>
                  <GroupAdd />
                </IconButton>
              </Tooltip>
              <NotificationBell /> {/* Thêm component NotificationBell */}
            </Stack>
          </Stack>

          {/* Search Box */}
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search" inputProps={{ "aria-label": "search" }} />
            </Search>
          </Stack>

          <Divider />
         

          {/* Danh sách các cuộc trò chuyện */}
          <Stack sx={{ flexGrow: 1 }}>
            <ScrollbarNormal autoHeightMin="75vh">
              <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
            All Chats
          </Typography>
                {/* Dùng conversations đã được sắp xếp mới nhất đầu */}
                {conversations
                  .slice()
                  .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sắp xếp theo thời gian mới nhất
                  .map((conversation, idx) => (
                    <ChatElement key={idx} {...conversation} />
                  ))}
              </Stack>
            </ScrollbarNormal>
          </Stack>
        </Stack>
      </Box>

      {/* Dialog Add friend */}
      {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}

      {/* Dialog Create group */}
      {openNewGroup && <CreateGroup open={openNewGroup} handleClose={handleCloseCreateGroup} />}
    </>
  );
};
export default Chats;
