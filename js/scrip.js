// --- KHỞI TẠO VÀ CHỨC NĂNG CHUNG ---
document.addEventListener('DOMContentLoaded', () => {
    // Cập nhật giao diện giỏ hàng khi trang được tải (cần cho tất cả các trang)
    updateCartUI();
    
    // Khởi tạo các chức năng riêng của từng trang
    if (document.getElementById('mobile-menu-button')) {
        document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
    }
    if (document.getElementById('productList')) {
        initProductPage();
    }
    if (document.getElementById('cart-items-container')) {
        initCartPage();
    }
    if (document.getElementById('order-form')) {
        initOrderPage();
    }
    if (document.getElementById('feedback-form')) {
        initFeedbackPage();
    }
    
    // THÊM: Khởi tạo cho trang Đăng nhập
    if (document.getElementById('login-form')) {
        initLoginPage();
    }
    // THÊM: Khởi tạo cho trang Đăng ký
    if (document.getElementById('register-form')) {
        initRegisterPage();
    }

    // Kiểm tra trạng thái đăng ký thành công khi tải trang
    checkRegistrationStatus(); 
});

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

const cartCountElement = document.getElementById('cart-count');

function updateCartUI() {
    // Tính tổng số lượng từ LocalStorage.cartItems
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    localStorage.setItem('cartCount', totalCount); // Cập nhật lại biến đếm
    
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
    
    // CẬP NHẬT UI ĐĂNG NHẬP/ĐĂNG KÝ
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.querySelector('a[href="dangnhap.html"]');
    const registerLink = document.querySelector('a[href="dangkytk.html"]');

    if (loginLink && registerLink) {
        if (isLoggedIn) {
            // Thay thế Đăng Nhập/Đăng Ký bằng nút Đăng Xuất và Tên người dùng
            // GIẢ LẬP: Thay đổi văn bản của nút Đăng Nhập thành Tên người dùng và thêm nút Đăng Xuất
            loginLink.textContent = 'Xin chào, User!';
            loginLink.href = '#'; // Hoặc trang hồ sơ
            loginLink.classList.remove('bg-brown-primary', 'text-white');
            loginLink.classList.add('text-brown-primary', 'hover:text-brown-secondary', 'font-semibold', 'bg-transparent', 'shadow-none', 'py-2', 'px-3');

            registerLink.textContent = 'Đăng Xuất';
            registerLink.href = '#';
            registerLink.classList.remove('bg-brown-secondary');
            registerLink.classList.add('bg-red-500', 'hover:bg-red-700');
            registerLink.removeEventListener('click', handleLogout); // Đảm bảo chỉ gắn 1 lần
            registerLink.addEventListener('click', handleLogout);
            
            // Cập nhật menu di động
            const mobileLogin = document.querySelector('#mobile-menu a[href="dangnhap.html"]');
            const mobileRegister = document.querySelector('#mobile-menu a[href="dangkytk.html"]');
            if(mobileLogin && mobileRegister) {
                mobileLogin.textContent = 'Xin chào, User!';
                mobileLogin.href = '#';
                mobileLogin.classList.remove('bg-brown-primary', 'text-white');
                mobileLogin.classList.add('text-brown-primary', 'hover:bg-f7f3e8');

                mobileRegister.textContent = 'Đăng Xuất';
                mobileRegister.href = '#';
                mobileRegister.classList.remove('bg-brown-secondary', 'hover:bg-brown-primary');
                mobileRegister.classList.add('bg-red-500', 'hover:bg-red-700');
                mobileRegister.removeEventListener('click', handleLogout); // Đảm bảo chỉ gắn 1 lần
                mobileRegister.addEventListener('click', handleLogout);
            }
        } else {
            // Đảm bảo hiển thị Đăng Nhập / Đăng Ký mặc định (chỉ cần thiết nếu bạn gắn hàm này trên mọi trang)
            // Trong trường hợp này, vì các trang không được tải động, ta chỉ cần reset nếu người dùng đăng xuất
            loginLink.textContent = 'Đăng Nhập';
            loginLink.href = 'dangnhap.html';
            loginLink.className = 'text-sm font-semibold text-white bg-brown-primary py-2 px-3 rounded-lg shadow-md';

            registerLink.textContent = 'Đăng Ký';
            registerLink.href = 'dangkytk.html';
            registerLink.className = 'text-sm font-semibold bg-brown-secondary text-white py-2 px-3 rounded-lg hover:bg-[#8d6244] transition btn-zoom-effect';
            registerLink.removeEventListener('click', handleLogout);
            
            // Cập nhật menu di động
            const mobileLogin = document.querySelector('#mobile-menu a[href="#"]'); // Tìm link đã đổi
            const mobileRegister = document.querySelector('#mobile-menu a[href="#"]'); // Tìm link đã đổi
            if(mobileLogin && mobileRegister) {
                mobileLogin.textContent = 'Đăng Nhập';
                mobileLogin.href = 'dangnhap.html';
                mobileLogin.className = 'block px-3 py-2 rounded-md text-base font-medium text-white bg-brown-primary border-t mt-1';

                mobileRegister.textContent = 'Đăng Ký';
                mobileRegister.href = 'dangkytk.html';
                mobileRegister.className = 'block px-3 py-2 rounded-md text-base font-medium text-white bg-brown-secondary hover:bg-brown-primary';
                mobileRegister.removeEventListener('click', handleLogout);
            }
        }
    }
}

// THÊM: Hàm xử lý Đăng Xuất
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
    showNotification('Bạn đã đăng xuất thành công.', 'info');
    updateCartUI(); // Cập nhật lại UI header
    // Nếu đang ở trang có yêu cầu đăng nhập, chuyển hướng về trang chủ
    if (window.location.pathname.includes('dathang.html') || window.location.pathname.includes('giohang.html')) {
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1500);
    } else {
        // Tải lại trang để reset header (đặc biệt cần thiết nếu ở trang đăng nhập/đăng ký)
        setTimeout(() => {
             window.location.reload(); 
        }, 1500);
    }
}


function showNotification(message, type = 'success') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-[10000] space-y-3';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    
    // Thiết lập màu sắc dựa trên loại thông báo
    let bgColor = 'bg-green-600';
    let icon = 'fa-check-circle';
    if (type === 'error') {
        bgColor = 'bg-red-600';
        icon = 'fa-times-circle';
    } else if (type === 'info') {
        bgColor = 'bg-blue-600';
        icon = 'fa-info-circle';
    }

    notification.className = `p-4 text-white rounded-lg shadow-xl flex items-center transform transition-transform duration-300 ease-out translate-x-full ${bgColor}`;
    notification.innerHTML = `
        <i class="fas ${icon} mr-3 text-lg"></i>
        <span>${message}</span>
        <button class="ml-4 text-white opacity-70 hover:opacity-100" onclick="this.closest('div').remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);
    
    // Thêm hiệu ứng trượt vào
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 10);

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-full');
        
        // Xóa khỏi DOM sau khi animation hoàn tất
        notification.addEventListener('transitionend', () => notification.remove());
    }, 5000);
}


// --- CHỨC NĂNG TRANG ĐĂNG NHẬP (dangnhap.html) ---
function initLoginPage() {
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
}

function handleLoginSubmit(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // GIẢ LẬP XỬ LÝ ĐĂNG NHẬP
    // Trong môi trường thực tế: gửi username/password lên server và nhận phản hồi
    
    if (username && password) { // Giả lập đăng nhập thành công nếu cả 2 trường đều có giá trị
        console.log('Đăng nhập thành công với:', username);
        
        // 1. Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        // Lưu tên người dùng giả lập
        localStorage.setItem('userName', 'User'); 
        
        // 2. Hiển thị thông báo thành công
        showNotification(`Đăng nhập thành công! Chào mừng trở lại, ${username}.`, 'success');
        
        // 3. Cập nhật UI ngay lập tức
        updateCartUI();
        
        // 4. Chuyển hướng về trang chủ sau 2 giây
        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 2000);
        
    } else {
        // Giả lập lỗi đăng nhập
        showNotification('Tên đăng nhập hoặc Mật khẩu không đúng. Vui lòng thử lại.', 'error');
    }
}


// --- CHỨC NĂNG TRANG SẢN PHẨM (sanpham.html) ---
function initProductPage() {
    // 1. Gắn sự kiện Thêm vào Giỏ
    document.querySelectorAll('button.btn-primary').forEach(button => {
        if (button.textContent.includes('Thêm vào Giỏ')) {
            button.addEventListener('click', addToCart);
        }
    });

    // 2. Gắn sự kiện Tìm kiếm
    document.getElementById("searchInput").addEventListener("keyup", function () {
        let keyword = this.value.toLowerCase();
        let products = document.querySelectorAll("#productList > div");

        products.forEach(product => {
            let name = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = name.includes(keyword) ? "block" : "none";
        });
    });
}

function addToCart(event) {
    const button = event.currentTarget;
    const itemId = button.dataset.id;
    const itemName = button.dataset.name;
    const itemPrice = parseInt(button.dataset.price);

    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex(item => item.id === itemId);

    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartUI();
    showNotification(`Đã thêm 1 x ${itemName} vào giỏ hàng!`, 'success');
}


// --- CHỨC NĂNG TRANG GIỎ HÀNG (giohang.html) ---
function initCartPage() {
    renderCart();
    
    document.getElementById('clear-cart-button').addEventListener('click', clearCart);
}

function renderCart() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalItemsElement = document.getElementById('subtotal-items');
    const totalAmountElement = document.getElementById('total-amount');
    const clearCartButton = document.getElementById('clear-cart-button');

    // Chỉ render các mục trong giỏ hàng nếu container tồn tại
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = ''; 
    }
    
    let totalAmount = 0;
    let totalItems = 0;

    if (cartItems.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (clearCartButton) clearCartButton.disabled = true;
        if (subtotalItemsElement) subtotalItemsElement.textContent = '0 sản phẩm';
        if (totalAmountElement) totalAmountElement.textContent = formatCurrency(0);
        localStorage.setItem('cartCount', 0);
        updateCartUI();
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    if (clearCartButton) clearCartButton.disabled = false;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        totalItems += item.quantity;

        // Nội dung HTML cho từng sản phẩm (Chỉ cần thiết cho giohang.html)
        if (cartItemsContainer) {
            const itemHtml = `
                <div class="flex items-center justify-between py-4 border-b last:border-b-0" data-item-id="${item.id}">
                    <div class="flex items-center space-x-4">
                        <div class="w-16 h-16 bg-f7f3e8 rounded-lg flex items-center justify-center text-brown-primary text-lg font-bold">SP</div>
                        <div>
                            <h3 class="text-lg font-semibold text-brown-primary">${item.name}</h3>
                            <p class="text-gray-600">${formatCurrency(item.price)}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center border border-gray-300 rounded-md">
                            <span class="px-3 py-1 bg-gray-100 text-gray-700">${item.quantity}</span>
                        </div>
                        
                        <span class="text-lg font-bold text-brown-secondary w-28 text-right hidden sm:inline-block">
                            ${formatCurrency(itemTotal)}
                        </span>

                        <button onclick="removeItem('${item.id}')" class="text-red-500 hover:text-red-700 transition p-2 rounded-full">
                            <i class="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        }
    });

    if (subtotalItemsElement) subtotalItemsElement.textContent = `${totalItems} sản phẩm`;
    if (totalAmountElement) totalAmountElement.textContent = formatCurrency(totalAmount);
    
    localStorage.setItem('cartCount', totalItems);
    updateCartUI();
}

// Chỉnh sửa logic removeItem để chỉ xóa item được chọn
window.removeItem = function(itemId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Tìm index của item đầu tiên có ID tương ứng
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        // Xóa item tại vị trí tìm thấy
        cartItems.splice(itemIndex, 1);
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // LUÔN LUÔN gọi renderCart để cập nhật giao diện và Tóm tắt Đơn hàng
        renderCart(); 
        
        showNotification('Đã xóa 1 món khỏi giỏ hàng.', 'info');
    }
}

// Chỉnh sửa logic clearCart để LUÔN LUÔN gọi renderCart
function clearCart() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?')) {
        localStorage.removeItem('cartItems');
        // Gọi renderCart để cập nhật giao diện và Tóm tắt Đơn hàng
        renderCart(); 
        showNotification('Đã xóa toàn bộ giỏ hàng.', 'info');
    }
}


// --- CHỨC NĂNG TRANG ĐẶT HÀNG (dathang.html) ---
let cartItemsForOrder = []; // Đổi tên biến để tránh trùng lặp
let totalOrderAmount = 0;
let customerData = {};

function initOrderPage() {
    renderOrderSummary(); 
    
    const form = document.getElementById('order-form');
    form.addEventListener('submit', handleOrderSubmit);
    
    const cancelButton = document.querySelector('#confirmation-modal button:not(.btn-primary)');
    if (cancelButton) {
        cancelButton.addEventListener('click', closeModal);
    }
    const confirmButton = document.querySelector('#confirmation-modal button.btn-primary');
    if (confirmButton) {
        confirmButton.addEventListener('click', confirmOrder);
    }
}

function renderOrderSummary() {
    cartItemsForOrder = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const orderSummaryList = document.getElementById('order-summary-list');
    const subtotalAmountElement = document.getElementById('subtotal-amount');
    const totalAmountElement = document.getElementById('total-amount');
    const emptyCartWarning = document.getElementById('empty-cart-warning');
    const submitButton = document.getElementById('submit-order-button');
    
    orderSummaryList.innerHTML = '';
    totalOrderAmount = 0;
    let totalItems = 0;

    if (cartItemsForOrder.length === 0) {
        subtotalAmountElement.textContent = formatCurrency(0);
        totalAmountElement.textContent = formatCurrency(0);
        localStorage.setItem('cartCount', 0);
        updateCartUI();
        emptyCartWarning.classList.remove('hidden');
        submitButton.disabled = true;
        return;
    }
    
    emptyCartWarning.classList.add('hidden');
    submitButton.disabled = false;
    
    cartItemsForOrder.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalOrderAmount += itemTotal;
        totalItems += item.quantity;

        const itemHtml = `
            <div class="flex justify-between text-sm text-gray-700">
                <span>${item.name} x ${item.quantity}</span>
                <span class="font-medium">${formatCurrency(itemTotal)}</span>
            </div>
        `;
        orderSummaryList.insertAdjacentHTML('beforeend', itemHtml);
    });

    subtotalAmountElement.textContent = formatCurrency(totalOrderAmount);
    totalAmountElement.textContent = formatCurrency(totalOrderAmount); 
    
    localStorage.setItem('cartCount', totalItems);
    updateCartUI();
}

function handleOrderSubmit(e) {
    e.preventDefault();

    if (cartItemsForOrder.length === 0) {
        showNotification('Giỏ hàng trống. Không thể đặt hàng.', 'error');
        return;
    }

    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    
    customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        notes: formData.get('notes'),
        payment: formData.get('payment'),
        orderTime: new Date().toISOString()
    };
    
    openModal(customerData);
}

function openModal(data) {
    const modal = document.getElementById('confirmation-modal');
    // Cập nhật thông tin khách hàng
    document.getElementById('modal-name').textContent = data.name;
    document.getElementById('modal-phone').textContent = data.phone;
    document.getElementById('modal-address').textContent = data.address;
    document.getElementById('modal-notes').textContent = data.notes || '(Không có)';
    document.getElementById('modal-payment').textContent = data.payment === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng';
    document.getElementById('modal-total-amount').textContent = formatCurrency(totalOrderAmount);

    // Cập nhật danh sách đơn hàng
    const modalOrderList = document.getElementById('modal-order-list');
    modalOrderList.innerHTML = '';
    cartItemsForOrder.forEach(item => {
         const itemHtml = `
            <li>
                <div class="flex justify-between">
                    <span>${item.name} x ${item.quantity}</span>
                    <span class="font-semibold">${formatCurrency(item.price * item.quantity)}</span>
                </div>
            </li>
        `;
        modalOrderList.insertAdjacentHTML('beforeend', itemHtml);
    });
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

window.closeModal = function() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

window.confirmOrder = function() {
    closeModal();
    
    const finalOrder = {
        customer: customerData,
        items: cartItemsForOrder,
        total: totalOrderAmount
    };
    
    console.log("Đơn hàng đã hoàn tất:", finalOrder);
    
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartCount');

    showNotification('Đặt hàng thành công! Cảm ơn bạn đã tin tưởng.', 'success');
    
    renderOrderSummary();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}


// --- CHỨC NĂNG TRANG PHẢN HỒI (phanhoi.html) ---
function initFeedbackPage() {
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', handleFeedbackSubmit);
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const feedbackForm = document.getElementById('feedback-form');
    const formData = new FormData(feedbackForm);
    const feedbackData = {};
    formData.forEach((value, key) => feedbackData[key] = value);
    
    console.log("Đã nhận phản hồi:", feedbackData);
    
    feedbackForm.reset();
    
    showNotification('Cảm ơn bạn đã phản hồi! Chúng tôi sẽ liên hệ ngay với bạn ngay khi nhận được phản hồi.', 'success');
}

// --- KIỂM TRA ĐĂNG KÝ THÀNH CÔNG KHI TẢI TRANG ---

function checkRegistrationStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'success') {
        showNotification('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.', 'success');
        
        // Xóa tham số khỏi URL để không hiển thị lại khi refresh
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
    }
}

// --- CHỨC NĂNG TRANG ĐĂNG KÝ (dangkytk.html) ---
function initRegisterPage() {
    document.getElementById('register-form').addEventListener('submit', handleRegisterSubmit);
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // 1. Kiểm tra mật khẩu
    if (password !== confirmPassword) {
        showNotification('Lỗi: Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    // 2. GIẢ LẬP GỬI DỮ LIỆU ĐĂNG KÝ THÀNH CÔNG
    // Trong môi trường thực tế, bạn sẽ gửi dữ liệu này lên Back-end.
    console.log('Đang xử lý đăng ký...');
    
    // 3. CHUYỂN HƯỚNG VỀ TRANG CHỦ KÈM THEO THAM SỐ THÀNH CÔNG
    // Tham số `?register=success` sẽ được `scrip.js` ở trang index.html đọc
    window.location.href = 'index.html?register=success'; 
}