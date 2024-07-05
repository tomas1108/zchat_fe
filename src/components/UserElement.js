import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat, Phone, Plus, Prohibit, UserPlus, VideoCamera } from "phosphor-react";
import { socket } from "../socket";
import { FetchDirectConversations } from "../redux/slices/conversation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { DeleteFriend } from "../redux/slices/app";
import { ChatBubble, CheckCircleOutline, HighlightOffOutlined, PersonRemoveAlt1Outlined, PlusOne } from "@mui/icons-material";
import { removeNotification } from "../redux/slices/notification";
const user_id = window.localStorage.getItem("user_id");
const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
const StyledIcon = styled('div')({
  display: 'inline-block',
  width: '24px',
  height: '24px',
  marginRight: '8px',
});

const ConfirmButton = styled(Button)({
  backgroundColor: '#1877F2', // Màu xanh dương
  color: '#fff',
  '&:hover': {
    backgroundColor: '#145db0', // Màu khi hover
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: 'gray', // Màu xám
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2c2d2e', // Màu khi hover
  },
});

/// mai chỉnh lại requestStatus lưu vào state
const UserElement = ({ img, firstName, lastName, online, _id, email }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isRequestSent, setIsRequestSent] = useState(false); // Lưu trữ trạng thái của nút button
  const [isLoading, setIsLoading] = useState(false); // Lưu trữ trạng thái loading
  const [isMounted, setIsMounted] = useState(false); // Biến để theo dõi component đã mounted hay chưa
 
  const name = `${firstName} ${lastName}`;
  const buttonStyle = {
    fontSize: '13px', // Điều chỉnh kích thước font chữ tại đây
    focus: 'none', // Loại bỏ hiệu ứng focus khi click vào button
  }
  const requestStatus = useSelector((state) =>
    state.app.users.find(user => user._id === _id)?.requestStatus
  );

  useEffect(() => {
    setIsMounted(true); // Đánh dấu component đã mounted
    return () => setIsMounted(false); // Đánh dấu component đã unmounted khi component bị xoá khỏi DOM
  }, []);

  useEffect(() => {
    // Kiểm tra xem component đã mounted và trạng thái đã được thiết lập chưa
    if (isMounted && requestStatus === "pending") {
      setIsRequestSent(true); // Nếu trạng thái là "pending" thì cập nhật trạng thái của nút
    }
  }, [isMounted, requestStatus]);

  // const handleSendRequest = () => {
  //   if (isRequestSent) {
  //     localStorage.removeItem(`request_${_id}`); // Xóa request đã gửi
  //     setIsRequestSent(false);
  //     socket.emit("cancel_request", { to: _id, from: user_id }, () => {
  //       // dispatch(updateRequestStatus(_id, "none")); // Cập nhật trạng thái requestStatus
  //     });
  //   } else {
  //     localStorage.setItem(`request_${_id}`, true);
  //     setIsRequestSent(true);
  //     socket.emit("friend_request", { to: _id, from: user_id }, () => {
  //       alert("Request sent");
  //       // dispatch(updateRequestStatus(_id, "pending")); // Cập nhật trạng thái requestStatus
  //     });
  //   }
  // };

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      if (isRequestSent) {
        // Xử lý hủy yêu cầu kết bạn
        localStorage.removeItem(`request_${_id}`);
        setIsRequestSent(false);
        // Đợi 2 giây trước khi đặt isLoading thành false
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        socket.emit('cancel_request', { to: _id, from: user_id }, () => {

        });
      } else {
        // Xử lý gửi yêu cầu kết bạn
        localStorage.setItem(`request_${_id}`, true);
        setIsRequestSent(true);
        // Đợi 2 giây trước khi đặt isLoading thành false
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        socket.emit('friend_request', { to: _id, from: user_id }, () => {
          alert('Request sent');

        });
      }



    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{email}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={handleSendRequest}
            sx={{
              fontSize: '13px', // Điều chỉnh kích thước font chữ
              border: '0.5px solid #000', // Viền 1px đen
              backgroundColor: 'blue', // Màu nền xanh
              color: 'white', // Màu chữ trắng
              '&:focus': {
                outline: 'none', // Loại bỏ viền focus
                boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.25)', // Thêm shadow focus để có hiệu ứng focus
              },
              '&:active': {
                outline: 'none', // Loại bỏ viền khi active
                boxShadow: 'none', // Loại bỏ shadow khi active
              },
              '&:hover': {
                backgroundColor: 'blue', // Đảm bảo màu nền không đổi khi hover
                outline: 'none', // Loại bỏ viền khi hover
                boxShadow: 'none', // Loại bỏ shadow khi hover
              },
            }}
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isRequestSent ? "Cancel Request" : "Add Friend")}
          </Button>
          {/* <Button
            onClick={handleSendRequest}
            sx={{
              ...buttonStyle,
              border: '1px solid #000', // Viền 1px đen
              backgroundColor: 'blue', // Màu nền xanh
              color: 'white', // Màu chữ trắng
              borderRadius: '5px', // Bo tròn góc
              '&:hover': {
                backgroundColor: 'blue', // Đảm bảo màu nền không đổi khi hover
                outline: 'none', // Loại bỏ viền khi hover


              },
            }}
          >
            {isRequestSent ? "Cancel Request" : "Add Friend"}
          </Button> */}
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const FriendRequestElement = ({
  avatar,
  online,
  firstName,
  lastName,
  id,
  _id,


}) => {
  const theme = useTheme();

  console.log("id",_id);
  const name = `${firstName} ${lastName}`;
  const dispatch = useDispatch();
  const handleAcceptRequest = () => {
    socket.emit("accept_request", { request_id: id });
    dispatch(removeNotification(
      {
        message:"sent you a friend request",
        fromId: _id}
      )
    );
  };

  const handleDeclineRequest = () => {
    socket.emit("decline_request", { request_id: id });


  };

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <ConfirmButton variant="contained" onClick={ handleAcceptRequest} >
        Confirm
      </ConfirmButton>
        
      <DeleteButton variant="contained" >
        Delete
      </DeleteButton>

        </Stack>
      </Stack>
    </StyledChatBox>
  );
};


// FriendElement

// const FriendElement = ({
//   avatar,
//   online,
//   _id,
//   firstName,
//   lastName,
// }) => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const name = `${firstName} ${lastName}`;

//   return (

//     <StyledChatBox
//       sx={{
//         width: "100%",
//         borderRadius: 1,
//         backgroundColor: theme.palette.background.paper,
//       }}
//       p={2}
//     >
//       <Stack
//         direction="row"
//         alignItems={"center"}
//         justifyContent="space-between"

//       >
//         <Stack direction="row" alignItems={"center"} spacing={2}>
//           {" "}
//           {online ? (
//             <StyledBadge
//               overlap="circular"
//               anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//               variant="dot"
//             >
//               <Avatar alt={name} src={avatar} />
//             </StyledBadge>
//           ) : (
//             <Avatar alt={name} src={avatar} />
//           )}
//           <Stack spacing={0.3}>
//             <Typography variant="subtitle2">{name}</Typography>
//           </Stack>
//         </Stack>
//         <Stack direction={"row"} spacing={2} alignItems={"center"}>
//           <IconButton
//             onClick={() => {
//               // start a new conversation
//               socket.emit("start_conversation", { to: _id, from: user_id, avatar: avatar, name: name }, (data) => {
//                 dispatch(FetchDirectConversations({ conversations: data }));
//               })
//               // socket.emit("get_direct_conversations", {user_id} , (data) => {
//               //   console.log("Get direct" ,data); // this data is the list of conversations
//               //   // dispatch action
//               //   dispatch(FetchDirectConversations({ conversations: data }));
//               // });
//             }}

//           >
//             <Chat />
//           </IconButton>

//           <IconButton>
//             <Prohibit />
//           </IconButton>



//         </Stack>
//       </Stack>
//     </StyledChatBox>

//   );
// };
const FriendElement = ({ avatar, online, _id, name }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const user_id = localStorage.getItem("user_id"); // Lấy user_id từ localStorage
  const handleDeleteFriend = () => {
    if (window.confirm(`Are you sure you want to delete ${name} from your friends?`)) {
      dispatch(DeleteFriend(_id)); // Dispatch hành động xóa bạn bè
    }
  };

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={"center"} justifyContent="space-between">
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Tooltip title="Chat">
          <IconButton
            onClick={() => {
              socket.emit("start_conversation", { to: _id, from: user_id, avatar, name }, (data) => {
                dispatch(FetchDirectConversations({ conversations: data }));
              });
            }}
          >
            <Chat />
      
          </IconButton>
          </Tooltip>
          <Tooltip title="Remove friend">
          <IconButton onClick={handleDeleteFriend}>
            <PersonRemoveAlt1Outlined />
          </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const MemberElement = ({ online, avatar, name, _id, email, onClick }) => {
  const theme = useTheme();
  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
      onClick={onClick}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{email}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
         
          >
            <UserPlus size={30} />
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};




export { UserElement, FriendRequestElement, FriendElement, MemberElement };
