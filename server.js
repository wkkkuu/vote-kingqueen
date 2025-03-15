const jsonServer = require("json-server");
const cors = require("cors"); // Import thư viện CORS
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json")); // Đọc db.json từ thư mục hiện tại
const middlewares = jsonServer.defaults();

server.use(cors()); // Bật CORS để frontend có thể gọi API
server.use(middlewares);
server.use(router);

// Route kiểm tra server đang chạy (Render có thể ping vào đây)
server.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ JSON Server is running on port ${PORT}`);
});