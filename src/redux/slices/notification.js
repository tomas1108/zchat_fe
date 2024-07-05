import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    number: 0,
    list: [],
    playSound: true,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list = action.payload;

    },
    addNumber: (state, action) => {
      state.number = action.payload;
    },
    pushNotification: (state, action) => {
      state.list.push(action.payload);
      state.number = state.list.length; // Cập nhật số lượng notification sau khi push vào list
    },
    clearNotifications: (state) => {
      state.list = [];
      state.number = 0; // Đặt lại số lượng notification về 0 khi xóa hết
    },
    clearNumber: (state) => {
      state.number = 0;
    },
    removeNotification: (state, action) => {
      const { message, fromId } = action.payload;
      state.list = state.list.filter((item) => {
        // Kiểm tra nếu message không chứa "sent you a friend request" hoặc không đúng `fromId`
        // Nếu đúng cả hai điều kiện, thì giữ lại (trả về true)
        // Nếu không đúng ít nhất một điều kiện, thì loại bỏ (trả về false)
        return !(item.message.includes(message) && item.from === fromId );
      });
      
      state.number = state.list.length;
    },
    updateStatusNotice(state, action) {
      state.playSound = action.payload;
    },
    
  },
});

export const { addNotification, clearNotifications ,clearNumber, pushNotification, addNumber,removeNotification,updateStatusNotice} = notificationSlice.actions;
export default notificationSlice.reducer;
