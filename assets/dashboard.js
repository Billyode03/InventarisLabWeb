// ==============================
// CEK LOGIN
// ==============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

// ==============================
// HELPER
// ==============================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}

// ==============================
// SIDEBAR
// ==============================

setText("sidebarNama", user.nama);

// ==============================
// HEADER
// ==============================

setText("headerNama", user.nama);
setText("headerRole", user.role);

// ==============================
// DASHBOARD DETAIL
// ==============================

setText("detailNama", user.nama);
setText("detailNim", user.nim);
setText("detailRole", user.role.toUpperCase());

// ==============================
// FOTO PROFIL (Jika Ada)
// ==============================

const sidebarAvatar = document.getElementById("sidebarAvatar");

if (sidebarAvatar) {
    sidebarAvatar.src = `https://i.pravatar.cc/100?u=${user.nim}`;
}

const headerAvatar = document.getElementById("headerAvatar");

if (headerAvatar) {
    headerAvatar.src = `https://i.pravatar.cc/100?u=${user.nim}`;
}