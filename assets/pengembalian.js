// =========================================================
// PENGEMBALIAN.JS
// PENGELOLAAN PENGEMBALIAN BARANG
// =========================================================

// =========================================================
// LOAD DATA PEMINJAMAN
// =========================================================

async function loadPengembalian() {


const table =
    document.getElementById("dataTable");


table.innerHTML = `
    <tr>
        <td colspan="9"
            class="text-center py-8 text-gray-500">

            Memuat data...

        </td>
    </tr>
`;


// =====================================================
// AMBIL DATA PEMINJAMAN
// =====================================================

const {
    data,
    error
} = await supabaseClient

    .from("peminjaman")

    .select(`
        *,
        barang (
            id,
            nama,
            kode
        ),
        users (
            id,
            nama,
            nim
        )
    `)

    .eq("status", "dipinjam")

    .order("batas_kembali", {
        ascending: true
    });


if (error) {

    console.error(
        "Gagal mengambil data pengembalian:",
        error
    );


    table.innerHTML = `
        <tr>
            <td colspan="9"
                class="text-center py-8 text-red-500">

                Gagal mengambil data pengembalian.

            </td>
        </tr>
    `;

    return;

}


renderTable(data || []);


}

// =========================================================
// RENDER TABLE
// =========================================================

function renderTable(data) {


const table =
    document.getElementById("dataTable");


table.innerHTML = "";


if (!data.length) {

    table.innerHTML = `
        <tr>
            <td colspan="9"
                class="text-center py-10 text-gray-500">

                <i class="fas fa-box-open text-3xl mb-3 block"></i>

                Tidak ada barang yang sedang dipinjam.

            </td>
        </tr>
    `;

    return;

}


data.forEach((item, index) => {


    const barang =
        item.barang || {};


    const peminjam =
        item.users || {};


    const status =
        item.status || "dipinjam";


    table.innerHTML += `

        <tr class="table-row hover:bg-gray-50">


            <td class="px-6 py-4 text-center">
                ${index + 1}
            </td>


            <td class="px-6 py-4">

                ${barang.kode || "-"}

            </td>


            <td class="px-6 py-4 font-medium">

                ${barang.nama || "-"}

            </td>


            <td class="px-6 py-4">

                <div>
                    ${peminjam.nama || "-"}
                </div>

                <div class="text-xs text-gray-400">
                    ${peminjam.nim || "-"}
                </div>

            </td>


            <td class="px-6 py-4 text-center">

                ${item.jumlah || 0}

            </td>


            <td class="px-6 py-4">

                ${formatTanggal(item.tanggal_pinjam)}

            </td>


            <td class="px-6 py-4">

                ${formatTanggal(item.batas_kembali)}

            </td>


            <td class="px-6 py-4">

                ${getStatusBadge(item)}

            </td>


            <td class="px-6 py-4 text-center">

                <button
                    onclick="prosesPengembalian('${item.id}')"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">

                    <i class="fas fa-rotate-left mr-1"></i>

                    KEMBALIKAN

                </button>

            </td>


        </tr>

    `;

});

}

// =========================================================
// STATUS BADGE
// =========================================================

function getStatusBadge(item) {


const batas =
    item.batas_kembali
        ? new Date(item.batas_kembali)
        : null;


const sekarang =
    new Date();


if (batas && sekarang > batas) {

    return `
        <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
            TERLAMBAT
        </span>
    `;

}


return `
    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
        DIPINJAM
    </span>
`;


}

// =========================================================
// PROSES PENGEMBALIAN
// =========================================================

async function prosesPengembalian(id) {


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
        )
    `)

    .eq("id", id)

    .single();


if (errorPinjam) {

    console.error(errorPinjam);

    Swal.fire(
        "Error",
        "Data peminjaman tidak ditemukan.",
        "error"
    );

    return;

}


// =====================================================
// FORM PENGEMBALIAN
// =====================================================

const result =
    await Swal.fire({

        title: "Pengembalian Barang",

        html: `

            <div class="text-left space-y-3">

                <div>
                    <b>Barang:</b>
                    ${peminjaman.barang?.nama || "-"}
                </div>

                <div>
                    <b>Jumlah:</b>
                    ${peminjaman.jumlah || 0}
                </div>

                <div>
                    <b>Tanggal Kembali:</b>

                    <input
                        type="date"
                        id="tanggalKembali"
                        value="${new Date().toISOString().split("T")[0]}"
                        class="swal2-input"
                    >

                </div>

                <div>

                    <b>Kondisi Barang:</b>

                    <select
                        id="kondisiBarang"
                        class="swal2-select">

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

                <div>

                    <b>Catatan:</b>

                    <textarea
                        id="catatanPengembalian"
                        class="swal2-textarea"
                        placeholder="Catatan pengembalian..."></textarea>

                </div>

            </div>

        `,

        showCancelButton: true,

        confirmButtonText:
            "Konfirmasi Pengembalian",

        cancelButtonText:
            "Batal",

        confirmButtonColor:
            "#16a34a",

        preConfirm: () => {

            return {

                tanggal:
                    document
                        .getElementById("tanggalKembali")
                        .value,

                kondisi:
                    document
                        .getElementById("kondisiBarang")
                        .value,

                catatan:
                    document
                        .getElementById("catatanPengembalian")
                        .value

            };

        }

    });


if (!result.isConfirmed) {
    return;
}


const {

    tanggal,
    kondisi,
    catatan

} = result.value;


// =====================================================
// UPDATE STATUS PEMINJAMAN
// =====================================================

const {
    error
} = await supabaseClient

    .from("peminjaman")

    .update({

        status: "dikembalikan",

        tanggal_kembali: tanggal,

        kondisi_kembali: kondisi,

        catatan_kembali: catatan

    })

    .eq("id", id);


if (error) {

    console.error(error);


    Swal.fire(
        "Error",
        error.message,
        "error"
    );

    return;

}


// =====================================================
// UPDATE STOK
// =====================================================

const {

    data: barang,
    error: errorBarang

} = await supabaseClient

    .from("barang")

    .select("jumlah")

    .eq("id", peminjaman.barang_id)

    .single();


if (errorBarang) {

    console.error(errorBarang);

    Swal.fire(
        "Peringatan",
        "Pengembalian berhasil, tetapi stok gagal diperbarui.",
        "warning"
    );

    loadPengembalian();

    return;

}


const stokBaru =
    Number(barang.jumlah || 0) +
    Number(peminjaman.jumlah || 0);


const {
    error: updateStokError
} = await supabaseClient

    .from("barang")

    .update({

        jumlah: stokBaru

    })

    .eq("id", peminjaman.barang_id);


if (updateStokError) {

    console.error(updateStokError);

    Swal.fire(
        "Peringatan",
        "Status sudah dikembalikan, tetapi stok gagal diperbarui.",
        "warning"
    );

    loadPengembalian();

    return;

}


// =====================================================
// SUCCESS
// =====================================================

Swal.fire({

    icon: "success",

    title: "Berhasil",

    text:
        "Barang berhasil dikembalikan dan stok telah diperbarui.",

    confirmButtonColor:
        "#2563eb"

}).then(() => {

    loadPengembalian();

});

}

// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggal(tanggal) {


if (!tanggal) {
    return "-";
}


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
// SEARCH
// =========================================================

function searchTable() {

const input =
    document
        .getElementById("searchInput")
        .value
        .toLowerCase();


const rows =
    document.querySelectorAll(
        "#dataTable tr"
    );


rows.forEach(row => {

    const text =
        row.textContent
            .toLowerCase();


    row.style.display =
        text.includes(input)
            ? ""
            : "none";

});


}

// =========================================================
// INIT
// =========================================================

document.addEventListener(
"DOMContentLoaded",
function () {


    loadPengembalian();

}

);
