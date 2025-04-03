/**
 * Viết các hàm trong JWT middleware(requireRole và requireRoles) với các chức năng sau:
 * - Lấy jwt Token từ Headers và kiểm tra xem token này có hợp lệ và còn hạn hay không.
 * - Lấy ra user's id từ token và query xuống database kiểm tra xem user này có bị block hay không.
 * - Lấy ra role của user và kiểm tra xem role đó có phù hợp với role đầu vào của các hàm requireRole và requireRoles hay không.
 */
import { getUserFromToken } from "../helpers/tokenHelpers";

const requireRoles = (rolesRequired) => async (req, res, next) => {
    const user = await getUserFromToken(req, res);
    if (!user) return; // Hàm getUserFromToken đã xử lý phản hồi nếu xảy ra lỗi

    if(user.is_locked === 1) {
        return res.status(403).json({ message: 'Tài khoản này đã bị khóa' });
    }

    if (!rolesRequired.includes(user.role)) {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    req.user = user; // Gắn thông tin người dùng vào req để sử dụng tiếp theo
    next(); // Chuyển đến middleware tiếp theo
};

export { requireRoles };
