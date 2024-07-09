// src/components/NotificationButton.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import BellIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications, clearNumber } from '../redux/slices/notification';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { socket } from '../socket';
import { Stack, Tooltip } from '@mui/material';
import { CheckCircleOutline, HighlightOffOutlined } from '@mui/icons-material';
import { styled } from "@mui/material/styles";

const ConfirmButton = styled(Button)({
  backgroundColor: '#1877F2', // Màu xanh dương
  color: '#fff',
  '&:hover': {
    backgroundColor: '#145db0', // Màu khi hover
  },
});

const DeleteButton = styled(Button)({
  backgroundColor: '#3A3B3C', // Màu xám
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2c2d2e', // Màu khi hover
  },
});

const NotificationButton = () => {
  const dispatch = useDispatch();
  const notification_list = useSelector((state) => state.notifications.list);
  const noitfication_number = useSelector((state) => state.notifications.number);
  const [open, setOpen] = useState(false);
  const { user_id } = useSelector((state) => state.auth);


  const handleResetNotifications = () => {
    dispatch(clearNotifications());
    socket.emit('clear_notifications', { user_id });
    setOpen(false);  // Close the modal when notifications are cleared
  };

  const handleClickOpen = () => {
    setOpen(true);
    // dispatch(clearNumber());
    // socket.emit('clear_number', { user_id })
    
  };

  const handleClose = () => {
    dispatch(clearNotifications());
    socket.emit('clear_notifications', { user_id });
    setOpen(false);  // Close the modal when notifications are cleared
  };

  const handleAccept = (notification) => {
    // Handle accept friend request
    // console.log('Accepted friend request:', notification);
    // Add your accept friend request logic here
  };

  const handleDecline = (notification) => {
    // Handle decline friend request
    // console.log('Declined friend request:', notification);
    // Add your decline friend request logic here
  };

  return (
    <>
      <IconButton sx={{ width: 'max-content' }} onClick={handleClickOpen}>
        <Badge badgeContent={noitfication_number} color="error">
          <BellIcon />
        </Badge>
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notification_list.length > 0 ? (
              notification_list.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText primary={notification.message} />
                  {notification.message.includes('sent you a friend request') && (
                    <Stack direction="row" spacing={1}>
                      <ConfirmButton variant="contained" onClick={handleAccept} >
                        Confirm
                      </ConfirmButton>

                      <DeleteButton variant="contained" >
                        Delete
                      </DeleteButton>
                    </Stack>
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
          </List>
        </DialogContent>

        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ padding: '16px' }} // Căn lề bên trong Stack
        >
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

export default NotificationButton;
