// ==============================
// PEMINJAMAN.JS
// ==============================

const tbody = document.getElementById("dataTable");

// Jalankan saat halaman dibuka
loadPeminjaman();
loadStatistik();


// ==============================
// LOAD DATA PEMINJAMAN
// ==============================

async function loadPeminjaman() {

    tbody.innerHTML = `
        <tr>
            <td colspan="12" class="py-16 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-4xl mb-3"></i>
                <p>Memuat data peminjaman...</p>
            </td>
        </tr>
    `;


    const { data, error } = await supabaseClient

        .from("peminjaman")

        .select(`
            *,
            barang (
                nama
            ),
            peminjam:users!peminjam_id (
                nama,
                nim
            ),
            approver:users!approver_id (
                nama,
                nim
            )
        `)

        .order("created_at", {
            ascending: false
        });


    console.log("DATA PEMINJAMAN:", data);
    console.log("ERROR:", error);


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="12">

                    <div class="flex flex-col items-center py-16">

                        <i class="fas fa-triangle-exclamation text-red-500 text-6xl mb-5"></i>

                        <h2 class="text-xl font-semibold mb-2">
                            Gagal mengambil data
                        </h2>

                        <p class="text-gray-500 mb-5">
                            ${error.message}
                        </p>

                        <button
                            onclick="loadPeminjaman()"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
                            Coba Lagi
                        </button>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    // ==============================
    // DATA KOSONG
    // ==============================

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="12">

                    <div class="flex flex-col items-center py-20">

                        <i class="fas fa-handshake text-gray-300 text-7xl mb-5"></i>

                        <h2 class="text-xl font-semibold text-gray-700">
                            Belum ada peminjaman
                        </h2>

                        <p class="text-gray-500 mt-2">
                            Data peminjaman akan muncul di sini.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    // ==============================
    // RENDER DATA
    // ==============================

    tbody.innerHTML = "";


    data.forEach((item, index) => {

        let statusBadge = "";


        // ==========================
        // STATUS
        // ==========================

        switch (item.status) {

            case "Menunggu":
                statusBadge = `
                    <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                        MENUNGGU
                    </span>
                `;
                break;


            case "Disetujui":
                statusBadge = `
                    <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        DISETUJUI
                    </span>
                `;
                break;


            case "Ditolak":
                statusBadge = `
                    <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        DITOLAK
                    </span>
                `;
                break;


            case "Dipinjam":
                statusBadge = `
                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        DIPINJAM
                    </span>
                `;
                break;


            case "Dikembalikan":
                statusBadge = `
                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        DIKEMBALIKAN
                    </span>
                `;
                break;


            default:
                statusBadge = `
                    <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        ${item.status || "-"}
                    </span>
                `;
        }


        // ==========================
        // FORMAT TANGGAL
        // ==========================

        const tanggalPinjam =
            item.tanggal_pinjam
                ? formatTanggal(item.tanggal_pinjam)
                : "-";


        const batasKembali =
            item.batas_kembali
                ? formatTanggal(item.batas_kembali)
                : "-";


        const tanggalKembali =
            item.tanggal_kembali
                ? formatTanggal(item.tanggal_kembali)
                : "-";


        // ==========================
        // NAMA BARANG
        // ==========================

        const namaBarang =
            item.barang?.nama || "-";


        // ==========================
        // NAMA PEMINJAM
        // ==========================

        const namaPeminjam =
            item.peminjam?.nama || "-";


        const nimPeminjam =
            item.peminjam?.nim || "-";


        // ==========================
        // APPROVER
        // ==========================

        const namaApprover =
            item.approver?.nama || "-";


        // ==========================
        // RENDER
        // ==========================

        tbody.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <!-- NO -->
                <td class="px-6 py-4">
                    ${index + 1}
                </td>


                <!-- KODE -->
                <td class="px-6 py-4 font-medium">
                    ${item.kode_peminjaman || "-"}
                </td>


                <!-- BARANG -->
                <td class="px-6 py-4">
                    ${namaBarang}
                </td>


                <!-- PEMINJAM -->
                <td class="px-6 py-4">

                    <div>
                        <p class="font-medium">
                            ${namaPeminjam}
                        </p>

                        <p class="text-xs text-gray-500">
                            ${nimPeminjam}
                        </p>
                    </div>

                </td>


                <!-- JUMLAH -->
                <td class="px-6 py-4">
                    ${item.jumlah}
                </td>


                <!-- TANGGAL PINJAM -->
                <td class="px-6 py-4">
                    ${tanggalPinjam}
                </td>


                <!-- BATAS KEMBALI -->
                <td class="px-6 py-4">
                    ${batasKembali}
                </td>


                <!-- TANGGAL KEMBALI -->
                <td class="px-6 py-4">
                    ${tanggalKembali}
                </td>


                <!-- STATUS -->
                <td class="px-6 py-4">
                    ${statusBadge}
                </td>


                <!-- KEPERLUAN -->
                <td class="px-6 py-4">
                    ${item.keperluan || "-"}
                </td>


                <!-- APPROVER -->
                <td class="px-6 py-4">
                    ${namaApprover}
                </td>


                <!-- AKSI -->
                <td class="px-6 py-4">

                    <div class="flex justify-center gap-2">

                        <button
                            onclick="detailPeminjaman(${item.id})"
                            class="text-amber-500 hover:text-amber-700"
                            title="Detail">

                            <i class="fas fa-eye"></i>

                        </button>


                        <button
                            onclick="editPeminjaman(${item.id})"
                            class="text-blue-500 hover:text-blue-700"
                            title="Edit">

                            <i class="fas fa-edit"></i>

                        </button>


                        <button
                            onclick="hapusPeminjaman(${item.id})"
                            class="text-red-500 hover:text-red-700"
                            title="Hapus">

                            <i class="fas fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// ==============================
// FORMAT TANGGAL
// ==============================

function formatTanggal(tanggal) {

    const date = new Date(tanggal);

    return date.toLocaleDateString("id-ID", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric"

    });

}


// ==============================
// STATISTIK
// ==============================

async function loadStatistik() {

    const { data, error } = await supabaseClient

        .from("peminjaman")

        .select("status, batas_kembali");


    if (error) {

        console.error("Gagal mengambil statistik:", error);

        return;
    }


    const total =
        data.length;


    const sedangDipinjam =
        data.filter(item =>
            item.status === "Dipinjam"
        ).length;


    const pending =
        data.filter(item =>
            item.status === "Menunggu"
        ).length;


    // ==========================
    // TERLAMBAT
    // ==========================

    const sekarang = new Date();

    const terlambat =
        data.filter(item => {

            if (!item.batas_kembali) {
                return false;
            }

            if (
                item.status === "Dikembalikan" ||
                item.status === "Ditolak"
            ) {
                return false;
            }

            return new Date(item.batas_kembali) < sekarang;

        }).length;


    // ==========================
    // UPDATE CARD
    // ==========================

    const cards =
        document.querySelectorAll(
            ".grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 h3"
        );


    if (cards.length >= 4) {

        cards[0].textContent = total;

        cards[1].textContent = sedangDipinjam;

        cards[2].textContent = pending;

        cards[3].textContent = terlambat;

    }


    // ==========================
    // UPDATE LEGEND
    // ==========================

    const legendNumbers =
        document.querySelectorAll(
            ".bg-green-50 p.font-semibold, .bg-yellow-50 p.font-semibold, .bg-red-50 p.font-semibold"
        );


    if (legendNumbers.length >= 3) {

        legendNumbers[0].textContent =
            sedangDipinjam;

        legendNumbers[1].textContent =
            pending;

        legendNumbers[2].textContent =
            terlambat;

    }


    // ==========================
    // UPDATE CHART
    // ==========================

    updateChart(
        total,
        sedangDipinjam,
        pending,
        terlambat
    );

}


// ==============================
// CHART
// ==============================

let borrowingChart = null;


function updateChart(
    total,
    sedangDipinjam,
    pending,
    terlambat
) {

    const canvas =
        document.getElementById(
            "borrowingChart"
        );


    if (!canvas) {
        return;
    }


    if (borrowingChart) {

        borrowingChart.destroy();

    }


    borrowingChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [

                    "Total Peminjaman",
                    "Sedang Dipinjam",
                    "Pending Return",
                    "Terlambat"

                ],

                datasets: [{

                    label: "Jumlah",

                    data: [

                        total,
                        sedangDipinjam,
                        pending,
                        terlambat

                    ],

                    backgroundColor: [

                        "#3B82F6",
                        "#22C55E",
                        "#F59E0B",
                        "#EF4444"

                    ],

                    borderWidth: 0,

                    borderRadius: 6

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            stepSize: 1

                        }

                    }

                }

            }

        });

}


// ==============================
// SEARCH
// ==============================

function searchTable() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const rows =
        tbody.querySelectorAll("tr");


    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

}


// ==============================
// DETAIL
// ==============================

function detailPeminjaman(id) {

    window.location.href =
        `detail_peminjaman.html?id=${id}`;

}


// ==============================
// EDIT
// ==============================

function editPeminjaman(id) {

    window.location.href =
        `edit_peminjaman.html?id=${id}`;

}


// ==============================
// HAPUS
// ==============================

async function hapusPeminjaman(id) {

    const result =
        await Swal.fire({

            title: "Hapus Peminjaman?",

            text:
                "Data yang dihapus tidak dapat dikembalikan.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Ya, Hapus",

            cancelButtonText: "Batal"

        });


    if (!result.isConfirmed) {
        return;
    }


    const { error } =
        await supabaseClient

            .from("peminjaman")

            .delete()

            .eq("id", id);


    if (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Gagal",

            text:
                "Data peminjaman gagal dihapus."

        });

        return;

    }


    await Swal.fire({

        icon: "success",

        title: "Berhasil",

        text:
            "Data peminjaman berhasil dihapus.",

        timer: 1500,

        showConfirmButton: false

    });


    loadPeminjaman();

    loadStatistik();

}