import React, { useState , useEffect} from "react";
import { Box, Badge, Stack, Avatar, Typography, IconButton } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation } from "../redux/slices/app";
import { ThreeDRotation } from "@mui/icons-material";
import { compareDateTime } from "../utils/dateTime";

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

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

const StyledBadgeOff = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#666964",
    color: theme.palette.mode === "light" ? "black" : "white",

    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",

      border: "1px solid currentColor",
      content: '""',
    },
  },

}));



const ChatElement = ({ img, name, msg, time, unread, online, id }) => {
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();
  const isSelected = selectedChatId === id.toString();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isOnline = online === "Online";
  const [comparisonResult, setComparisonResult] = useState('');
   
  useEffect(() => {
    const updateComparisonResult = () => {
      const inputDateTime = time;
      const result = compareDateTime(inputDateTime);
      setComparisonResult(result);
    };

    updateComparisonResult();

    const interval = setInterval(updateComparisonResult, 1000); // Cập nhật mỗi giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, [time]); // Thêm `time` vào mảng dependencies

  useEffect(() => {
    setComparisonResult(compareDateTime(time));
  }, [msg, time]); // Cập nhật `comparisonResult` khi `msg` hoặc `time` thay đổi
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOnClick = () => {
    dispatch(SelectConversation({ room_id: id }));
  };

  const getBackgroundColor = () => {
    if (isHovered || isSelected) {
      return theme.palette.mode === 'light' ? '#e3f2fd' : alpha(theme.palette.primary.main, 0.5); // Màu nền xanh nhạt hoặc đen nhạt tùy thuộc vào chế độ màu
    } else {
      return 'transparent';
    }
  };


  return (
    <StyledChatBox
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor: getBackgroundColor(), // Sử dụng hàm để xác định màu nền
        transition: 'background-color 0.3s',
      }}
      p={2}
      my={2}
      tabIndex="0"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>

          {isOnline ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"

            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (

            <StyledBadgeOff

              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadgeOff>
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            {msg.includes("connected") || !msg.includes("You:") ? (

              <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: '11px' }} >
                {msg}
              </Typography>
            ) : (

              <Typography variant="caption" color="text.secondary" >
                              {msg.length > 25 ? `${msg.slice(0, 20)}...` : msg}

              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
         
          <Typography variant="caption" color="text.secondary" >
            {comparisonResult}
          </Typography>
          <Badge className="unread-count" color="error" badgeContent={unread > 5 ? '5+' : unread} />
          {/* Button cho tùy chọn */}

        </Stack>

      </Stack>

    </StyledChatBox>

  );
};

export default ChatElement;
