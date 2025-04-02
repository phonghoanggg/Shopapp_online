const BannerStatus = {
  INACTIVE: 0,  // Banner không được hiển thị, có thể do đã hết hạn hoặc được tạm ngưng bởi người quản lý.
  ACTIVE: 1,    // Banner đang được hiển thị trên trang web hoặc ứng dụng.
  SCHEDULED: 2, // Banner đã được lên lịch để hiển thị vào một thời điểm cụ thể trong tương lai.
  EXPIRED: 3    // Banner đã hết hạn hiển thị và không còn hiệu lực.
};

export default BannerStatus;