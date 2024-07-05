import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
  Popover,
  Modal,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image, FileCsv } from "phosphor-react";
import { Message_options_text, Message_options } from "../../data";
import { PlayArrow, Pause, GraphicEq, Close } from "@mui/icons-material";
import TxtPng from "../../assets/Images/txt.png";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ReplyIcon from '@mui/icons-material/Reply';
import IosShareIcon from '@mui/icons-material/IosShare';
import data from "@emoji-mart/data";
import hahaIcon from "../../assets/icons/flags/react/haha.png";
import tymIcon from "../../assets/icons/flags/react/tym.png";
import sadIcon from "../../assets/icons/flags/react/sad.png";
import angryIcon from "../../assets/icons/flags/react/angry.png";
import wowIcon from "../../assets/icons/flags/react/wow.png";
import likeIcon from "../../assets/icons/flags/react/like.png";
import MessageActions from "../../components/MessageActions";
import { useSelector } from "react-redux";
import { socket } from "../../socket";
import { createTheme, ThemeProvider } from '@mui/material/styles';




const user_id = window.localStorage.getItem("user_id");

function isLink(str) {
  // Biểu thức chính quy để kiểm tra xem chuỗi có phải là một liên kết hay không
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
  return regex.test(str);
}
function extractFilenameFromUrl(url) {
  // Split the URL by '/' and take the last part
  const parts = url.split('/');
  // Lấy phần cuối cùng của URL
  const lastPart = parts[parts.length - 1];
  // Tách phần truy vấn (nếu có) và chỉ lấy tên tệp
  const filenameWithQuery = lastPart.split('?')[0];
  // Tìm và trích xuất phần cuối cùng của tên file
  const match = filenameWithQuery.match(/[^_/]+$/);
  const filename = match ? match[0] : '';
  return filename;
}

function parseDateTime(dateTimeStr) {
  if (!dateTimeStr || typeof dateTimeStr !== 'string') return null; // Kiểm tra nếu dateTimeStr không tồn tại hoặc không phải chuỗi
  const [datePart, timePart] = dateTimeStr.split(' ');
  if (!datePart || !timePart) return null; // Kiểm tra nếu không có phần ngày hoặc phần thời gian
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function getDayDifference(dateTimeStr) {
  const messageTime = parseDateTime(dateTimeStr);
  if (!messageTime) return null; // Kiểm tra nếu messageTime không tồn tại
  const currentTime = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // Miliseconds in one day
  const diffDays = Math.round((currentTime - messageTime) / oneDay);
  return diffDays;
}

function formatDateTime(dateTimeStr) {
  const date = parseDateTime(dateTimeStr);
  if (!date) return ''; // Kiểm tra nếu date không tồn tại

  const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleString('en-US', options);
}


const getFileTypeIcon = (fileUrl) => {
  // Trích xuất tên tệp từ URL
  const fileName = fileUrl.split('/').pop().split('?')[0];
  // Trích xuất phần mở rộng tệp từ tên tệp
  const match = fileName.match(/(\.[a-zA-Z0-9]+)$/);
  const fileExtension = match ? match[1].toLowerCase() : '';

  switch (fileExtension) {
    case '.pdf':
      return <img src=" https://chat.zalo.me/assets/icon-pdf.53e522c77f7bb0de2eb682fe4a39acc3.svg" alt="PDF Icon" />;
    case '.doc':
    case '.docx':
      return <img src="https://chat.zalo.me/assets/icon-word.d7db8ecee5824ba530a5b74c5dd69110.svg" alt="DOCX Icon" />;
    case '.txt':
      return <img src={TxtPng} alt="TXT Icon" width={42} height={52} />;

    // return <Avatar src={TxtPng} alt="TXT Icon" />;
    default:
      return <FileCsv size={48} color="white" />;
  }
};

const MessageOptionText = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options_text.map((el, idx) => (
            <MenuItem key={idx} onClick={handleClose}>{el.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

const MessageOption = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el, idx) => (
            <MenuItem key={idx} onClick={handleClose}>{el.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};


const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;
  const [isFocused, setIsFocused] = React.useState(false);
  const [reaction, setReaction] = React.useState(null);
  const [showRemoveReaction, setShowRemoveReaction] = React.useState(false);
  const { room_id } = useSelector((state) => state.app);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const timeDifference = getDayDifference(el.created_at);
  const timeLabel = timeDifference > 0 ? `${timeDifference} days ago` : `Today at ${(el.created_at)}`;
  const reactType = el ? el.reactions : null;
  const message_id = el._id;
  const theme1 = createTheme({
    typography: {
      body1: {
        color: '#b0b0b0',
        backgroundColor: '#333',
        padding: '10px',
        borderRadius: '5px',
        display: 'inline-block',
      },
    },
  });

  const handleSelectMessage = () => {
    console.log("Selected message ID: ", message_id);

  };

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleLinkClick = (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    window.open(el.text, "_blank"); // Mở liên kết trong một tab mới
  };

  const handleReact = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowRemoveReaction(false);

  };

  const handleReaction = (reactionType) => {
    socket.emit("update_reactions", { messageId:message_id, reactionType: reactionType , userId: user_id, conversationId: room_id});
    handleClose();
  };

  const handleReply = () => {
    const messageId = message_id;
    console.log("Reply to message ID: ", messageId);
  };

  const handleRemoveReaction = () => {
    socket.emit("update_reactions", { messageId: message_id, reactionType: null, userId: user_id, conversationId: room_id });
    setReaction(null);
    handleClose();
  };
  const handleOptions = () => {
    // handle options
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {isLink(el.text) ? (
          <a
            href={el.text}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            style={{
              color: incoming ? theme.palette.text.main : theme.palette.common.white,
              wordBreak: 'break-word'
            }}
          >
            {el.text}
          </a>
        ) : (
          <Tooltip title={timeLabel} placement={incoming ? "right" : "left"}>
            <Typography
              variant="body2"
              color={incoming ? theme.palette.text.primary : "#fff"}
              className={el.from ? "bold-text" : ""}
              sx={{ wordBreak: 'break-word' }}
              
            >
              {el.text}
            </Typography>
          </Tooltip>
        )}
      </React.Fragment>
    );
  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.default, 1)
            : "#0084FF",
          borderRadius: 1.5,
          width: "max-content",
          display: "flex",
          alignItems: "center",
          position: "relative"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
        {isFocused && (
          <Box
            display="flex"
            alignItems="center"
            position="absolute"
            top="50%"
            left={incoming ? '100%' : 'auto'}
            right={incoming ? 'auto' : '100%'}
            transform="translateY(-50%)"
          >
            {incoming ? (
              <>
                <Tooltip title="React">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={handleReply}>
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOptionText />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="More">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOptionText />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={handleReply}>
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="React">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}
        {reactType && (
          <Box
            sx={{
              display: reactType === "None" ? 'none' : 'flex',  // Sửa điều kiện ở đây
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.5,
              borderRadius: 1,
              backgroundColor: "background.paper",
              padding: '2px 4px',
              position: 'absolute',
              top: 45,
              left: incoming ? 'auto' : 0,
              right: incoming ? 0 : 'auto',
              transform: 'translateY(-50%)',
            }}
          >
            {reactType === 'love' && <Avatar src={tymIcon} sx={{ width: 15, height: 15 }} />}
            {reactType === 'haha' && <Avatar src={hahaIcon} sx={{ width: 15, height: 15 }} />}
            {reactType === 'sad' && <Avatar src={sadIcon} sx={{ width: 15, height: 15 }} />}
            {reactType === 'surprised' && <Avatar src={wowIcon} sx={{ width: 15, height: 15 }} />}
            {reactType === 'angry' && <Avatar src={angryIcon} sx={{ width: 15, height: 15 }} />}
            {reactType === 'like' && <Avatar src={likeIcon} sx={{ width: 15, height: 15 }} />}
         

          </Box>
        )}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box display="flex" p={1}>
            <IconButton size="small" onClick={() => handleReaction('love')}>
              <Avatar
                src={tymIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('haha')}>
              <Avatar
                src={hahaIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('sad')}>
              <Avatar
                src={sadIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('surprised')}>
              <Avatar
                src={wowIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('angry')}>
              <Avatar
                src={angryIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('like')}>
              <Avatar
                src={likeIcon}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
            {showRemoveReaction && (
              <IconButton size="small" onClick={handleRemoveReaction}>
                <Close />
              </IconButton>
            )}
          </Box>

        </Popover>
      </Box>
    </Stack>
  );
};


const MediaMsg1 = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;

  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [reaction, setReaction] = React.useState(null);
  const timeDifference = getDayDifference(el.created_at);
  const timeLabel = timeDifference > 0 ? `${timeDifference} days ago` : `Today at ${(el.created_at)}`;

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleReact = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaction = (reactionType) => {
    setReaction(reactionType);
  };

  const handleReply = () => {
    // Logic cho nút Reply
  };

  const handleOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ position: "relative" }} // Đặt vị trí của Box là tương đối để sử dụng vị trí tuyệt đối cho IconButton
      >
        <Stack spacing={1}>
          <Tooltip title={timeLabel} placement={incoming ? "right" : "left"}>
            <img
              src={el.text}
              alt={el.text}
              style={{
                width: 150, // Kích thước cố định của hình ảnh
                height: 150, // Kích thước cố định của hình ảnh
                borderRadius: "10px",
                cursor: "pointer",
                objectFit: 'cover', // Đảm bảo hình ảnh được cắt để phù hợp với kích thước đã định
              }}
              onClick={handleOpenModal}
            />
          </Tooltip>
        </Stack>

        {isFocused && (
          <Box display="flex" alignItems="center" position="absolute" top="50%" left={incoming ? '100%' : 'auto'} right={incoming ? 'auto' : '100%'} transform="translateY(-50%)">
            {incoming ? (
              <>
                <IconButton size="small" onClick={handleReact}  >
                  <EmojiEmotionsIcon />
                </IconButton>


                <IconButton size="small" onClick={handleReply}>
                  <ReplyIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleOptions}>
                  <MessageOptionText />
                </IconButton>
              </>

            ) : (
              <>
                <IconButton size="small" onClick={handleOptions}>
                  <MessageOptionText />
                </IconButton>
                <IconButton size="small" onClick={handleReply}>
                  <ReplyIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleReact}>
                  <EmojiEmotionsIcon />
                </IconButton>

              </>
            )}

          </Box>
        )}
        {reaction && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.5,
              borderRadius: 1,
              backgroundColor: "background.paper",
              padding: '2px 4px',
              position: 'absolute',
              top: 45, // Điều chỉnh vị trí để hiển thị trên tin nhắn
              left: incoming ? `calc(100% - ${Math.min(el.text.length * 10.5, 30)}px)` : 'auto',
              right: incoming ? 'auto' : `calc(100% - ${Math.min(el.text.length * 10, 100)}px)`,
              transform: 'translateY(-50%)',


            }}
          >
            {reaction === 'love'
              &&
              <Avatar
                src={tymIcon}
                sx={{ width: 15, height: 15 }}
              />
            }
            {reaction === 'haha'
              &&
              <Avatar
                src={hahaIcon}
                sx={{ width: 15, height: 15 }}
              />
            }

            {reaction === 'sad'
              &&
              <Avatar
                src={sadIcon}
                sx={{ width: 15, height: 15 }}
              />
            }
            {reaction === 'surprised'
              &&
              <Avatar
                src={wowIcon}
                sx={{ width: 15, height: 15 }}
              />

            }
            {reaction === 'angry'
              &&

              <Avatar
                src={angryIcon}
                sx={{ width: 15, height: 15 }}
              />
            }
            {reaction === 'like'
              &&
              <Avatar
                src={likeIcon}
                sx={{ width: 15, height: 15 }}
              />
            }


          </Box>
        )}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}

      >
        <Box display="flex" p={1}>
          <IconButton size="small" onClick={() => handleReaction('love')}>
            <Avatar
              src={tymIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
          <IconButton size="small" onClick={() => handleReaction('haha')}>
            <Avatar
              src={hahaIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
          <IconButton size="small" onClick={() => handleReaction('sad')}>
            <Avatar
              src={sadIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
          <IconButton size="small" onClick={() => handleReaction('surprised')}>
            <Avatar
              src={wowIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
          <IconButton size="small" onClick={() => handleReaction('angry')}>
            <Avatar
              src={angryIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
          <IconButton size="small" onClick={() => handleReaction('like')}>
            <Avatar
              src={likeIcon}
              sx={{ width: 24, height: 24 }} // Đặt kích thước của Avatar
            />
          </IconButton>
        </Box>
      </Popover>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "80vw",
            maxHeight: "80vh",
          }}
        >
          <img
            src={el.text}
            alt={el.text}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
          <Tooltip title="Dowload" placement="top">
            <IconButton
              href={el.text}
              download
              size="small" // Thiết lập kích thước nhỏ cho IconButton
              sx={{
                bgcolor: theme.palette.primary.main, // Màu nền của IconButton
                color: "#fff", // Màu của biểu tượng
                mt: -130,
                left: "100%",
              }}
            >
              <DownloadSimple fontSize="small" /> {/* Chỉ định kích thước nhỏ cho biểu tượng tải xuống */}
            </IconButton>
          </Tooltip>
        </Box>
      </Modal>

    </Stack>
  );
};
const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;

  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reaction, setReaction] = React.useState(null);
  const [imgRef, setImgRef] = React.useState(null);
  const timeDifference = getDayDifference(el.created_at);
  const timeLabel = timeDifference > 0 ? `${timeDifference} days ago` : `Today at ${(el.created_at)}`;

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleReact = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaction = (reactionType) => {
    setReaction(reactionType);
    handleClose(); // Đóng Popover sau khi chọn phản ứng
  };

  const handleShare = () => {
    // Logic cho nút Reply
  };

  const handleOptions = (event) => {

  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ position: "relative" }}
      >
        <Stack spacing={1}>
          <Tooltip title={timeLabel} placement={incoming ? "right" : "left"}>
            <img
             ref={setImgRef}
              src={el.text}
              alt={el.text}
              style={{
                maxWidth: '100%',
                borderRadius: "10px",
                cursor: "pointer",
                objectFit: 'cover',
              }}
              onClick={handleOpenModal}
            />
          </Tooltip>
        </Stack>

        <Box
          display="flex"
          alignItems="center"
          position="absolute"
          top="50%"
          left={incoming ? '100%' : 'auto'}
          right={incoming ? 'auto' : '100%'}
          transform="translateY(-50%)"
          spacing={1}
        >
          {incoming ? (
            <>
              <Tooltip title="Share" placement="top">
                <IconButton size="small" onClick={handleShare}>
                  <IosShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>

            </>
          ) : (
            <>

              <Tooltip title="Share" placement="top">
                <IconButton size="small" onClick={handleShare}>
                  <IosShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        {isFocused && (
          <Box
            display="flex"
            alignItems="center"
            position="absolute"
            top="50%"
            left={incoming ? '104%' : 'auto'}
            right={incoming ? 'auto' : '102%'}
            transform="translateY(-50%)"
         
          
          >
            {incoming ? (
              <>
                  <IconButton  >
                  </IconButton>
              

                <Tooltip title="React" placement="top">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>



                <Tooltip title="More" placement="top">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOption />
                  </IconButton>
                </Tooltip>


              </>
            ) : (
              <>
                <Tooltip title="More" placement="top">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOption />
                  </IconButton>
                </Tooltip>
               
                <Tooltip title="React" placement="top">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
               
                  <IconButton  >
               
                  </IconButton>
            
              </>
            )}
          </Box>
        )}

        {reaction && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,  
              backgroundColor: "background.paper",
              padding: '2px 4px',
              position: 'absolute',
              bottom: '-8px',
              right: incoming ?'20px' : 'auto',
              left: incoming ? 'auto' : '20px',
              transform: 'translateY(-50%)',
            }}
          >
            {reaction === 'love' && (
              <Avatar src={tymIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'haha' && (
              <Avatar src={hahaIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'sad' && (
              <Avatar src={sadIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'surprised' && (
              <Avatar src={wowIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'angry' && (
              <Avatar src={angryIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'like' && (
              <Avatar src={likeIcon} sx={{ width: 15, height: 15 }} />
            )}
          </Box>
        )}

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box display="flex" p={1}>
            <IconButton size="small" onClick={() => handleReaction('love')}>
              <Avatar src={tymIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('haha')}>
              <Avatar src={hahaIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('sad')}>
              <Avatar src={sadIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('surprised')}>
              <Avatar src={wowIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('angry')}>
              <Avatar src={angryIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('like')}>
              <Avatar src={likeIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </Popover>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxWidth: "80vw",
              maxHeight: "80vh",
            }}
          >
            <img
              src={el.text}
              alt={el.text}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            <Tooltip title="Download" placement="bottom">
              <IconButton
                href={el.text}
                download
                size="small"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                }}
              >
                <DownloadSimple fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Modal>
      </Box>
    </Stack>
  );
};



const VoiceMsg = ({ el, menu }) => {
  const theme = useTheme();
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  const incoming = el.from !== user_id;

  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause();
      setPausedTime(audioPlayer.currentTime);
    } else {
      if (!audioPlayer) {
        const audio = new Audio(el.text);
        setAudioPlayer(audio);
        audio.play();
        audio.onended = () => setIsPlaying(false);
        if (pausedTime) {
          audio.currentTime = pausedTime;
        }
      } else {
        audioPlayer.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Stack direction="row" justifyContent={el.from !== user_id ? "start" : "end"}>
      {el.from !== user_id && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          backgroundColor: el.from !== user_id
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.light,
          borderRadius: 2,
          width: "max-content",

        }}
      >
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton sx={{ width: 48, height: 48 }}> {/* Đặt chiều rộng và chiều cao của IconButton */}
          <GraphicEq sx={{ fontSize: 50 }} /> {/* Đặt kích thước của biểu tượng GraphicEq */}
        </IconButton>
        <Stack direction="row" spacing={1}>

          {isFocused && (
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}>
              {el.time}
            </Typography>
          )}
        </Stack>
      </Box>

      {menu && <MessageOption />}
    </Stack>
  );
};
const DocMsg1 = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;
  const [isFocused, setIsFocused] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reaction, setReaction] = React.useState(null);
  const timeDifference = getDayDifference(el.created_at);
  const timeLabel = timeDifference > 0 ? `${timeDifference} days ago` : `Today at ${(el.created_at)}`;
  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleReact = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaction = (reactionType) => {
    setReaction(reactionType);
    handleClose(); // Đóng Popover sau khi chọn phản ứng
  };

  const handleShare = () => {
    // Logic cho nút Reply
  };

  const handleOptions = (event) => {

  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: 300,
          height: 108,
        }}

      >
        <Stack spacing={2}>
          <Tooltip title={timeLabel} placement={incoming ? "right" : "left"}>
            <Stack
              p={2}
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                backgroundColor: "#e5efff",
                borderRadius: 1.5,
              }}
            >
              {getFileTypeIcon(el.text)}
              <Typography
                sx={{

                  color: "#081c36"
                }}
                variant="body2"
              >
                {extractFilenameFromUrl(el.text)}
              </Typography>

              <IconButton href={el.text} download>
                <DownloadSimple color="black" /> {/* Chuyển màu biểu tượng tải xuống thành trắng */}
              </IconButton>
            </Stack>
          </Tooltip>
        </Stack>
        {isFocused && (
          <Box
            display="flex"
            alignItems="center"
            position="absolute"
            top="50%"
            left={incoming ? '100%' : 'auto'}
            right={incoming ? 'auto' : '100%'}
            transform="translateY(-50%)"
          >
            {incoming ? (
              <>
                <IconButton size="small" onClick={handleReact}>
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton size="small" onClick={handleShare}>
                  <IosShareIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleOptions}>
                  <MessageOptionText />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" onClick={handleOptions}>
                  <MessageOptionText />
                </IconButton>
                <IconButton size="small" onClick={handleShare}>
                  <IosShareIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleReact}>
                  <EmojiEmotionsIcon />
                </IconButton>
              </>
            )}
          </Box>
        )}

        {reaction && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.5,
              borderRadius: 1,
              backgroundColor: "background.paper",
              padding: '2px 4px',
              position: 'absolute',
              top: 45,
              left: incoming ? `calc(100% - ${Math.min(el.text.length * 10.5, 30)}px)` : 'auto',
              right: incoming ? 'auto' : `calc(100% - ${Math.min(el.text.length * 10, 100)}px)`,
              transform: 'translateY(-50%)',
            }}
          >
            {reaction === 'love' && (
              <Avatar src={tymIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'haha' && (
              <Avatar src={hahaIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'sad' && (
              <Avatar src={sadIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'surprised' && (
              <Avatar src={wowIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'angry' && (
              <Avatar src={angryIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === 'like' && (
              <Avatar src={likeIcon} sx={{ width: 15, height: 15 }} />
            )}
          </Box>
        )}

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box display="flex" p={1}>
            <IconButton size="small" onClick={() => handleReaction('love')}>
              <Avatar src={tymIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('haha')}>
              <Avatar src={hahaIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('sad')}>
              <Avatar src={sadIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('surprised')}>
              <Avatar src={wowIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('angry')}>
              <Avatar src={angryIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction('like')}>
              <Avatar src={likeIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </Popover>
      </Box>
    </Stack>
  );
}
const DocMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;
  const [isFocused, setIsFocused] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reaction, setReaction] = React.useState(null);
  const timeDifference = getDayDifference(el.created_at);
  const timeLabel = timeDifference > 0 ? `${timeDifference} days ago` : `Today at ${el.created_at}`;

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleReact = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaction = (reactionType) => {
    setReaction(reactionType);
    handleClose(); // Đóng Popover sau khi chọn phản ứng
  };

  const handleShare = () => {
    // Logic cho nút Reply
  };

  const handleOptions = (event) => { };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar src={el.avatar} alt={el.name} sx={{ width: 24, height: 24, mr: 0.5 }} />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: 300,
          height: 108,
          position: 'relative', // Để có thể chứa các nút điều khiển tương tác
        }}
      >
        <Stack spacing={2}>
          <Tooltip title={timeLabel} placement={incoming ? "right" : "left"}>
            <Stack
              p={2}
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                backgroundColor: "#e5efff",
                borderRadius: 1.5,
              }}
            >
              {/* Hình ảnh biểu tượng của loại tệp */}
              {getFileTypeIcon(el.text)}
              {/* Tên tệp */}
              <Typography sx={{ color: "#081c36" }} variant="body2">
                {extractFilenameFromUrl(el.text)}
              </Typography>
              {/* Nút tải xuống */}
              <IconButton href={el.text} download>
                <DownloadSimple color="black" /> {/* Chuyển màu biểu tượng tải xuống thành trắng */}
              </IconButton>
            </Stack>
          </Tooltip>
        </Stack>

        {/* Hiển thị các nút và biểu tượng khi focus */}
        {isFocused && (
          <Box
            display="flex"
            alignItems="center"
            position="absolute"
            top="50%"
            left={incoming ? "100%" : "auto"}
            right={incoming ? "auto" : "100%"}
            transform="translateY(-50%)"
          >
            {incoming ? (
              <>
                <Tooltip title="React" placement="top">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Forward" placement="top">
                  <IconButton size="small" onClick={handleShare}>
                    <IosShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More" placement="top">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOption />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="More" placement="top">
                  <IconButton size="small" onClick={handleOptions}>
                    <MessageOption />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Forward" placement="top">
                  <IconButton size="small" onClick={handleShare}>
                    <IosShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="React" placement="top">
                  <IconButton size="small" onClick={handleReact}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}

        {/* Hiển thị biểu tượng phản ứng khi đã chọn phản ứng */}
        {reaction && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 0.5,
              borderRadius: 1,
              backgroundColor: "background.paper",
              padding: "2px 4px",
              position: "absolute",
              top: 'calc(80% + 5px)', // Đặt vị trí ở dưới phần tin nhắn
              left: incoming ? "auto" : "calc(05% + 5px)", // Nếu incoming thì vị trí bên phải, ngược lại bên trái
              right: incoming ? "calc(5% + 5px)" : "auto", // Nếu incoming thì vị trí bên trái, ngược lại bên phải
              transform: "translateY(-50%)",
            }}
          >
            {reaction === "love" && <Avatar src={tymIcon} sx={{ width: 15, height: 15 }} />}
            {reaction === "haha" && <Avatar src={hahaIcon} sx={{ width: 15, height: 15 }} />}
            {reaction === "sad" && <Avatar src={sadIcon} sx={{ width: 15, height: 15 }} />}
            {reaction === "surprised" && (
              <Avatar src={wowIcon} sx={{ width: 15, height: 15 }} />
            )}
            {reaction === "angry" && <Avatar src={angryIcon} sx={{ width: 15, height: 15 }} />}
            {reaction === "like" && <Avatar src={likeIcon} sx={{ width: 15, height: 15 }} />}
          </Box>
        )}

        {/* Popover cho các lựa chọn phản ứng */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box display="flex" p={1}>
            <IconButton size="small" onClick={() => handleReaction("love")}>
              <Avatar src={tymIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction("haha")}>
              <Avatar src={hahaIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction("sad")}>
              <Avatar src={sadIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction("surprised")}>
              <Avatar src={wowIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction("angry")}>
              <Avatar src={angryIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton size="small" onClick={() => handleReaction("like")}>
              <Avatar src={likeIcon} sx={{ width: 24, height: 24 }} />
            </IconButton>
          </Box>
        </Popover>
      </Box>
    </Stack>
  );
};
const LinkMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.from !== user_id;
  const handleLinkClick = (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    window.open(el.link, "_blank"); // Mở liên kết trong một tab mới
  };
  const [isFocused, setIsFocused] = React.useState(false);
  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };
  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}

      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Typography variant="body2" color={incoming ? theme.palette.text.primary : theme.palette.common.white}>
          <a href={el.link} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick} style={{ color: incoming ? theme.palette.text.main : theme.palette.common.white }}>
            {el.link}
          </a>
        </Typography>

        {isFocused && (
          <Typography variant="body2" sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}>
            {el.time}
          </Typography>
        )}
      </Box>

      {/* Sử dụng thẻ <a> để tạo liên kết */}
      {/* <Typography 
           variant="body2"
           color={incoming ? theme.palette.text.primary : "#fff"}
            >
              <a href={el.link} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                {el.link}
              </a>
            </Typography> */}




      {/* Tùy chọn tin nhắn */}
      {menu && <MessageOptionText />}
    </Stack>
  );
};
const ReplyMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 1),

              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptionText />}
    </Stack>
  );
};
const Timeline = ({ el }) => {
  const theme = useTheme();

  // Tách chuỗi thời gian và lấy phần giờ và phút
  const getTime = (text) => {
    const parts = text.split(' ');
    if (parts.length === 2) {
      const timePart = parts[1];
      const timeParts = timePart.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
      }
    }
    return text; // Trả về chuỗi gốc nếu định dạng không đúng
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Typography variant="caption" sx={{ color: theme.palette.text.primary }}>
        {getTime(el.text)}
      </Typography>
    </Stack>
  );
};
const Notice = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="40%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="40%" />
    </Stack>
  );

}
export { Timeline, MediaMsg, LinkMsg, DocMsg, TextMsg, ReplyMsg, Notice, VoiceMsg };
