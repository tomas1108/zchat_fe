import React, { useState } from 'react';
import { IconButton, Popover, Typography, List, ListItem, Divider, Box, Badge, Stack, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/system';
import ScrollbarNormal from './ScrollbarNormal';
import { useSelector, useDispatch } from 'react-redux';
import ava from "../assets/Images/man.png";
import { use } from 'i18next';
import { set } from 'react-hook-form';
import { clearNumber } from '../redux/slices/notification';
import { socket } from '../socket';
const notifications = [
  {
    id: 1,
    text: 'Nguyễn Trúc added to her story.',
    time: '32 minutes ago',
    avatar: 'path/to/avatar1.jpg',
    seen: false, // Chưa đọc
  },
  {
    id: 2,
    text: 'Quỳnh Tú sent you a friend request.',
    time: '6 days ago',
    avatar: 'path/to/avatar2.jpg',
    seen: true, // Đã đọc
  },
  {
    id: 3,
    text: 'Nhã Lê Ana was live: "Tâm sự buổi tối cùng em Ngân"',
    time: 'about an hour ago',
    avatar: 'path/to/avatar2.jpg',
    seen: false, // Chưa đọc
  },
  {
    id: 4,
    text: 'Leng was live: "PALDONG MALALA!"',
    time: 'about an hour ago',
    avatar: 'path/to/avatar2.jpg',
    seen: true, // Đã đọc
  },
];

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    padding: theme.spacing(2),
    width: 300,
  },
}));

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const noti_list = useSelector((state) => state.notifications.list);
  const user_avatar = useSelector((state) => state.auth.user_avatar);
  const user_id = useSelector((state) => state.auth.user_id);
  const notiNum = useSelector((state) => state.notifications.number);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    socket.emit("clear_num_noti", {user_id: user_id})
    console.log("clear_num_noti", {user_id: user_id})
  };
  const handleClose = () => {

    dispatch(clearNumber());
  
    setAnchorEl(null);
  };

  function parseDateTime(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [time] = timePart.split('-');
    const [hours, minutes, seconds, ] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds, );
  }

  function sortDateTimesDescending(notifications) {
    return notifications.sort((a, b) => {
      const dateA = parseDateTime(a.time);
      const dateB = parseDateTime(b.time);
      return dateB - dateA;
    });
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
// Sắp xếp các thông báo theo thứ tự thời gian giảm dần
const sortedNotifications = sortDateTimesDescending([...noti_list]);


  return (
    <div>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notiNum} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography variant="h6">Notifications</Typography>
        <Divider />
        <Stack sx={{ flexGrow: 1, height: "100%" }}>
          <ScrollbarNormal autoHeightMin="45vh" >
            <List>
              {sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <Box display="flex" alignItems="center">
                    {notification.message.includes('You and ') ? (
                       <Badge
                       overlap="circular"
                       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                       badgeContent={
                         <SmallAvatar alt={user_avatar} src={user_avatar }/>
                       }
                     >
                   <Avatar alt={notification.avatar} src={notification.avatar} />
                     </Badge>
                      ) : (
                        <Avatar alt={notification.avatar} src={notification.avatar} />
                      )}
                      <Box ml={2}>

                      <Typography variant="body2" style={{ fontWeight: notification.seen ? 'normal' : 'bold' }}>
                          {notification.message}
                          </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {notification.time}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>


                ))
              ) : (
                <ListItem>
                  <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    <Typography variant="body2" color="textSecondary" sx={{ opacity: 0.6 }}>
                      No notifications
                    </Typography>
                  </Box>
                </ListItem>
              )
              }
            </List>
          </ScrollbarNormal>
        </Stack>
      </StyledPopover>
    </div>
  );
};

export default NotificationBell;
