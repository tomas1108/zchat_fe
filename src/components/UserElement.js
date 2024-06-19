import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat, Phone, Prohibit, UserPlus, VideoCamera } from "phosphor-react";
import { socket } from "../socket";
import { FetchDirectConversations } from "../redux/slices/conversation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


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


/// mai chỉnh lại requestStatus lưu vào state
const UserElement = ({ img, firstName, lastName, online, _id, email  }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isRequestSent, setIsRequestSent] = useState(false); // Lưu trữ trạng thái của nút button
  const [isMounted, setIsMounted] = useState(false); // Biến để theo dõi component đã mounted hay chưa
  const name = `${firstName} ${lastName}`;

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

  const handleSendRequest = () => {
    if (isRequestSent) {
       localStorage.removeItem(`request_${_id}`); // Xóa request đã gửi
      setIsRequestSent(false);
      socket.emit("cancel_request", { to: _id, from: user_id }, () => {
        // dispatch(updateRequestStatus(_id, "none")); // Cập nhật trạng thái requestStatus
      });
    } else {
      localStorage.setItem(`request_${_id}`, true);
      setIsRequestSent(true);
      socket.emit("friend_request", { to: _id, from: user_id }, () => {
        alert("Request sent");
        // dispatch(updateRequestStatus(_id, "pending")); // Cập nhật trạng thái requestStatus
      });
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
          <Button onClick={handleSendRequest}>
            {isRequestSent ? "Cancel " : "Send Request"}
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const FriendRequestElement = ({
  avatar,
  online,
  _id,
  firstName,
  lastName,
}) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;  

  const handleAcceptRequest = () => {
    socket.emit("accept_request", { to: _id, from: user_id });
  };

  const handleDeclineRequest = () => {
    socket.emit("decline_request", { to: _id, from: user_id });
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
          <Button onClick={handleAcceptRequest}>
            Accept
          </Button>
          <Button onClick={handleDeclineRequest}>
            Decline
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};


// FriendElement

const FriendElement = ({
  avatar,
  name,
  online,
  _id,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const Username = name;

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
          {" "}
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
            <Typography variant="subtitle2">{Username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              // start a new conversation
              socket.emit("start_conversation", { to: _id, from: user_id, avatar: avatar, name: name }, (data) => {
                dispatch(FetchDirectConversations({ conversations: data }));
              })
              // socket.emit("get_direct_conversations", {user_id} , (data) => {
              //   console.log("Get direct" ,data); // this data is the list of conversations
              //   // dispatch action
              //   dispatch(FetchDirectConversations({ conversations: data }));
              // });
            }}

          >
            <Chat />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <Prohibit />
          </IconButton>



        </Stack>
      </Stack>
    </StyledChatBox>

  );
};

const MemberElement = ({ online, img, name, _id, email, onClick }) => {
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
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
          // onClick={() => {
          //   socket.emit("friend_request", { to: _id, from: user_id }, () => {
          //     alert("request sent");
          //   });
          // }}
          >
            <UserPlus size={30} />
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};




export { UserElement, FriendRequestElement, FriendElement, MemberElement };
