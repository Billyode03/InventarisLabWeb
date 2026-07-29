const form = document.getElementById("formBarang");
const btnSimpan = document.getElementById("btnSimpan");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    btnSimpan.disabled = true;
    btnSimpan.innerHTML = `
        <i class="fas fa-spinner fa-spin mr-2"></i>
        Menyimpan...
    `;

    // =============================
    // Ambil Data Form
    // =============================

    const nama = document.getElementById("nama").value.trim();
    const spesifikasi = document.getElementById("spesifikasi").value.trim();
    const lokasi = document.getElementById("lokasi").value.trim();
    const kondisi = document.getElementById("kondisi").value;
    const jumlah = parseInt(document.getElementById("jumlah").value);
    const jenis = document.getElementById("jenis").value;
    const keterangan = document.getElementById("keterangan").value.trim();

    // =============================
    // Validasi
    // =============================

    if (
        !nama ||
        !spesifikasi ||
        !lokasi ||
        !kondisi ||
        !jenis ||
        isNaN(jumlah)
    ) {

        alert("Lengkapi semua data terlebih dahulu.");

        resetButton();
        return;
    }

    // =============================
    // Generate Kode Barang
    // =============================

    const { data: lastBarang, error: errorKode } = await supabaseClient
        .from("barang")
        .select("kode_barang")
        .order("id", { ascending: false })
        .limit(1);

    if (errorKode) {

        console.error(errorKode);

        alert("Gagal membuat kode barang.");

        resetButton();

        return;
    }

    let kode_barang = "BRG0001";

    if (lastBarang.length > 0) {

        const kodeTerakhir = lastBarang[0].kode_barang;

        const nomor = parseInt(
            kodeTerakhir.replace("BRG", "")
        );

        kode_barang =
            "BRG" +
            String(nomor + 1).padStart(4, "0");

    }

    // =============================
    // Simpan ke Supabase
    // =============================

    const { error } = await supabaseClient
        .from("barang")
        .insert([
            {
                kode_barang,
                nama,
                spesifikasi,
                lokasi,
                kondisi,
                jumlah,
                jenis,
                keterangan
            }
        ]);

    if (error) {

        console.error(error);

        alert("Gagal menyimpan data!");

        resetButton();

        return;
    }

    alert("Barang berhasil ditambahkan!");

    window.location.href = "../pages/barang.html";

});

// =============================
// Reset Button
// =============================

function resetButton() {

    btnSimpan.disabled = false;

    btnSimpan.innerHTML = `
        <i class="fas fa-save mr-2"></i>
        Simpan Barang
    `;

}