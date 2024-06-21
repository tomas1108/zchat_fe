import React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import BellIcon from '@mui/icons-material/Notifications';

const NotificationButton = ({ notificationCount }) => {
  return (
    <IconButton sx={{ width: 'max-content' }}>
      <Badge badgeContent={notificationCount} color="error">
        <BellIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationButton;
