// =========================================================
// DASHBOARD.JS
// DASHBOARD ADMIN INVENTARIS LAB
// =========================================================

// =========================================================
// CEK USER LOGIN
// =========================================================

const dashboardUser = (() => {

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

})();


// =========================================================
// TAMPILKAN INFORMASI USER
// =========================================================

function tampilkanUser() {

    if (!dashboardUser) {
        return;
    }

    const nama =
        dashboardUser.nama || "User";

    const nim =
        dashboardUser.nim || "-";

    const role =
        dashboardUser.role || "User";


    // Sidebar
    const sidebarNama =
        document.getElementById("sidebarNama");

    if (sidebarNama) {
        sidebarNama.textContent = nama;
    }


    // Header
    const headerNama =
        document.getElementById("headerNama");

    if (headerNama) {
        headerNama.textContent = nama;
    }


    // Header role
    const headerRole =
        document.getElementById("headerRole");

    if (headerRole) {
        headerRole.textContent = role;
    }


    // Detail login
    const detailNama =
        document.getElementById("detailNama");

    if (detailNama) {
        detailNama.textContent = nama;
    }


    const detailNim =
        document.getElementById("detailNim");

    if (detailNim) {
        detailNim.textContent = nim;
    }


    const detailRole =
        document.getElementById("detailRole");

    if (detailRole) {

        detailRole.textContent =
            role;
    }
}


// =========================================================
// HELPER
// =========================================================

function setCardValue(index, value) {

    const cards =
        document.querySelectorAll(".card");

    if (!cards[index]) {
        return;
    }

    const number =
        cards[index].querySelector(
            ".text-6xl"
        );

    if (number) {

        number.textContent =
            value ?? 0;
    }
}


// =========================================================
// MODEL BARANG
// =========================================================

async function loadModelBarang() {

    const {
        count,
        error
    } = await supabaseClient
        .from("barang")
        .select("*", {
            count: "exact",
            head: true
        });


    if (error) {

        console.error(
            "Gagal mengambil Model Barang:",
            error
        );

        setCardValue(0, 0);
        return;
    }


    setCardValue(
        0,
        count || 0
    );
}


// =========================================================
// PENGGUNA
// =========================================================

async function loadPengguna() {

    const {
        count,
        error
    } = await supabaseClient
        .from("users")
        .select("*", {
            count: "exact",
            head: true
        });


    if (error) {

        console.error(
            "Gagal mengambil Pengguna:",
            error
        );

        setCardValue(1, 0);
        return;
    }


    setCardValue(
        1,
        count || 0
    );
}


// =========================================================
// SUPPLIER
// =========================================================
// Mengambil jumlah supplier unik dari tabel barang.
//
// CATATAN:
// Diasumsikan tabel barang memiliki kolom:
// supplier
// =========================================================

async function loadSupplier() {

    const {
        data,
        error
    } = await supabaseClient
        .from("barang")
        .select("supplier");


    if (error) {

        console.warn(
            "Data supplier tidak dapat diambil:",
            error.message
        );

        setCardValue(2, 0);
        return;
    }


    const supplierUnik =
        new Set(
            (data || [])
                .map(item =>
                    item.supplier
                )
                .filter(Boolean)
        );


    setCardValue(
        2,
        supplierUnik.size
    );
}


// =========================================================
// TRANSAKSI PEMINJAMAN
// =========================================================

async function loadTransaksiPeminjaman() {

    const {
        count,
        error
    } = await supabaseClient
        .from("peminjaman")
        .select("*", {
            count: "exact",
            head: true
        });


    if (error) {

        console.error(
            "Gagal mengambil transaksi peminjaman:",
            error
        );

        setCardValue(3, 0);
        return;
    }


    setCardValue(
        3,
        count || 0
    );
}


// =========================================================
// TOTAL BARANG MASUK
// =========================================================

async function loadTotalBarangMasuk() {

    const {
        data,
        error
    } = await supabaseClient
        .from("barang_masuk")
        .select("jumlah");


    if (error) {

        console.error(
            "Gagal mengambil barang masuk:",
            error
        );

        setCardValue(4, 0);
        return;
    }


    const total =
        (data || []).reduce(
            (sum, item) =>
                sum + Number(item.jumlah || 0),
            0
        );


    setCardValue(
        4,
        total
    );
}


// =========================================================
// TOTAL BARANG KELUAR
// =========================================================

async function loadTotalBarangKeluar() {

    const {
        data,
        error
    } = await supabaseClient
        .from("barang_keluar")
        .select("jumlah");


    if (error) {

        console.error(
            "Gagal mengambil barang keluar:",
            error
        );

        setCardValue(5, 0);
        return;
    }


    const total =
        (data || []).reduce(
            (sum, item) =>
                sum + Number(item.jumlah || 0),
            0
        );


    setCardValue(
        5,
        total
    );
}


// =========================================================
// TOTAL TRANSAKSI BARANG MASUK
// =========================================================

async function loadTransaksiBarangMasuk() {

    const {
        count,
        error
    } = await supabaseClient
        .from("barang_masuk")
        .select("*", {
            count: "exact",
            head: true
        });


    if (error) {

        console.error(
            "Gagal mengambil transaksi barang masuk:",
            error
        );

        setCardValue(6, 0);
        return;
    }


    setCardValue(
        6,
        count || 0
    );
}


// =========================================================
// TOTAL TRANSAKSI BARANG KELUAR
// =========================================================

async function loadTransaksiBarangKeluar() {

    const {
        count,
        error
    } = await supabaseClient
        .from("barang_keluar")
        .select("*", {
            count: "exact",
            head: true
        });


    if (error) {

        console.error(
            "Gagal mengambil transaksi barang keluar:",
            error
        );

        setCardValue(7, 0);
        return;
    }


    setCardValue(
        7,
        count || 0
    );
}


// =========================================================
// PEMINJAMAN DIKEMBALIKAN
// =========================================================

async function loadPeminjamanDikembalikan() {

    const {
        count,
        error
    } = await supabaseClient
        .from("peminjaman")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(
            "status",
            "dikembalikan"
        );


    if (error) {

        console.error(
            "Gagal mengambil peminjaman dikembalikan:",
            error
        );

        setCardValue(8, 0);
        return;
    }


    setCardValue(
        8,
        count || 0
    );
}


// =========================================================
// PEMINJAMAN BELUM DIKEMBALIKAN
// =========================================================

async function loadPeminjamanBelumDikembalikan() {

    const {
        count,
        error
    } = await supabaseClient
        .from("peminjaman")
        .select("*", {
            count: "exact",
            head: true
        })
        .neq(
            "status",
            "dikembalikan"
        );


    if (error) {

        console.error(
            "Gagal mengambil peminjaman belum dikembalikan:",
            error
        );

        setCardValue(9, 0);
        return;
    }


    setCardValue(
        9,
        count || 0
    );
}


// =========================================================
// LINK MORE INFO
// =========================================================

function setupMoreInfo() {

    const buttons =
        document.querySelectorAll(
            ".more-info-btn"
        );


    const links = [

        "../pages/barang.html",

        "../pages/users.html",

        "../pages/barang.html",

        "../pages/peminjaman.html",

        "../pages/barang_masuk.html",

        "../pages/barang_keluar.html",

        "../pages/barang_masuk.html",

        "../pages/barang_keluar.html",

        "../pages/peminjaman.html",

        "../pages/peminjaman.html"

    ];


    buttons.forEach(
        (button, index) => {

            button.onclick = function () {

                if (links[index]) {

                    window.location.href =
                        links[index];

                }

            };

        }
    );
}


// =========================================================
// LOAD SEMUA DATA DASHBOARD
// =========================================================

async function loadDashboard() {

    console.log(
        "Memuat data dashboard..."
    );


    await Promise.all([

        loadModelBarang(),

        loadPengguna(),

        loadSupplier(),

        loadTransaksiPeminjaman(),

        loadTotalBarangMasuk(),

        loadTotalBarangKeluar(),

        loadTransaksiBarangMasuk(),

        loadTransaksiBarangKeluar(),

        loadPeminjamanDikembalikan(),

        loadPeminjamanBelumDikembalikan()

    ]);


    console.log(
        "Dashboard berhasil dimuat."
    );
}


// =========================================================
// INIT
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        tampilkanUser();

        setupMoreInfo();

        loadDashboard();

    }
);

