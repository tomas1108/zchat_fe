// src/utils/dateUtils.js
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Hàm chuyển đổi thời gian từ ISO 8601 sang định dạng ngày tháng Việt Nam
export function convertISOToVietnameseDateTime(isoDateTime) {
  try {
    // Chuyển đổi thời gian UTC sang múi giờ Việt Nam (Asia/Ho_Chi_Minh)
    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
    const zonedTime = toZonedTime(new Date(isoDateTime), vietnamTimeZone);

    // Định dạng lại thời gian theo định dạng ngày tháng Việt Nam (dd/MM/yyyy HH:mm:ss)
    const formattedDateTime = format(zonedTime, 'dd/MM/yyyy HH:mm:ss', { timeZone: vietnamTimeZone });

    return formattedDateTime;
  } catch (error) {
    console.error('Error converting ISO datetime to Vietnamese datetime:', error);
    return null;
  }
}
