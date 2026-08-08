// ==========================
// ELEMENT
// ==========================

const tableBody = document.getElementById("dataTable");

// ==========================
// LOAD DATA
// ==========================

async function loadBarangKeluar() {

    const { data, error } = await supabaseClient

        .from("barang_keluar")

        .select(`
            *,
            barang (
                id,
                nama
            )
        `)

        .order("tanggal", { ascending: false });

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Gagal mengambil data.",
            "error"
        );

        return;

    }

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-gray-500">
                    Belum ada data barang keluar.
                </td>
            </tr>
        `;

        return;

    }

    // ==========================
    // STATISTIK
    // ==========================

    let totalUnit = 0;
    let hariIni = 0;
    let bulanIni = 0;

    const today = new Date().toISOString().split("T")[0];

    const bulanSekarang = new Date().getMonth() + 1;
    const tahunSekarang = new Date().getFullYear();

    data.forEach(item => {

        totalUnit += item.jumlah;

        const tanggalItem = item.tanggal.split("T")[0];

        if (tanggalItem === today) {

            hariIni++;

        }

        const tgl = new Date(item.tanggal);

        if (
            tgl.getMonth() + 1 === bulanSekarang &&
            tgl.getFullYear() === tahunSekarang
        ) {

            bulanIni++;

        }

    });

    document.getElementById("totalTransaksi").innerText = data.length;
    document.getElementById("hariIni").innerText = hariIni;
    document.getElementById("bulanIni").innerText = bulanIni;
    document.getElementById("totalUnitKeluar").innerText = totalUnit;

    // ==========================
    // TAMPILKAN DATA
    // ==========================

    data.forEach((item, index) => {

        tableBody.insertAdjacentHTML(
            "beforeend",
            `
            <tr class="border-b hover:bg-gray-50">

                <td class="px-6 py-4 text-center">
                    ${index + 1}
                </td>

                <td class="px-6 py-4">
                    ${item.tanggal}
                </td>

                <td class="px-6 py-4">
                    ${item.barang?.nama ?? "-"}
                </td>

                <td class="px-6 py-4">
                    ${item.jumlah}
                </td>

                <td class="px-6 py-4">
                    ${item.keterangan ?? "-"}
                </td>

                <td class="px-6 py-4 text-center">

                    <div class="flex justify-center gap-2">

                        <button
                            onclick="editBarangKeluar('${item.id}')"
                            class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg">

                            <i class="fas fa-edit"></i>

                        </button>

                        <button
                            onclick="hapusBarangKeluar('${item.id}')"
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg">

                            <i class="fas fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>
            `
        );

    });

}

loadBarangKeluar();

// ==========================
// SEARCH
// ==========================

function searchTable() {

    let input = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    let rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        let text = rows[i].innerText.toLowerCase();

        rows[i].style.display = text.includes(input)
            ? ""
            : "none";

    }

}

// ==========================
// EDIT
// ==========================

function editBarangKeluar(id) {

    window.location.href =
        `edit_barangKeluar.html?id=${id}`;

}

// ==========================
// HAPUS
// ==========================

async function hapusBarangKeluar(id) {

    const result = await Swal.fire({

        title: "Yakin?",

        text: "Data akan dihapus.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Ya"

    });

    if (!result.isConfirmed) return;

    // Ambil transaksi

    const { data: transaksi } = await supabaseClient

        .from("barang_keluar")

        .select("*")

        .eq("id", id)

        .single();

        if (!transaksi) {

    Swal.fire(
        "Error",
        "Data transaksi tidak ditemukan.",
        "error"
    );

    return;

}

    // Ambil barang

    const { data: barang } = await supabaseClient

        .from("barang")

        .select("*")

        .eq("id", transaksi.barang_id)

        .single();

        if (!barang) {

    Swal.fire(
        "Error",
        "Data barang tidak ditemukan.",
        "error"
    );

    return;

}

    // Kembalikan stok

    await supabaseClient

        .from("barang")

        .update({

            jumlah:
                barang.jumlah + transaksi.jumlah

        })

        .eq("id", barang.id);

    // Hapus transaksi

    await supabaseClient

        .from("barang_keluar")

        .delete()

        .eq("id", id);

    Swal.fire(

        "Berhasil",

        "Data berhasil dihapus.",

        "success"

    );

    loadBarangKeluar();

}