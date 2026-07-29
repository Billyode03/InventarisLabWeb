const form = document.getElementById("formBarang");
const btnSimpan = document.getElementById("btnSimpan");

// ambil id dari URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// =========================
// LOAD DATA
// =========================

async function loadBarang() {

    const { data, error } = await supabaseClient
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("Data tidak ditemukan");
        window.location.href = "../pages/barang.html";
        return;
    }

    document.getElementById("nama").value = data.nama;
    document.getElementById("spesifikasi").value = data.spesifikasi;
    document.getElementById("lokasi").value = data.lokasi;
    document.getElementById("kondisi").value = data.kondisi;
    document.getElementById("jumlah").value = data.jumlah;
    document.getElementById("jenis").value = data.jenis;
    document.getElementById("keterangan").value = data.keterangan;

}

loadBarang();


// =========================
// UPDATE
// =========================

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    btnSimpan.disabled = true;
    btnSimpan.innerHTML = `
        <i class="fas fa-spinner fa-spin mr-2"></i>
        Menyimpan...
    `;

    const nama = document.getElementById("nama").value.trim();
    const spesifikasi = document.getElementById("spesifikasi").value.trim();
    const lokasi = document.getElementById("lokasi").value.trim();
    const kondisi = document.getElementById("kondisi").value;
    const jumlah = parseInt(document.getElementById("jumlah").value);
    const jenis = document.getElementById("jenis").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    const { error } = await supabaseClient
        .from("barang")
        .update({

            nama,
            spesifikasi,
            lokasi,
            kondisi,
            jumlah,
            jenis,
            keterangan

        })
        .eq("id", id);

    if(error){

        console.error(error);

        alert("Gagal mengupdate data.");

        resetButton();

        return;

    }

    alert("Barang berhasil diupdate.");

    window.location.href="../pages/barang.html";

});


// =========================

function resetButton(){

    btnSimpan.disabled = false;

    btnSimpan.innerHTML=`
        <i class="fas fa-save mr-2"></i>
        Simpan Barang
    `;

}