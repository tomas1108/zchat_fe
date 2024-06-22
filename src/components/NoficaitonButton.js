// src/components/NotificationButton.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import BellIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications } from '../redux/slices/notification';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { socket } from '../socket';

import { Stack } from '@mui/material';

const NotificationButton = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.list);
  const [open, setOpen] = useState(false);
  const { user_id } = useSelector((state) => state.auth);
  const handleResetNotifications = () => {
    dispatch(clearNotifications());
    socket.emit('clear_notifications', { user_id });
    setOpen(false);  // Close the modal when notifications are cleared
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(clearNotifications());
    socket.emit('clear_notifications', { user_id });
    setOpen(false);  // Close the modal when notifications are cleared
  };




   return (
    <>
      <IconButton sx={{ width: 'max-content' }} onClick={handleClickOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <BellIcon />
        </Badge>
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText primary={notification.message} />
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
          {/* <Button onClick={handleResetNotifications} color="primary">
            Clear Notifications
          </Button> */}
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </Stack>
      </Dialog>
    </>
  );
};

export default NotificationButton;
