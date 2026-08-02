// ==========================
// ELEMENT
// ==========================

const tableBody = document.getElementById("dataTable");

// ==========================
// LOAD DATA
// ==========================

async function loadBarangMasuk() {

//     const { data, error } = await supabaseClient
// .from("barang_masuk")
// .select("*");

    const { data, error } = await supabaseClient
        .from("barang_masuk")
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

        // return;
        console.log(data);
        return;

    }

    tableBody.innerHTML = "";

    // ==========================
    // DATA KOSONG
    // ==========================

    if (data.length === 0) {

        tableBody.innerHTML = `

        <tr>

            <td colspan="7"
                class="text-center py-8 text-gray-500">

                Belum ada data barang masuk.

            </td>

        </tr>

        `;

        return;

    }

    // ==========================
    // HITUNG STATISTIK
    // ==========================

    let totalUnit = 0;
    let hariIni = 0;
    let bulanIni = 0;

    const today = new Date().toISOString().split("T")[0];

    const bulanSekarang = new Date().getMonth() + 1;
    const tahunSekarang = new Date().getFullYear();

    data.forEach(item => {

        totalUnit += item.jumlah;

        if (item.tanggal === today)
            hariIni++;

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
    document.getElementById("totalUnit").innerText = totalUnit;

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
${item.barang.nama ?? "-"}
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
onclick="editBarangMasuk(${item.id})"
class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg">

<i class="fas fa-edit"></i>

</button>

<button
onclick="hapusBarangMasuk(${item.id})"
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

loadBarangMasuk();


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

        rows[i].style.display =
            text.includes(input)
                ? ""
                : "none";

    }

}


// ==========================
// EDIT
// ==========================

function editBarangMasuk(id){

    window.location.href =
    `edit_barangMasuk.html?id=${id}`;

}


// ==========================
// HAPUS
// ==========================

async function hapusBarangMasuk(id){

    const result = await Swal.fire({

        title:"Yakin?",

        text:"Data akan dihapus.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Ya"

    });

    if(!result.isConfirmed) return;


    // Ambil transaksi

    const { data: transaksi } = await supabaseClient

        .from("barang_masuk")

        .select("*")

        .eq("id",id)

        .single();


    // Ambil barang

    const { data: barang } = await supabaseClient

        .from("barang")

        .select("*")

        .eq("id",transaksi.barang_id)

        .single();


    // Kurangi stok

    await supabaseClient

        .from("barang")

        .update({

        jumlah:
        barang.jumlah - transaksi.jumlah

        })
        .eq("id",barang.id);


    // Hapus transaksi

    await supabaseClient

        .from("barang_masuk")

        .delete()

        .eq("id",id);


    Swal.fire(

        "Berhasil",

        "Data berhasil dihapus",

        "success"

    );

    loadBarangMasuk();

}