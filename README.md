# Xoá dữ liệu đã vote bằng cách: 
1. Vào trang https://vote-kingqueen.onrender.com
2. F12 -> Console
3. Copy Paste đoạn code:
async function deleteAllVotes() {
    try {
        const response = await fetch("https://vote-kingqueen.onrender.com/votedDevices");
        const votes = await response.json();
        
        for (const vote of votes) {
            await fetch(`https://vote-kingqueen.onrender.com/votedDevices/${vote.id}`, {
                method: "DELETE"
            });
        }

        console.log("Xoá toàn bộ dữ liệu vote thành công!");
    } catch (error) {
        console.error("Lỗi khi xoá dữ liệu:", error);
    }
}

deleteAllVotes();
4. Chạy lại trang