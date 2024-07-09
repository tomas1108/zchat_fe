// src/utils/dateTime.js

// src/utils/dateTime.js

export const dateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0'); // Ngày trong tháng
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Tháng (từ 0-11)
    const year = now.getFullYear(); // Năm
    const hours = now.getHours().toString().padStart(2, '0'); // Giờ trong ngày
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Phút
    const seconds = now.getSeconds().toString().padStart(2, '0'); // Giây
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};


// Hàm parseDateTime để phân tích chuỗi ngày giờ thành đối tượng Date
export const parseDateTime = (dateTimeStr) => {
    if (!dateTimeStr || typeof dateTimeStr !== 'string') return null; // Kiểm tra nếu dateTimeStr không tồn tại hoặc không phải chuỗi
    const [datePart, timePart] = dateTimeStr.split(' ');
    if (!datePart || !timePart) return null; // Kiểm tra nếu không có phần ngày hoặc phần thời gian
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };
  
  // Hàm getMinuteDifference để tính số phút khác biệt giữa hai thời điểm
  export const getMinuteDifference = (dateTimeStr) => {
    const messageTime = parseDateTime(dateTimeStr);
    if (!messageTime) return null; // Kiểm tra nếu messageTime không tồn tại
    const currentTime = new Date();
    const oneMinute = 60 * 1000; // Miliseconds in one minute
    const diffMinutes = Math.round((currentTime - messageTime) / oneMinute);
    return diffMinutes;
  };
  
  // Hàm formatDateTime để định dạng ngày giờ thành chuỗi
  export const formatDateTime = (dateTimeStr) => {
    const date = parseDateTime(dateTimeStr);
    if (!date) return ''; // Kiểm tra nếu date không tồn tại
  
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
  };
  
  // Hàm compareDateTime để so sánh ngày giờ và trả về chuỗi thích hợp
 

  export const compareDateTime = (inputDateTime) => {
    const inputDate = parseDateTime(inputDateTime);
    if (!inputDate) return ''; // Kiểm tra nếu inputDate không tồn tại
  
    const now = new Date();
  
    const diffMinutes = getMinuteDifference(inputDateTime);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffMinutes / (60 * 24));
  
    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 1) {
      return `${diffMinutes}m`;
    } else if (diffMinutes === 1) {
      return '1m';
    } else {
      return 'now';
    }
  };

  // hàm so sánh ngày giờ định dạng VN
  export const compareDateTimeToday = (inputDateTime) => {
    const inputDate = parseDateTime(inputDateTime);
    if (!inputDate) return ''; // Kiểm tra nếu inputDate không tồn tại
  
    const now = new Date();
    const diffMinutes = getMinuteDifference(inputDateTime);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffMinutes / (60 * 24));
  
    // Hàm định dạng giờ và phút
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
  
    // Hàm định dạng ngày tháng và giờ phút
    const formatDateTimeWithDayMonth = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý: tháng bắt đầu từ 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}, ${formatTime(date)}`;
    };
  
    // Kiểm tra nếu là cùng ngày
    if (now.toDateString() === inputDate.toDateString()) {
      return `Hôm nay ${formatTime(inputDate)}`;
    }
  
    // Kiểm tra nếu là ngày hôm trước
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === inputDate.toDateString()) {
      return `Hôm qua ${formatTime(inputDate)}`;
    }
  
    // Trường hợp khác
    return formatDateTimeWithDayMonth(inputDate);
  };
  // Hàm so sánh ngày giờ định dạng US
  export const compareDateTimeUSToday = (inputDateTime) => {
    const inputDate = parseDateTime(inputDateTime);
  if (!inputDate) return ''; // Kiểm tra nếu inputDate không tồn tại

  const now = new Date();
  const diffMinutes = getMinuteDifference(inputDateTime);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffMinutes / (60 * 24));

  // Hàm định dạng giờ và phút với AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Giờ 0 phải đổi thành 12
    return `${hours}:${minutes} ${ampm}`;
  };

  // Hàm định dạng ngày tháng và giờ phút với AM/PM
  const formatDateTimeWithDayMonth = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lưu ý: tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${month} ${day}, ${year}, ${formatTime(date)}`;
  };

  // Kiểm tra nếu là cùng ngày
  if (now.toDateString() === inputDate.toDateString()) {
    return `Today ${formatTime(inputDate)}`;
  }

  // Kiểm tra nếu là ngày hôm trước
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === inputDate.toDateString()) {
    return `Yesterday ${formatTime(inputDate)}`;
  }

  // Trường hợp khác
  return formatDateTimeWithDayMonth(inputDate);

  };

  export const compareDateTimes = (inputDateTime) => {
    console.log("inputDateTime", inputDateTime);
    const inputDate = parseDateTime(inputDateTime);
   
    if (!inputDate) return ''; // Kiểm tra nếu inputDate không tồn tại
  
    const diffMinutes = getMinuteDifference(inputDateTime);
    console.log("diffMinutes", diffMinutes);
    const diffHours = Math.floor(diffMinutes / 60);
    console.log("diffHours", diffHours);
       // Tính số ngày khác biệt 1d 2d 3d
    const diffDays = Math.floor(diffMinutes / (60 * 24));
    
   
    if (diffHours > 24) {
      return `1d`;
    }
    if (diffHours > 48) {
      return `2d`;
    }
    if (diffHours > 72) {
      return `3d`;
    }
    if (diffHours > 96) {
      return `4d`;
    }
    if (diffHours > 120) {
      return `5d`;
    }
    if (diffHours > 144) {
      return `6d`;
    }
    if (diffHours > 168) {
      return `1 week ago`;  
    }

    else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 1) {
      return `${diffMinutes}m`;
    } else if (diffMinutes === 1) {
      return '1m';
    } else {
      return 'now';
    }
  };