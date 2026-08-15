// =========================================================
// LAPORAN.JS
// LAPORAN INVENTARIS LABORATORIUM
//
// SUMBER DATA:
//
// barang_masuk
// barang_keluar
// peminjaman
//
// PENGEMBALIAN
// diambil dari peminjaman
// dengan status = Dikembalikan
//
// ROLE:
//
// ADMIN
// - Melihat semua laporan
//
// KAJUR
// - Melihat semua laporan
//
// MAHASISWA
// - Tidak digunakan untuk laporan umum
// =========================================================


// =========================================================
// USER
// =========================================================

function getCurrentUser() {

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


const currentUser =
    getCurrentUser();


const currentRole =
    String(
        currentUser?.role || ""
    )
    .trim()
    .toLowerCase();


console.log(
    "USER LAPORAN:",
    currentUser
);

console.log(
    "ROLE LAPORAN:",
    currentRole
);


// =========================================================
// DATA GLOBAL
// =========================================================

let laporanData = [];


// =========================================================
// INIT
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLaporan();

    }
);


// =========================================================
// LOAD LAPORAN
// =========================================================

async function loadLaporan() {


    const table =
        document.getElementById(
            "dataTable"
        );


    if (!table) {

        return;

    }


    // =====================================================
    // LOADING
    // =====================================================

    table.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-10 text-gray-500">

                <i
                    class="fas fa-spinner fa-spin text-3xl mb-3">
                </i>

                <p>
                    Memuat laporan...
                </p>

            </td>

        </tr>

    `;


    // =====================================================
    // FILTER
    // =====================================================

    const jenis =
        document.getElementById(
            "jenisLaporan"
        )?.value || "semua";


    const tanggalMulai =
        document.getElementById(
            "tanggalMulai"
        )?.value || "";


    const tanggalAkhir =
        document.getElementById(
            "tanggalAkhir"
        )?.value || "";


    // =====================================================
    // ARRAY DATA
    // =====================================================

    let semuaData = [];


    // =====================================================
    // BARANG MASUK
    // =====================================================

    if (
        jenis === "semua" ||
        jenis === "masuk"
    ) {

        const {
            data,
            error
        } = await supabaseClient

            .from("barang_masuk")

            .select(`
                *,
                barang (
                    id,
                    nama
                )
            `)

            .order(
                "tanggal",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "ERROR BARANG MASUK:",
                error
            );

        } else {

            (data || []).forEach(
                item => {

                    semuaData.push({

                        tanggal:
                            item.tanggal,

                        jenis:
                            "Barang Masuk",

                        kode:
                            item.kode_masuk ||
                            item.id ||
                            "-",

                        barang:
                            item.barang?.nama ||
                            "-",

                        user:
                            item.penerima ||
                            item.user_id ||
                            "-",

                        jumlah:
                            item.jumlah || 0,

                        keterangan:
                            item.keterangan ||
                            "Barang masuk"

                    });

                }
            );

        }

    }


    // =====================================================
    // BARANG KELUAR
    // =====================================================

    if (
        jenis === "semua" ||
        jenis === "keluar"
    ) {

        const {
            data,
            error
        } = await supabaseClient

            .from("barang_keluar")

            .select(`
                *,
                barang (
                    id,
                    nama
                )
            `)

            .order(
                "tanggal",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "ERROR BARANG KELUAR:",
                error
            );

        } else {

            (data || []).forEach(
                item => {

                    semuaData.push({

                        tanggal:
                            item.tanggal,

                        jenis:
                            "Barang Keluar",

                        kode:
                            item.kode_keluar ||
                            item.id ||
                            "-",

                        barang:
                            item.barang?.nama ||
                            "-",

                        user:
                            item.pengguna ||
                            item.user_id ||
                            "-",

                        jumlah:
                            item.jumlah || 0,

                        keterangan:
                            item.keterangan ||
                            "Barang keluar"

                    });

                }
            );

        }

    }


    // =====================================================
    // PEMINJAMAN
    // =====================================================

    if (
        jenis === "semua" ||
        jenis === "peminjaman"
    ) {

        const {
            data,
            error
        } = await supabaseClient

            .from("peminjaman")

            .select(`
                *,
                barang (
                    id,
                    nama
                ),
                peminjam:users!peminjaman_peminjam_id_fkey (
                    id,
                    nama,
                    nim
                )
            `)

            .order(
                "tanggal_pinjam",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "ERROR PEMINJAMAN:",
                error
            );

        } else {

            (data || []).forEach(
                item => {

                    // -----------------------------------------
                    // Kalau jenis khusus peminjaman,
                    // hanya tampilkan data peminjaman.
                    //
                    // Kalau semua, pengembalian nanti
                    // ditambahkan terpisah.
                    // -----------------------------------------

                    semuaData.push({

                        tanggal:
                            item.tanggal_pinjam,

                        jenis:
                            "Peminjaman",

                        kode:
                            item.kode_peminjaman ||
                            item.id ||
                            "-",

                        barang:
                            item.barang?.nama ||
                            "-",

                        user:
                            item.peminjam?.nama ||
                            "-",

                        jumlah:
                            item.jumlah || 0,

                        keterangan:
                            `Status: ${item.status || "-"}`

                    });

                }
            );

        }

    }


    // =====================================================
    // PENGEMBALIAN
    // =====================================================

    if (
        jenis === "semua" ||
        jenis === "pengembalian"
    ) {

        const {
            data,
            error
        } = await supabaseClient

            .from("peminjaman")

            .select(`
                *,
                barang (
                    id,
                    nama
                ),
                peminjam:users!peminjaman_peminjam_id_fkey (
                    id,
                    nama,
                    nim
                )
            `)

            .eq(
                "status",
                "Dikembalikan"
            )

            .order(
                "tanggal_kembali",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "ERROR PENGEMBALIAN:",
                error
            );

        } else {

            (data || []).forEach(
                item => {

                    semuaData.push({

                        tanggal:
                            item.tanggal_kembali,

                        jenis:
                            "Pengembalian",

                        kode:
                            item.kode_peminjaman ||
                            item.id ||
                            "-",

                        barang:
                            item.barang?.nama ||
                            "-",

                        user:
                            item.peminjam?.nama ||
                            "-",

                        jumlah:
                            item.jumlah || 0,

                        keterangan:
                            `Kondisi: ${
                                item.kondisi_kembali ||
                                "-"
                            }${
                                item.catatan_kembali
                                    ? " | " +
                                      item.catatan_kembali
                                    : ""
                            }`

                    });

                }
            );

        }

    }


    // =====================================================
    // FILTER TANGGAL
    // =====================================================

    if (
        tanggalMulai ||
        tanggalAkhir
    ) {

        semuaData =
            semuaData.filter(
                item => {

                    if (!item.tanggal) {

                        return false;

                    }


                    const tanggal =
                        item.tanggal.substring(
                            0,
                            10
                        );


                    if (
                        tanggalMulai &&
                        tanggal < tanggalMulai
                    ) {

                        return false;

                    }


                    if (
                        tanggalAkhir &&
                        tanggal > tanggalAkhir
                    ) {

                        return false;

                    }


                    return true;

                }
            );

    }


    // =====================================================
    // SORT
    // =====================================================

    semuaData.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.tanggal || 0
                );

            const dateB =
                new Date(
                    b.tanggal || 0
                );


            return dateB - dateA;

        }
    );


    // =====================================================
    // SIMPAN GLOBAL
    // =====================================================

    laporanData =
        semuaData;


    // =====================================================
    // UPDATE PERIODE
    // =====================================================

    updatePeriode(
        tanggalMulai,
        tanggalAkhir
    );


    // =====================================================
    // SUMMARY
    // =====================================================

    renderSummary(
        semuaData
    );


    // =====================================================
    // TABLE
    // =====================================================

    renderTable(
        semuaData
    );

}


// =========================================================
// RENDER SUMMARY
// =========================================================

function renderSummary(data) {


    const container =
        document.getElementById(
            "summaryContainer"
        );


    if (!container) {

        return;

    }


    const totalMasuk =
        data
            .filter(
                item =>
                    item.jenis ===
                    "Barang Masuk"
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.jumlah || 0),
                0
            );


    const totalKeluar =
        data
            .filter(
                item =>
                    item.jenis ===
                    "Barang Keluar"
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.jumlah || 0),
                0
            );


    const totalPinjam =
        data
            .filter(
                item =>
                    item.jenis ===
                    "Peminjaman"
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.jumlah || 0),
                0
            );


    const totalKembali =
        data
            .filter(
                item =>
                    item.jenis ===
                    "Pengembalian"
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(item.jumlah || 0),
                0
            );


    container.innerHTML = `

        <!-- BARANG MASUK -->

        <div class="bg-white rounded-2xl shadow p-5">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-gray-500 text-sm">
                        Barang Masuk
                    </p>

                    <h3 class="text-2xl font-bold text-gray-800 mt-1">

                        ${totalMasuk}

                    </h3>

                    <p class="text-xs text-gray-400">
                        Unit
                    </p>

                </div>

                <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">

                    <i class="fas fa-arrow-down"></i>

                </div>

            </div>

        </div>


        <!-- BARANG KELUAR -->

        <div class="bg-white rounded-2xl shadow p-5">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-gray-500 text-sm">
                        Barang Keluar
                    </p>

                    <h3 class="text-2xl font-bold text-gray-800 mt-1">

                        ${totalKeluar}

                    </h3>

                    <p class="text-xs text-gray-400">
                        Unit
                    </p>

                </div>

                <div class="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">

                    <i class="fas fa-arrow-up"></i>

                </div>

            </div>

        </div>


        <!-- PEMINJAMAN -->

        <div class="bg-white rounded-2xl shadow p-5">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-gray-500 text-sm">
                        Peminjaman
                    </p>

                    <h3 class="text-2xl font-bold text-gray-800 mt-1">

                        ${totalPinjam}

                    </h3>

                    <p class="text-xs text-gray-400">
                        Unit
                    </p>

                </div>

                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">

                    <i class="fas fa-handshake"></i>

                </div>

            </div>

        </div>


        <!-- PENGEMBALIAN -->

        <div class="bg-white rounded-2xl shadow p-5">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-gray-500 text-sm">
                        Pengembalian
                    </p>

                    <h3 class="text-2xl font-bold text-gray-800 mt-1">

                        ${totalKembali}

                    </h3>

                    <p class="text-xs text-gray-400">
                        Unit
                    </p>

                </div>

                <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">

                    <i class="fas fa-rotate-left"></i>

                </div>

            </div>

        </div>

    `;

}


// =========================================================
// RENDER TABLE
// =========================================================

function renderTable(data) {


    const table =
        document.getElementById(
            "dataTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    // =====================================================
    // KOSONG
    // =====================================================

    if (!data.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-12 text-gray-500">

                    <i
                        class="fas fa-file-circle-xmark
                               text-gray-300
                               text-5xl
                               mb-4
                               block">
                    </i>

                    <h2
                        class="text-lg font-semibold text-gray-700">

                        Tidak ada laporan

                    </h2>

                    <p class="mt-2">

                        Tidak ditemukan aktivitas pada periode yang dipilih.

                    </p>

                </td>

            </tr>

        `;

        return;

    }


    // =====================================================
    // DATA
    // =====================================================

    data.forEach(
        (item, index) => {


            let badge = "";


            switch (
                item.jenis
            ) {

                case "Barang Masuk":

                    badge = `

                        <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                            BARANG MASUK

                        </span>

                    `;

                    break;


                case "Barang Keluar":

                    badge = `

                        <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">

                            BARANG KELUAR

                        </span>

                    `;

                    break;


                case "Peminjaman":

                    badge = `

                        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">

                            PEMINJAMAN

                        </span>

                    `;

                    break;


                case "Pengembalian":

                    badge = `

                        <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">

                            PENGEMBALIAN

                        </span>

                    `;

                    break;

            }


            table.innerHTML += `

                <tr class="table-row">


                    <!-- NO -->

                    <td class="px-6 py-4">

                        ${index + 1}

                    </td>


                    <!-- TANGGAL -->

                    <td class="px-6 py-4">

                        ${formatTanggal(
                            item.tanggal
                        )}

                    </td>


                    <!-- JENIS -->

                    <td class="px-6 py-4">

                        ${badge}

                    </td>


                    <!-- KODE -->

                    <td class="px-6 py-4">

                        ${item.kode || "-"}

                    </td>


                    <!-- BARANG -->

                    <td class="px-6 py-4 font-medium">

                        ${item.barang || "-"}

                    </td>


                    <!-- USER -->

                    <td class="px-6 py-4">

                        ${item.user || "-"}

                    </td>


                    <!-- JUMLAH -->

                    <td class="px-6 py-4 text-center">

                        ${item.jumlah ?? 0}

                    </td>


                    <!-- KETERANGAN -->

                    <td class="px-6 py-4">

                        ${item.keterangan || "-"}

                    </td>


                </tr>

            `;

        }
    );

}


// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggal(
    tanggal
) {


    if (!tanggal) {

        return "-";

    }


    const date =
        new Date(
            tanggal
        );


    return date.toLocaleDateString(
        "id-ID",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"

        }
    );

}


// =========================================================
// PERIODE
// =========================================================

function updatePeriode(
    mulai,
    akhir
) {


    const element =
        document.getElementById(
            "periodeLaporan"
        );


    if (!element) {

        return;

    }


    if (
        mulai &&
        akhir
    ) {

        element.textContent =
            `Periode ${formatTanggal(mulai)} - ${formatTanggal(akhir)}`;

        return;

    }


    if (mulai) {

        element.textContent =
            `Mulai ${formatTanggal(mulai)}`;

        return;

    }


    if (akhir) {

        element.textContent =
            `Sampai ${formatTanggal(akhir)}`;

        return;

    }


    element.textContent =
        "Semua periode";

}


// =========================================================
// SEARCH
// =========================================================

function searchTable() {


    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    const keyword =
        input.value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#dataTable tr"
        );


    rows.forEach(
        row => {


            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(
                    keyword
                )
                    ? ""
                    : "none";

        }
    );

}