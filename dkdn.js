// Lấy danh sách tài khoản từ localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Lưu danh sách tài khoản vào localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* =======================
      XỬ LÝ ĐĂNG KÝ
======================= */
if (document.getElementById("register-form")) {

    document.getElementById("register-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;
        const confirm = document.getElementById("reg-confirm-password").value;

        if (password !== confirm) {
            alert("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        let users = getUsers();

        // Kiểm tra trùng email hoặc username
        const exists = users.some(u => u.email === email || u.username === username);

        if (exists) {
            alert("❌ Email hoặc Tên đăng nhập đã tồn tại!");
            return;
        }

        // Tạo tài khoản mới
        users.push({
            name: name,
            email: email,
            username: username,
            password: password
        });

        saveUsers(users);

        alert("✔ Đăng ký thành công! Bạn có thể đăng nhập.");
        window.location.href = "dangnhap.html";
    });
}


/* =======================
      XỬ LÝ ĐĂNG NHẬP
======================= */
if (document.getElementById("login-form")) {

    document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        let users = getUsers();

        const loginSuccess = users.some(
            u => (u.username === username || u.email === username) && u.password === password
        );

        if (loginSuccess) {
            alert("✔ Đăng nhập thành công!");

            // Lưu tài khoản đang đăng nhập
            localStorage.setItem("currentUser", username);

            window.location.href = "index.html";
        } else {
            alert("❌ Sai tài khoản hoặc mật khẩu!");
        }
    }); 
}


/* =======================
  HIỂN THỊ TÊN NGƯỜI DÙNG TRÊN INDEX
======================= */

document.addEventListener("DOMContentLoaded", function () {

    const authArea = document.getElementById("auth-area"); 
    if (!authArea) return; // Trang không có khu vực hiển thị -> bỏ qua

    const users = getUsers();
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        // Lấy tài khoản đang đăng nhập
        const user = users.find(u => u.username === currentUser || u.email === currentUser);

        authArea.innerHTML = `
            <span class="text-brown-primary font-semibold">
                Xin chào, ${user ? user.name : currentUser}
            </span>
            <button id="logoutBtn" 
                class="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                Đăng Xuất
            </button>
        `;

        // Xử lý đăng xuất
        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.reload();
        });

    } else {
        // Chưa đăng nhập → hiện nút đăng nhập & đăng ký
        authArea.innerHTML = `
            <a href="dangnhap.html" 
               class="px-3 py-2 rounded-md text-brown-primary hover:bg-f7f3e8">
               <i class="fa-solid fa-right-to-bracket mr-2"></i> Đăng Nhập
            </a>

            <a href="dangkytk.html"
               class="px-3 py-2 rounded-md bg-brown-secondary text-white hover:bg-brown-primary">
               <i class="fa-solid fa-user-plus mr-2"></i> Đăng Ký
            </a>
        `;
    }

});
