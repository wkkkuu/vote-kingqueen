async function getDeviceId() {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId; // Lấy ID duy nhất của thiết bị
    } catch (error) {
        console.error("Lỗi lấy ID thiết bị:", error);
        alert("Không thể lấy ID thiết bị. Hãy thử lại!");
        return null;
    }
}

// Đổi URL này khi deploy lên Render
const API_URL = "https://vote-kingqueen.onrender.com/votedDevices"; // API trên Render 

// Lấy danh sách thiết bị đã vote từ JSON Server
async function fetchVotedDevices() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Lỗi kết nối API");
        const votedDevices = await response.json();
        return votedDevices.map(device => device.id); // Trả về danh sách ID thiết bị
    } catch (error) {
        console.error("Lỗi tải danh sách thiết bị:", error);
        alert("Không thể tải dữ liệu. Hãy thử lại sau!");
        return [];
    }
}

// Kiểm tra xem thiết bị đã vote chưa
async function checkVoted() {
    const deviceId = await getDeviceId();
    if (!deviceId) return true; // Nếu không lấy được ID, xem như đã vote

    const votedDevices = await fetchVotedDevices();
    if (votedDevices.includes(deviceId)) {
        document.getElementById("message").innerText = "Bạn đã vote rồi!";
        document.getElementById("message").classList.remove("hidden");
        return true;
    }
    return false;
}

// Chặn spam vote bằng debounce
let voting = false;

// Xử lý khi vote
async function vote(candidate) {
    if (voting) return;
    voting = true; // Ngăn chặn spam

    if (await checkVoted()) {
        voting = false;
        return;
    }

    const deviceId = await getDeviceId();
    if (!deviceId) {
        voting = false;
        return;
    }

    try {
        // Gửi thiết bị lên API để lưu vào danh sách
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deviceId })
        });

        if (!response.ok) throw new Error("Lỗi khi gửi vote");

        alert(`Bạn đã vote cho ${candidate}. Cảm ơn!`);
        document.getElementById("message").innerText = "Bạn đã vote rồi!";
        document.getElementById("message").classList.remove("hidden");
    } catch (error) {
        console.error("Lỗi khi lưu thiết bị đã vote:", error);
        alert("Không thể gửi vote. Vui lòng thử lại!");
    }

    voting = false;
}

checkVoted();