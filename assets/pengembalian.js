// =========================================================
// PENGEMBALIAN.JS
// PENGELOLAAN PENGEMBALIAN BARANG
//
// FLOW:
//
// PEMINJAMAN DISETUJUI ADMIN
//          ↓
//      status = Dipinjam
//          ↓
// MAHASISWA AJUKAN PENGEMBALIAN
//          ↓
// status = Menunggu Pengembalian
//          ↓
// ADMIN KONFIRMASI
//          ↓
// status = Dikembalikan
//          ↓
// STOK BARANG + JUMLAH
//
// ROLE:
//
// ADMIN
// - Lihat semua
// - Konfirmasi pengembalian
//
// KAJUR
// - Lihat semua
//
// MAHASISWA
// - Lihat peminjaman sendiri
// - Ajukan pengembalian
// =========================================================


// =========================================================
// USER / ROLE
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


// =========================================================
// USER LOGIN
// =========================================================

const currentUser =
    getCurrentUser();


// =========================================================
// ROLE LOGIN
// =========================================================

const currentRole =
    String(
        currentUser?.role || ""
    )
    .trim()
    .toLowerCase();


console.log(
    "USER LOGIN :",
    currentUser
);

console.log(
    "ROLE LOGIN :",
    currentRole
);


// =========================================================
// LOAD AWAL
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPengembalian();

    }
);


// =========================================================
// LOAD DATA PENGEMBALIAN
// =========================================================

async function loadPengembalian() {


    const table =
        document.getElementById(
            "dataTable"
        );


    if (!table) {

        console.error(
            "Element #dataTable tidak ditemukan."
        );

        return;
    }


    // =====================================================
    // LOADING
    // =====================================================

    table.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="text-center py-10 text-gray-500">

                <i
                    class="fas fa-spinner fa-spin text-3xl mb-3">
                </i>

                <p>
                    Memuat data pengembalian...
                </p>

            </td>

        </tr>

    `;


    // =====================================================
    // QUERY
    // =====================================================

    let query =
        supabaseClient

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

            .in(
                "status",
                [
                    "Dipinjam",
                    "Menunggu Pengembalian"
                ]
            )

            .order(
                "batas_kembali",
                {
                    ascending: true
                }
            );


    // =====================================================
    // FILTER MAHASISWA
    // =====================================================

    if (
        currentRole === "mahasiswa"
    ) {

        if (
            !currentUser ||
            !currentUser.id
        ) {

            console.error(
                "USER MAHASISWA TIDAK DITEMUKAN"
            );

            table.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="text-center py-10 text-red-500">

                        User login tidak ditemukan.

                    </td>

                </tr>

            `;

            return;
        }


        console.log(
            "FILTER PENGEMBALIAN MAHASISWA:",
            currentUser.id
        );


        query =
            query.eq(
                "peminjam_id",
                currentUser.id
            );

    }


    // =====================================================
    // EKSEKUSI QUERY
    // =====================================================

    const {

        data,
        error

    } = await query;


    console.log(
        "DATA PENGEMBALIAN:",
        data
    );

    console.log(
        "ERROR PENGEMBALIAN:",
        error
    );


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        console.error(
            "Gagal mengambil data:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center py-10">

                    <div
                        class="flex flex-col items-center">

                        <i
                            class="fas fa-triangle-exclamation
                                   text-red-500
                                   text-5xl
                                   mb-4">
                        </i>

                        <h2
                            class="text-lg
                                   font-semibold
                                   text-gray-700
                                   mb-2">

                            Gagal mengambil data

                        </h2>

                        <p class="text-gray-500 mb-4">

                            ${error.message}

                        </p>

                        <button
                            onclick="loadPengembalian()"
                            class="bg-blue-600
                                   hover:bg-blue-700
                                   text-white
                                   px-5
                                   py-2
                                   rounded-lg">

                            Coba Lagi

                        </button>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    // =====================================================
    // RENDER
    // =====================================================

    renderTable(
        data || []
    );

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
    // DATA KOSONG
    // =====================================================

    if (!data.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center py-12 text-gray-500">

                    <i
                        class="fas fa-box-open
                               text-gray-300
                               text-5xl
                               mb-4
                               block">
                    </i>

                    <h2
                        class="text-lg
                               font-semibold
                               text-gray-700">

                        Tidak ada data pengembalian.

                    </h2>

                    <p class="mt-2">

                        Belum ada barang yang perlu dikembalikan.

                    </p>

                </td>

            </tr>

        `;

        return;
    }


    // =====================================================
    // RENDER DATA
    // =====================================================

    data.forEach(
        (item, index) => {


            const barang =
                item.barang || {};


            const peminjam =
                item.peminjam || {};


            // =================================================
            // STATUS BADGE
            // =================================================

            const statusBadge =
                getStatusBadge(
                    item
                );


            // =================================================
            // TOMBOL AKSI
            // =================================================

            let tombolAksi = "";


            // =================================================
            // MAHASISWA
            // =================================================

            if (
                currentRole === "mahasiswa"
            ) {


                // ---------------------------------------------
                // BISA AJUKAN
                // ---------------------------------------------

                if (
                    item.status === "Dipinjam"
                ) {

                    tombolAksi = `

                        <button
                            onclick="ajukanPengembalian('${item.id}')"
                            class="bg-green-600
                                   hover:bg-green-700
                                   text-white
                                   px-4
                                   py-2
                                   rounded-lg
                                   text-sm
                                   transition">

                            <i
                                class="fas fa-rotate-left mr-1">
                            </i>

                            AJUKAN PENGEMBALIAN

                        </button>

                    `;

                }


                // ---------------------------------------------
                // SUDAH DIAJUKAN
                // ---------------------------------------------

                else if (
                    item.status ===
                    "Menunggu Pengembalian"
                ) {

                    tombolAksi = `

                        <span
                            class="text-yellow-600
                                   text-sm
                                   font-medium">

                            <i
                                class="fas fa-clock mr-1">
                            </i>

                            Menunggu Admin

                        </span>

                    `;

                }

            }


            // =================================================
            // ADMIN
            // =================================================

            else if (
                currentRole === "admin"
            ) {


                // ---------------------------------------------
                // ADA PENGAJUAN
                // ---------------------------------------------

                if (
                    item.status ===
                    "Menunggu Pengembalian"
                ) {

                    tombolAksi = `

                        <button
                            onclick="prosesPengembalian('${item.id}')"
                            class="bg-green-600
                                   hover:bg-green-700
                                   text-white
                                   px-4
                                   py-2
                                   rounded-lg
                                   text-sm
                                   transition">

                            <i
                                class="fas fa-check mr-1">
                            </i>

                            KONFIRMASI

                        </button>

                    `;

                }


                // ---------------------------------------------
                // BELUM DIAJUKAN
                // ---------------------------------------------

                else {

                    tombolAksi = `

                        <span
                            class="text-gray-400
                                   text-sm">

                            Menunggu Pengajuan

                        </span>

                    `;

                }

            }


            // =================================================
            // KAJUR
            // =================================================

            else {

                tombolAksi = `

                    <span
                        class="text-gray-400
                               text-sm">

                        Hanya Melihat

                    </span>

                `;

            }


            // =================================================
            // RENDER ROW
            // =================================================

            table.innerHTML += `

                <tr
                    class="border-b
                           hover:bg-gray-50
                           transition">


                    <!-- NO -->

                    <td
                        class="px-6 py-4 text-center">

                        ${index + 1}

                    </td>


                    <!-- KODE -->

                    <td
                        class="px-6 py-4">

                        ${item.kode_peminjaman || "-"}

                    </td>


                    <!-- BARANG -->

                    <td
                        class="px-6 py-4 font-medium">

                        ${barang.nama || "-"}

                    </td>


                    <!-- PEMINJAM -->

                    <td
                        class="px-6 py-4">

                        <div>

                            <p class="font-medium">

                                ${peminjam.nama || "-"}

                            </p>

                            <p
                                class="text-xs
                                       text-gray-400">

                                ${peminjam.nim || "-"}

                            </p>

                        </div>

                    </td>


                    <!-- JUMLAH -->

                    <td
                        class="px-6 py-4 text-center">

                        ${item.jumlah ?? 0}

                    </td>


                    <!-- TANGGAL PINJAM -->

                    <td
                        class="px-6 py-4">

                        ${formatTanggal(
                            item.tanggal_pinjam
                        )}

                    </td>


                    <!-- BATAS KEMBALI -->

                    <td
                        class="px-6 py-4">

                        ${formatTanggal(
                            item.batas_kembali
                        )}

                    </td>


                    <!-- STATUS -->

                    <td
                        class="px-6 py-4">

                        ${statusBadge}

                    </td>


                    <!-- OPSI -->

                    <td
                        class="px-6 py-4 text-center">

                        ${tombolAksi}

                    </td>


                </tr>

            `;

        }
    );

}


// =========================================================
// STATUS BADGE
// =========================================================

function getStatusBadge(item) {


    // =====================================================
    // MENUNGGU PENGEMBALIAN
    // =====================================================

    if (
        item.status ===
        "Menunggu Pengembalian"
    ) {

        return `

            <span
                class="bg-yellow-100
                       text-yellow-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold">

                MENUNGGU PENGEMBALIAN

            </span>

        `;

    }


    // =====================================================
    // TERLAMBAT
    // =====================================================

    const batas =
        item.batas_kembali
            ? new Date(
                item.batas_kembali
            )
            : null;


    const sekarang =
        new Date();


    if (
        batas &&
        sekarang > batas
    ) {

        return `

            <span
                class="bg-red-100
                       text-red-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold">

                TERLAMBAT

            </span>

        `;

    }


    // =====================================================
    // DIPINJAM
    // =====================================================

    return `

        <span
            class="bg-blue-100
                   text-blue-700
                   px-3
                   py-1
                   rounded-full
                   text-xs
                   font-semibold">

            DIPINJAM

        </span>

    `;

}


// =========================================================
// MAHASISWA
// AJUKAN PENGEMBALIAN
// =========================================================

async function ajukanPengembalian(id) {


    // =====================================================
    // CEK ROLE
    // =====================================================

    if (
        currentRole !== "mahasiswa"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Akses Ditolak",

            text:
                "Hanya mahasiswa yang dapat mengajukan pengembalian."

        });

        return;
    }


    // =====================================================
    // CEK USER
    // =====================================================

    if (
        !currentUser ||
        !currentUser.id
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "User Tidak Ditemukan",

            text:
                "Data user yang sedang login tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // AMBIL DATA PEMINJAMAN
    // =====================================================

    const {

        data: peminjaman,

        error

    } = await supabaseClient

        .from("peminjaman")

        .select(`
            *,
            barang (
                id,
                nama
            )
        `)

        .eq(
            "id",
            id
        )

        .eq(
            "peminjam_id",
            currentUser.id
        )

        .single();


    // =====================================================
    // ERROR
    // =====================================================

    if (
        error ||
        !peminjaman
    ) {

        console.error(
            error
        );

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                "Data peminjaman tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // CEK STATUS
    // =====================================================

    if (
        peminjaman.status !==
        "Dipinjam"
    ) {

        Swal.fire({

            icon:
                "warning",

            title:
                "Tidak Dapat Diproses",

            text:
                "Peminjaman ini sudah diajukan atau sudah dikembalikan."

        });

        return;
    }


    // =====================================================
    // KONFIRMASI
    // =====================================================

    const result =
        await Swal.fire({

            icon:
                "question",

            title:
                "Ajukan Pengembalian?",

            html: `

                <div class="text-left">

                    <p class="mb-2">

                        <strong>Barang:</strong>
                        ${peminjaman.barang?.nama || "-"}

                    </p>

                    <p class="mb-2">

                        <strong>Jumlah:</strong>
                        ${peminjaman.jumlah || 0}

                    </p>

                    <p>

                        Setelah diajukan,
                        pengembalian akan menunggu
                        konfirmasi Admin.

                    </p>

                </div>

            `,

            showCancelButton:
                true,

            confirmButtonColor:
                "#16a34a",

            cancelButtonColor:
                "#6b7280",

            confirmButtonText:
                "Ya, Ajukan",

            cancelButtonText:
                "Batal"

        });


    if (
        !result.isConfirmed
    ) {

        return;
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const {

        error: updateError

    } = await supabaseClient

        .from("peminjaman")

        .update({

            status:
                "Menunggu Pengembalian"

        })

        .eq(
            "id",
            id
        )

        .eq(
            "peminjam_id",
            currentUser.id
        );


    // =====================================================
    // ERROR UPDATE
    // =====================================================

    if (
        updateError
    ) {

        console.error(
            updateError
        );

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                updateError.message

        });

        return;
    }


    // =====================================================
    // AUDIT
    // =====================================================

    const {

        error: auditError

    } = await supabaseClient

        .from("audit_inventori")

        .insert({

            barang_id:
                peminjaman.barang_id,

            user_id:
                currentUser.id,

            aktivitas:
                "PENGEMBALIAN_DIAJUKAN",

            deskripsi:
                `Peminjaman ${peminjaman.kode_peminjaman} diajukan untuk pengembalian oleh ${currentUser.nama}.`

        });


    if (
        auditError
    ) {

        console.error(
            "ERROR AUDIT PENGEMBALIAN:",
            auditError
        );

    }


    // =====================================================
    // SUCCESS
    // =====================================================

    await Swal.fire({

        icon:
            "success",

        title:
            "Pengembalian Diajukan",

        text:
            "Pengajuan pengembalian berhasil dikirim ke Admin.",

        timer:
            1800,

        showConfirmButton:
            false

    });


    // =====================================================
    // RELOAD
    // =====================================================

    loadPengembalian();

}


// =========================================================
// ADMIN
// KONFIRMASI PENGEMBALIAN
// =========================================================

async function prosesPengembalian(id) {


    // =====================================================
    // CEK ROLE
    // =====================================================

    if (
        currentRole !== "admin"
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "Akses Ditolak",

            text:
                "Hanya Admin yang dapat memproses pengembalian."

        });

        return;
    }


    // =====================================================
    // CEK USER
    // =====================================================

    if (
        !currentUser ||
        !currentUser.id
    ) {

        Swal.fire({

            icon:
                "error",

            title:
                "User Tidak Ditemukan",

            text:
                "Data Admin yang sedang login tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // AMBIL DATA PEMINJAMAN
    // =====================================================

    const {

        data: peminjaman,

        error: errorPinjam

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
            "id",
            id
        )

        .single();


    // =====================================================
    // ERROR
    // =====================================================

    if (
        errorPinjam ||
        !peminjaman
    ) {

        console.error(
            errorPinjam
        );

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                "Data peminjaman tidak ditemukan."

        });

        return;
    }


    // =====================================================
    // CEK STATUS
    // =====================================================

    if (
        peminjaman.status !==
        "Menunggu Pengembalian"
    ) {

        Swal.fire({

            icon:
                "warning",

            title:
                "Tidak Dapat Diproses",

            text:
                "Peminjaman ini belum mengajukan pengembalian atau sudah diproses."

        });

        return;
    }


    // =====================================================
    // FORM KONFIRMASI
    // =====================================================

    const result =
        await Swal.fire({

            title:
                "Konfirmasi Pengembalian",

            width:
                "600px",

            html: `

                <div
                    class="text-left
                           space-y-4">


                    <!-- BARANG -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Barang

                        </label>

                        <div
                            class="bg-gray-100
                                   rounded-lg
                                   px-4
                                   py-3">

                            ${peminjaman.barang?.nama || "-"}

                        </div>

                    </div>


                    <!-- PEMINJAM -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Peminjam

                        </label>

                        <div
                            class="bg-gray-100
                                   rounded-lg
                                   px-4
                                   py-3">

                            ${peminjaman.peminjam?.nama || "-"}

                            <span
                                class="text-gray-500
                                       text-sm">

                                (${peminjaman.peminjam?.nim || "-"})

                            </span>

                        </div>

                    </div>


                    <!-- JUMLAH -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Jumlah Dikembalikan

                        </label>

                        <div
                            class="bg-gray-100
                                   rounded-lg
                                   px-4
                                   py-3">

                            ${peminjaman.jumlah || 0}

                        </div>

                    </div>


                    <!-- TANGGAL KEMBALI -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Tanggal Kembali

                        </label>

                        <input
                            type="date"
                            id="tanggalKembali"
                            value="${
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                            }"
                            class="w-full
                                   border
                                   border-gray-300
                                   rounded-lg
                                   px-4
                                   py-2
                                   focus:outline-none
                                   focus:border-blue-500">

                    </div>


                    <!-- KONDISI -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Kondisi Barang

                        </label>

                        <select
                            id="kondisiBarang"
                            class="w-full
                                   border
                                   border-gray-300
                                   rounded-lg
                                   px-4
                                   py-2
                                   focus:outline-none
                                   focus:border-blue-500">

                            <option value="Baik">
                                Baik
                            </option>

                            <option value="Rusak Ringan">
                                Rusak Ringan
                            </option>

                            <option value="Rusak Berat">
                                Rusak Berat
                            </option>

                        </select>

                    </div>


                    <!-- CATATAN -->

                    <div>

                        <label
                            class="block
                                   text-sm
                                   font-semibold
                                   text-gray-700
                                   mb-1">

                            Catatan

                        </label>

                        <textarea
                            id="catatanPengembalian"
                            rows="3"
                            class="w-full
                                   border
                                   border-gray-300
                                   rounded-lg
                                   px-4
                                   py-2
                                   focus:outline-none
                                   focus:border-blue-500"
                            placeholder="Catatan pengembalian...">
                        </textarea>

                    </div>


                </div>

            `,

            showCancelButton:
                true,

            confirmButtonText:
                "Konfirmasi Pengembalian",

            cancelButtonText:
                "Batal",

            confirmButtonColor:
                "#16a34a",

            cancelButtonColor:
                "#6b7280",

            focusConfirm:
                false,


            // =================================================
            // VALIDASI FORM
            // =================================================

            preConfirm: () => {


                const tanggal =
                    document
                        .getElementById(
                            "tanggalKembali"
                        )
                        .value;


                const kondisi =
                    document
                        .getElementById(
                            "kondisiBarang"
                        )
                        .value;


                const catatan =
                    document
                        .getElementById(
                            "catatanPengembalian"
                        )
                        .value
                        .trim();


                if (!tanggal) {

                    Swal.showValidationMessage(
                        "Tanggal pengembalian wajib diisi."
                    );

                    return false;
                }


                if (!kondisi) {

                    Swal.showValidationMessage(
                        "Kondisi barang wajib dipilih."
                    );

                    return false;
                }


                return {

                    tanggal:
                        tanggal,

                    kondisi:
                        kondisi,

                    catatan:
                        catatan

                };

            }

        });


    // =====================================================
    // BATAL
    // =====================================================

    if (
        !result.isConfirmed
    ) {

        return;
    }


    const {

        tanggal,
        kondisi,
        catatan

    } = result.value;


    // =====================================================
    // AMBIL STOK TERKINI
    // =====================================================

    const {

        data: barang,

        error: errorBarang

    } = await supabaseClient

        .from("barang")

        .select(
            "id, jumlah"
        )

        .eq(
            "id",
            peminjaman.barang_id
        )

        .single();


    // =====================================================
    // ERROR BARANG
    // =====================================================

    if (
        errorBarang ||
        !barang
    ) {

        console.error(
            errorBarang
        );

        Swal.fire({

            icon:
                "error",

            title:
                "Barang Tidak Ditemukan",

            text:
                "Data barang tidak ditemukan. Pengembalian dibatalkan."

        });

        return;
    }


    // =====================================================
    // HITUNG STOK
    // =====================================================

    const stokLama =
        Number(
            barang.jumlah || 0
        );


    const jumlahKembali =
        Number(
            peminjaman.jumlah || 0
        );


    const stokBaru =
        stokLama +
        jumlahKembali;


    console.log(
        "STOK LAMA:",
        stokLama
    );

    console.log(
        "JUMLAH KEMBALI:",
        jumlahKembali
    );

    console.log(
        "STOK BARU:",
        stokBaru
    );


    // =====================================================
    // UPDATE PEMINJAMAN
    // =====================================================

    const {

        error: updatePeminjamanError

    } = await supabaseClient

        .from("peminjaman")

        .update({

            status:
                "Dikembalikan",

            tanggal_kembali:
                tanggal,

            kondisi_kembali:
                kondisi,

            catatan_kembali:
                catatan,

            approver_id:
                currentUser.id

        })

        .eq(
            "id",
            id
        );


    // =====================================================
    // ERROR UPDATE PEMINJAMAN
    // =====================================================

    if (
        updatePeminjamanError
    ) {

        console.error(
            updatePeminjamanError
        );

        Swal.fire({

            icon:
                "error",

            title:
                "Gagal",

            text:
                "Data pengembalian gagal diperbarui."

        });

        return;
    }


    // =====================================================
    // UPDATE STOK
    // =====================================================

    const {

        error: updateStokError

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


    // =====================================================
    // ROLLBACK STATUS
    // =====================================================

    if (
        updateStokError
    ) {

        console.error(
            updateStokError
        );


        await supabaseClient

            .from("peminjaman")

            .update({

                status:
                    "Menunggu Pengembalian",

                tanggal_kembali:
                    null,

                kondisi_kembali:
                    null,

                catatan_kembali:
                    null

            })

            .eq(
                "id",
                id
            );


        Swal.fire({

            icon:
                "error",

            title:
                "Pengembalian Gagal",

            text:
                "Stok barang gagal diperbarui. Perubahan pengembalian dibatalkan."

        });

        return;
    }


    // =====================================================
    // AUDIT INVENTORI
    // =====================================================

    console.log(
        "MENYIMPAN AUDIT PENGEMBALIAN..."
    );


    const {

        error: auditError

    } = await supabaseClient

        .from("audit_inventori")

        .insert({

            barang_id:
                peminjaman.barang_id,

            user_id:
                currentUser.id,

            aktivitas:
                "PEMINJAMAN_DIKEMBALIKAN",

            deskripsi:
                `Peminjaman ${peminjaman.kode_peminjaman} sebanyak ${peminjaman.jumlah} unit dikembalikan oleh ${peminjaman.peminjam?.nama || "mahasiswa"} dan dikonfirmasi oleh ${currentUser.nama}. Kondisi: ${kondisi}.`

        });


    if (
        auditError
    ) {

        console.error(
            "ERROR AUDIT PENGEMBALIAN:",
            auditError
        );

    } else {

        console.log(
            "AUDIT PENGEMBALIAN BERHASIL."
        );

    }


    // =====================================================
    // SUCCESS
    // =====================================================

    await Swal.fire({

        icon:
            "success",

        title:
            "Pengembalian Berhasil",

        text:
            "Barang berhasil dikembalikan dan stok telah diperbarui.",

        timer:
            1800,

        showConfirmButton:
            false

    });


    // =====================================================
    // RELOAD
    // =====================================================

    loadPengembalian();

}


// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggal(tanggal) {


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