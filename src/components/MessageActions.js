import React from 'react';
import { Box, IconButton, Avatar, Popover } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import MessageOption from '@mui/icons-material/MoreVert'; // Thay bằng icon bạn sử dụng cho MessageOption

// Định nghĩa các đường dẫn tới các icon ngay trong component
const icons = {
  love: '../assets/icons/flags/react/tym.png',
  haha: '../assets/icons/flags/react/haha.png',
  sad: '../assets/icons/flags/react/sad.png',
  surprised: '../assets/icons/flags/react/wow.png',
  angry: '../assets/icons/flags/react/angry.png',
  like: '../assets/icons/flags/react/like.png',
};

const MessageActions = ({
  isFocused,
  incoming,
  handleReply,
  handleOptions,
  reaction,
  el,
  anchorEl,
  handleClose,
  handleReaction,
}) => {
  return (
    <Box>
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
              <IconButton size="small" onClick={handleReply}>
                <ReplyIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleOptions}>
                <MessageOption fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton size="small" onClick={handleOptions}>
                <MessageOption fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleReply}>
                <ReplyIcon fontSize="small" />
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
          {reaction && (
            <Avatar
              src={icons[reaction]}
              sx={{ width: 15, height: 15 }}
            />
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
          {Object.keys(icons).map(key => (
            <IconButton key={key} size="small" onClick={() => handleReaction(key)}>
              <Avatar
                src={icons[key]}
                sx={{ width: 24, height: 24 }}
              />
            </IconButton>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default MessageActions;
