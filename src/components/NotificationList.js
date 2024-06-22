// src/components/NotificationList.js
import React from 'react';
import { useSelector } from 'react-redux';

const NotificationList = () => {
  const notifications = useSelector((state) => state.notifications.list);

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
};

export default NotificationList;
