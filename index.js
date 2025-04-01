import express from 'express'
import dotenv from 'dotenv'
import {AppRoute} from './AppRoute'
import db from './models'
dotenv.config()
const app = express()
const os = require('os');
app.use(express.json())
app.use(express.urlencoded({extended: true})) // Corrected line
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

AppRoute(app)
app.get('/healthcheck', async (req, res) => {
    try {
        // Kiểm tra kết nối cơ sở dữ liệu (giả sử có db)
        await db.sequelize.authenticate();

        // Lấy thông tin tải CPU trung bình trong 1, 5, 15 phút
        const cpuLoad = os.loadavg();

        // Lấy thông tin bộ nhớ hệ thống
        const memoryUsage = process.memoryUsage();
        const freeMemory = os.freemem(); // Lượng RAM trống
        const totalMemory = os.totalmem();

        // Tính toán tải CPU %
        const cpus = os.cpus();
        const cpuPercentage = (cpuLoad[0] / cpus.length) * 100;

        // Lấy thời gian hệ thống chạy từ khi bật (tính bằng giây)
        const uptime = os.uptime();

        // Trả về kết quả
        res.status(200).json({
            status: 'OK',
            database: 'Connected',
            cpuLoad,
            cpuPercentage,
            memoryUsage,
            freeMemory,
            totalMemory,
            uptime
        });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const port  = process?.env?.PORT ?? 3000  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})