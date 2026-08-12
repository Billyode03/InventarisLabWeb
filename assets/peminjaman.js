/* =========================================================
   PEMINJAMAN.JS

   ROLE:
   - ADMIN      : Lihat + Approval + Edit + Hapus
   - KAJUR      : Lihat
   - MAHASISWA  : Lihat
   ========================================================= */


// =========================================================
// ELEMENT
// =========================================================

const tbody = document.getElementById("dataTable");


// =========================================================
// USER LOGIN & ROLE
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


const currentUser = getCurrentUser();

const currentRole =
    String(currentUser?.role || "")
        .trim()
        .toLowerCase();


console.log("USER LOGIN :", currentUser);
console.log("ROLE LOGIN :", currentRole);


// =========================================================
// LOAD AWAL
// =========================================================

loadPeminjaman();
loadStatistik();


// =========================================================
// LOAD DATA PEMINJAMAN
// =========================================================

async function loadPeminjaman() {

    tbody.innerHTML = `
        <tr>
            <td colspan="12" class="py-16 text-center text-gray-500">

                <i class="fas fa-spinner fa-spin text-4xl mb-3"></i>

                <p>
                    Memuat data peminjaman...
                </p>

            </td>
        </tr>
    `;


    const {
        data,
        error
    } = await supabaseClient

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


    console.log(
        "DATA PEMINJAMAN:",
        data
    );

    console.log(
        "ERROR:",
        error
    );


    // =====================================================
    // ERROR
    // =====================================================

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


    // =====================================================
    // DATA KOSONG
    // =====================================================

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


    // =====================================================
    // RENDER
    // =====================================================

    tbody.innerHTML = "";


    data.forEach((item, index) => {


        // =================================================
        // STATUS BADGE
        // =================================================

        let statusBadge = "";


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


        // =================================================
        // TANGGAL
        // =================================================

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


        // =================================================
        // DATA RELASI
        // =================================================

        const namaBarang =
            item.barang?.nama || "-";


        const namaPeminjam =
            item.peminjam?.nama || "-";


        const nimPeminjam =
            item.peminjam?.nim || "-";


        const namaApprover =
            item.approver?.nama || "-";


        // =================================================
        // TOMBOL AKSI
        // =================================================

        let tombolAksi = "";


        // -------------------------------------------------
        // DETAIL → SEMUA ROLE
        // -------------------------------------------------

        tombolAksi += `

            <button
                onclick="detailPeminjaman(${item.id})"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       bg-amber-50 text-amber-500
                       hover:bg-amber-100 hover:text-amber-700
                       transition"
                title="Detail">

                <i class="fas fa-eye text-sm"></i>

            </button>

        `;


        // -------------------------------------------------
        // APPROVAL → ADMIN SAJA
        // -------------------------------------------------

        if (
            currentRole === "admin" &&
            item.status === "Menunggu"
        ) {

            tombolAksi += `

                <button
                    onclick="setujuiPeminjaman(${item.id})"
                    class="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-green-50 text-green-600
                           hover:bg-green-100 hover:text-green-700
                           transition"
                    title="Setujui Peminjaman">

                    <i class="fas fa-check text-sm"></i>

                </button>


                <button
                    onclick="tolakPeminjaman(${item.id})"
                    class="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-red-50 text-red-500
                           hover:bg-red-100 hover:text-red-700
                           transition"
                    title="Tolak Peminjaman">

                    <i class="fas fa-times text-sm"></i>

                </button>

            `;
        }


        // -------------------------------------------------
        // EDIT + HAPUS → ADMIN SAJA
        // -------------------------------------------------

        if (currentRole === "admin") {

            tombolAksi += `

                <button
                    onclick="editPeminjaman(${item.id})"
                    class="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-blue-50 text-blue-500
                           hover:bg-blue-100 hover:text-blue-700
                           transition"
                    title="Edit">

                    <i class="fas fa-edit text-sm"></i>

                </button>


                <button
                    onclick="hapusPeminjaman(${item.id})"
                    class="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-red-50 text-red-500
                           hover:bg-red-100 hover:text-red-700
                           transition"
                    title="Hapus">

                    <i class="fas fa-trash text-sm"></i>

                </button>

            `;
        }


        // =================================================
        // RENDER ROW
        // =================================================

        tbody.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="px-6 py-4">
                    ${index + 1}
                </td>


                <td class="px-6 py-4 font-medium">
                    ${item.kode_peminjaman || "-"}
                </td>


                <td class="px-6 py-4">
                    ${namaBarang}
                </td>


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


                <td class="px-6 py-4">
                    ${item.jumlah ?? 0}
                </td>


                <td class="px-6 py-4">
                    ${tanggalPinjam}
                </td>


                <td class="px-6 py-4">
                    ${batasKembali}
                </td>


                <td class="px-6 py-4">
                    ${tanggalKembali}
                </td>


                <td class="px-6 py-4">
                    ${statusBadge}
                </td>


                <td class="px-6 py-4">
                    ${item.keperluan || "-"}
                </td>


                <td class="px-6 py-4">
                    ${namaApprover}
                </td>


                <td class="px-6 py-4">

                    <div class="flex items-center justify-center gap-2">

                        ${tombolAksi}

                    </div>

                </td>

            </tr>

        `;

    });

}


// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggal(tanggal) {

    const date =
        new Date(tanggal);


    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// =========================================================
// APPROVAL - SETUJUI
// ADMIN SAJA
// =========================================================

async function setujuiPeminjaman(id) {

    // =====================================================
    // CEK ROLE
    // =====================================================

    if (currentRole !== "admin") {

        Swal.fire({

            icon: "error",

            title: "Akses Ditolak",

            text:
                "Hanya Admin yang dapat menyetujui peminjaman."

        });

        return;
    }


    const result =
        await Swal.fire({

            title:
                "Setujui Peminjaman?",

            text:
                "Peminjaman akan disetujui dan stok barang akan dikurangi.",

            icon:
                "question",

            showCancelButton:
                true,

            confirmButtonColor:
                "#16a34a",

            cancelButtonColor:
                "#6b7280",

            confirmButtonText:
                "Ya, Setujui",

            cancelButtonText:
                "Batal"

        });


    if (!result.isConfirmed) {
        return;
    }


    const user =
        getCurrentUser();


    if (
        !user ||
        !user.id
    ) {

        Swal.fire({

            icon: "error",

            title: "User Tidak Ditemukan",

            text:
                "Data user yang sedang login tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // AMBIL PEMINJAMAN
    // =====================================================

    const {
        data: peminjaman,
        error: peminjamanError
    } = await supabaseClient

        .from("peminjaman")

        .select("*")

        .eq("id", id)

        .single();


    if (
        peminjamanError ||
        !peminjaman
    ) {

        console.error(
            peminjamanError
        );

        Swal.fire({

            icon: "error",

            title: "Gagal",

            text:
                "Data peminjaman tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // CEK STATUS
    // =====================================================

    if (
        peminjaman.status !== "Menunggu"
    ) {

        Swal.fire({

            icon: "warning",

            title: "Tidak Dapat Diproses",

            text:
                "Peminjaman ini sudah diproses sebelumnya."

        });

        return;
    }


    // =====================================================
    // AMBIL BARANG
    // =====================================================

    const {
        data: barang,
        error: barangError
    } = await supabaseClient

        .from("barang")

        .select("*")

        .eq(
            "id",
            peminjaman.barang_id
        )

        .single();


    if (
        barangError ||
        !barang
    ) {

        console.error(
            barangError
        );

        Swal.fire({

            icon: "error",

            title: "Barang Tidak Ditemukan",

            text:
                "Data barang tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // CEK STOK
    // =====================================================

    if (
        Number(barang.jumlah) <
        Number(peminjaman.jumlah)
    ) {

        Swal.fire({

            icon: "warning",

            title: "Stok Tidak Cukup",

            text:
                `Stok tersedia hanya ${barang.jumlah}, sedangkan jumlah yang dipinjam ${peminjaman.jumlah}.`

        });

        return;
    }


    // =====================================================
    // KURANGI STOK
    // =====================================================

    const stokLama =
        Number(barang.jumlah);


    const stokBaru =
        stokLama -
        Number(peminjaman.jumlah);


    const {
        error: stokError
    } = await supabaseClient

        .from("barang")

        .update({

            jumlah:
                stokBaru

        })

        .eq(
            "id",
            peminjaman.barang_id
        );


    if (stokError) {

        console.error(
            stokError
        );

        Swal.fire({

            icon: "error",

            title: "Gagal",

            text:
                "Stok barang gagal diperbarui."

        });

        return;
    }


    // =====================================================
    // UPDATE PEMINJAMAN
    // =====================================================

    const {
        error: updateError
    } = await supabaseClient

        .from("peminjaman")

        .update({

            status:
                "Disetujui",

            approver_id:
                user.id

        })

        .eq(
            "id",
            id
        );


    // =====================================================
    // ROLLBACK STOK
    // =====================================================

    if (updateError) {

        console.error(
            updateError
        );


        await supabaseClient

            .from("barang")

            .update({

                jumlah:
                    stokLama

            })

            .eq(
                "id",
                peminjaman.barang_id
            );


        Swal.fire({

            icon: "error",

            title: "Gagal",

            text:
                "Approval gagal. Perubahan stok dibatalkan."

        });

        return;
    }


    // =====================================================
    // BERHASIL
    // =====================================================

    await Swal.fire({

        icon: "success",

        title:
            "Peminjaman Disetujui",

        text:
            "Peminjaman berhasil disetujui dan stok telah diperbarui.",

        timer:
            1800,

        showConfirmButton:
            false

    });


    loadPeminjaman();

    loadStatistik();
}


// =========================================================
// APPROVAL - TOLAK
// ADMIN SAJA
// =========================================================

async function tolakPeminjaman(id) {

    // =====================================================
    // CEK ROLE
    // =====================================================

    if (currentRole !== "admin") {

        Swal.fire({

            icon: "error",

            title: "Akses Ditolak",

            text:
                "Hanya Admin yang dapat menolak peminjaman."

        });

        return;
    }


    const result =
        await Swal.fire({

            title:
                "Tolak Peminjaman?",

            input:
                "textarea",

            inputLabel:
                "Alasan Penolakan",

            inputPlaceholder:
                "Masukkan alasan penolakan...",

            inputAttributes: {

                "aria-label":
                    "Masukkan alasan penolakan"

            },

            showCancelButton:
                true,

            confirmButtonColor:
                "#dc2626",

            cancelButtonColor:
                "#6b7280",

            confirmButtonText:
                "Tolak Peminjaman",

            cancelButtonText:
                "Batal",

            inputValidator:
                (value) => {

                    if (
                        !value ||
                        !value.trim()
                    ) {

                        return "Alasan penolakan wajib diisi.";

                    }

                }

        });


    if (
        !result.isConfirmed
    ) {

        return;
    }


    const user =
        getCurrentUser();


    if (
        !user ||
        !user.id
    ) {

        Swal.fire({

            icon: "error",

            title: "User Tidak Ditemukan",

            text:
                "Data user yang sedang login tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const {
        error
    } = await supabaseClient

        .from("peminjaman")

        .update({

            status:
                "Ditolak",

            approver_id:
                user.id,

            catatan_admin:
                result.value.trim()

        })

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                error.message

        });

        return;
    }


    await Swal.fire({

        icon:
            "success",

        title:
            "Peminjaman Ditolak",

        text:
            "Pengajuan peminjaman telah ditolak.",

        timer:
            1800,

        showConfirmButton:
            false

    });


    loadPeminjaman();

    loadStatistik();
}


// =========================================================
// STATISTIK
// =========================================================

async function loadStatistik() {

    const {
        data,
        error
    } = await supabaseClient

        .from("peminjaman")

        .select(
            "status, batas_kembali"
        );


    if (error) {

        console.error(
            "Gagal mengambil statistik:",
            error
        );

        return;
    }


    const total =
        data.length;


    const sedangDipinjam =
        data.filter(
            item =>
                item.status === "Dipinjam" ||
                item.status === "Disetujui"
        ).length;


    const pending =
        data.filter(
            item =>
                item.status === "Menunggu"
        ).length;


    const sekarang =
        new Date();


    const terlambat =
        data.filter(
            item => {

                if (
                    !item.batas_kembali
                ) {

                    return false;
                }


                if (
                    item.status === "Dikembalikan" ||
                    item.status === "Ditolak"
                ) {

                    return false;
                }


                return (
                    new Date(
                        item.batas_kembali
                    ) < sekarang
                );

            }
        ).length;


    // =====================================================
    // UPDATE CARD
    // =====================================================

    const cards =
        document.querySelectorAll(
            ".grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-4 h3"
        );


    if (
        cards.length >= 4
    ) {

        cards[0].textContent =
            total;

        cards[1].textContent =
            sedangDipinjam;

        cards[2].textContent =
            pending;

        cards[3].textContent =
            terlambat;

    }


    // =====================================================
    // CHART
    // =====================================================

    updateChart(
        total,
        sedangDipinjam,
        pending,
        terlambat
    );
}


// =========================================================
// CHART
// =========================================================

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


    if (
        borrowingChart
    ) {

        borrowingChart.destroy();

    }


    borrowingChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",

                data: {

                    labels: [

                        "Total Peminjaman",
                        "Sedang Dipinjam",
                        "Pending",
                        "Terlambat"

                    ],

                    datasets: [{

                        label:
                            "Jumlah",

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

                        borderWidth:
                            0,

                        borderRadius:
                            6

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                stepSize:
                                    1

                            }

                        }

                    }

                }

            }
        );
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
        tbody.querySelectorAll(
            "tr"
        );


    rows.forEach(
        row => {

            row.style.display =
                row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

        }
    );
}


// =========================================================
// DETAIL
// SEMUA ROLE
// =========================================================

function detailPeminjaman(id) {

    window.location.href =
        `detail_peminjaman.html?id=${id}`;
}


// =========================================================
// EDIT
// ADMIN SAJA
// =========================================================

function editPeminjaman(id) {

    if (
        currentRole !== "admin"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Akses Ditolak",

            text:
                "Hanya Admin yang dapat mengedit peminjaman."

        });

        return;
    }


    window.location.href =
        `edit_peminjaman.html?id=${id}`;
}


// =========================================================
// HAPUS
// ADMIN SAJA
// =========================================================

async function hapusPeminjaman(id) {

    if (
        currentRole !== "admin"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Akses Ditolak",

            text:
                "Hanya Admin yang dapat menghapus peminjaman."

        });

        return;
    }


    const result =
        await Swal.fire({

            title:
                "Hapus Peminjaman?",

            text:
                "Data yang dihapus tidak dapat dikembalikan.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonColor:
                "#dc2626",

            cancelButtonColor:
                "#6b7280",

            confirmButtonText:
                "Ya, Hapus",

            cancelButtonText:
                "Batal"

        });


    if (
        !result.isConfirmed
    ) {

        return;
    }


    const {
        error
    } = await supabaseClient

        .from("peminjaman")

        .delete()

        .eq(
            "id",
            id
        );


    if (error) {

        console.error(error);

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                "Data peminjaman gagal dihapus."

        });

        return;
    }


    await Swal.fire({

        icon:
            "success",

        title:
            "Berhasil",

        text:
            "Data peminjaman berhasil dihapus.",

        timer:
            1500,

        showConfirmButton:
            false

    });


    loadPeminjaman();

    loadStatistik();
}