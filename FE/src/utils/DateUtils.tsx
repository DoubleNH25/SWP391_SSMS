export const DateUtils = {
  // Gửi ngày giờ lên BE dưới dạng UTC ISO string
  toUTCISOString(date: Date): string {
    return date.toISOString(); // Ví dụ: 2025-06-14T13:00:00.000Z
  },

  // Parse từ string của BE thành Date (tự động thành local)
  toLocalDate(isoString: string): Date {
    return new Date(isoString);
  },

  // Parse DateTime từ BE và giữ nguyên thời gian (không convert timezone)
  parseBackendDateTime(dateTimeString: string): Date {
    // Nếu BE gửi về format như "2025-06-14T09:00:00.000Z"
    // Chúng ta muốn hiểu là 09:00 local time, không phải UTC
    if (dateTimeString.endsWith('Z')) {
      // Remove Z và parse như local time
      const withoutZ = dateTimeString.slice(0, -1);
      return new Date(withoutZ);
    }
    return new Date(dateTimeString);
  },

  // Gửi lên BE: format để BE nhận đúng thời gian local
  customFormatDateForBackend(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    // Tạo ISO string với timezone offset để BE hiểu đúng local time
    const pad = (num: number) => String(num).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    const milliseconds = String(d.getMilliseconds()).padStart(3, '0');

    // Get timezone offset
    const timezoneOffset = -d.getTimezoneOffset(); // in minutes
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const offsetString = `${offsetSign}${pad(offsetHours)}:${pad(offsetMinutes)}`;

    // Format: YYYY-MM-DDTHH:mm:ss.sss+07:00 (với timezone offset)
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
  },

  // Hiển thị ngày giờ rõ ràng (local time)
  customFormatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  },

  // Hiển thị chỉ ngày (local time)
  customFormatDateOnly(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },

  // Hiển thị chỉ thời gian (local time)
  customFormatTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      return "00:00";
    }
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
};
