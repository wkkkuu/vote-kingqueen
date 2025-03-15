async function getDeviceId() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId; // Lấy ID duy nhất của thiết bị
}

// Lấy danh sách thiết bị đã vote từ JSON Server
async function fetchVotedDevices() {
    try {
        const response = await fetch("http://localhost:3000/votedDevices");
        const votedDevices = await response.json();
        return votedDevices.map(device => device.id); // Trả về danh sách ID thiết bị
    } catch (error) {
        console.error("Lỗi tải danh sách thiết bị:", error);
        return [];
    }
}

// Kiểm tra xem thiết bị đã vote chưa
async function checkVoted() {
    const deviceId = await getDeviceId();
    const votedDevices = await fetchVotedDevices();

    if (votedDevices.includes(deviceId)) {
        document.getElementById("message").innerText = "Bạn đã vote rồi!";
        document.getElementById("message").classList.remove("hidden");
        return true;
    }
    return false;
}

// Xử lý khi vote
async function vote(candidate) {
    if (await checkVoted()) return;

    const deviceId = await getDeviceId();

    try {
        // Gửi thiết bị lên API để lưu vào danh sách
        await fetch("http://localhost:3000/votedDevices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deviceId })
        });

        alert(`Bạn đã vote cho ${candidate}. Cảm ơn!`);
        document.getElementById("message").innerText = "Bạn đã vote rồi!";
        document.getElementById("message").classList.remove("hidden");
    } catch (error) {
        console.error("Lỗi khi lưu thiết bị đã vote:", error);
    }
}

checkVoted();
