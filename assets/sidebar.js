// =========================================================
// SIDEBAR.JS
// ROLE
//
// ADMIN      : akses penuh
// KAJUR      : akses monitoring + approval
// MAHASISWA  : akses terbatas
// =========================================================


// =========================================================
// AMBIL USER
// =========================================================

function getSidebarUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        console.error(
            "Gagal membaca user:",
            error
        );

        return null;
    }
}


// =========================================================
// USER LOGIN
// =========================================================

const sidebarUser =
    getSidebarUser();


// =========================================================
// ROLE
// =========================================================

const sidebarRole =
    String(
        sidebarUser?.role || ""
    )
    .trim()
    .toLowerCase();


// =========================================================
// NORMALISASI ROLE
// =========================================================

let roleLabel = "User";

if (sidebarRole === "admin") {

    roleLabel = "Admin";

}

else if (
    sidebarRole === "kajur" ||
    sidebarRole === "ketua jurusan"
) {

    roleLabel = "Ketua Jurusan";

}

else if (
    sidebarRole === "mahasiswa"
) {

    roleLabel = "Mahasiswa";

}


// =========================================================
// USERNAME
// =========================================================

const userName =
    sidebarUser?.nama || "User";


// =========================================================
// TAMPILKAN USER
// =========================================================

const sidebarUserName =
    document.getElementById(
        "sidebarUserName"
    );

if (sidebarUserName) {

    sidebarUserName.textContent =
        userName;

}


const headerUserName =
    document.getElementById(
        "headerUserName"
    );

if (headerUserName) {

    headerUserName.textContent =
        userName;

}


const headerUserRole =
    document.getElementById(
        "headerUserRole"
    );

if (headerUserRole) {

    headerUserRole.textContent =
        roleLabel;

}


// =========================================================
// MENU ELEMENT
// =========================================================

const menuUsers =
    document.getElementById(
        "menuUsers"
    );


const menuBarangMasuk =
    document.getElementById(
        "menuBarangMasuk"
    );


const menuBarangKeluar =
    document.getElementById(
        "menuBarangKeluar"
    );


const menuLaporan =
    document.getElementById(
        "menuLaporan"
    );


const btnTambahPeminjaman =
    document.getElementById(
        "btnTambahPeminjaman"
    );


// =========================================================
// ADMIN
// =========================================================

if (
    sidebarRole === "admin"
) {

    // Admin melihat semua menu

}


// =========================================================
// KAJUR
// =========================================================

// =========================================================
// KAJUR
// =========================================================

else if (
    sidebarRole === "kajur" ||
    sidebarRole === "ketua jurusan"
) {

    // -----------------------------------------
    // DATA USER
    // KAJUR TIDAK BOLEH MELIHAT
    // -----------------------------------------

    if (menuUsers) {

        menuUsers.style.display =
            "none";

    }


    // -----------------------------------------
    // BARANG MASUK
    // KAJUR TIDAK BOLEH MELIHAT
    // -----------------------------------------

    if (menuBarangMasuk) {

        menuBarangMasuk.style.display =
            "none";

    }


    // -----------------------------------------
    // BARANG KELUAR
    // KAJUR TIDAK BOLEH MELIHAT
    // -----------------------------------------

    if (menuBarangKeluar) {

        menuBarangKeluar.style.display =
            "none";

    }


    // -----------------------------------------
    // TAMBAH PEMINJAMAN
    // KAJUR TIDAK BOLEH MENAMBAH
    // -----------------------------------------

    if (btnTambahPeminjaman) {

        btnTambahPeminjaman.style.display =
            "none";

    }

}

else if (
    sidebarRole === "mahasiswa"
) {

    // -----------------------------------------
    // DATA USER
    // -----------------------------------------

    if (menuUsers) {

        menuUsers.style.display =
            "none";

    }


    // -----------------------------------------
    // BARANG MASUK
    // -----------------------------------------

    if (menuBarangMasuk) {

        menuBarangMasuk.style.display =
            "none";

    }


    // -----------------------------------------
    // BARANG KELUAR
    // -----------------------------------------

    if (menuBarangKeluar) {

        menuBarangKeluar.style.display =
            "none";

    }


    // -----------------------------------------
    // LAPORAN
    // -----------------------------------------

    if (menuLaporan) {

        menuLaporan.style.display =
            "none";

    }


    // -----------------------------------------
    // TAMBAH PEMINJAMAN
    // -----------------------------------------

    // Kalau mahasiswa memang boleh mengajukan
    // peminjaman, JANGAN disembunyikan.

}


// =========================================================
// ROLE TIDAK DIKENAL
// =========================================================

else {

    console.warn(
        "Role tidak dikenali:",
        sidebarRole
    );

}

// =========================================================
// DASHBOARD BERDASARKAN ROLE
// =========================================================

const dashboardLink =
    document.getElementById("dashboardLink");

if (dashboardLink) {

    // ADMIN
    if (sidebarRole === "admin") {

        dashboardLink.href =
            "../dashboard.html";

    }

    // KAJUR
    else if (
        sidebarRole === "kajur" ||
        sidebarRole === "ketua jurusan"
    ) {

        dashboardLink.href =
            "../kajur_dashboard.html";

    }

    // MAHASISWA
    else if (
        sidebarRole === "mahasiswa"
    ) {

        dashboardLink.href =
            "../mahasiswa_dashboard.html";

    }

}