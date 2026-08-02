// ==========================
// EDIT BARANG MASUK
// ==========================

const form = document.getElementById("formBarangMasuk");

const barangSelect = document.getElementById("barang_id");
const jumlahInput = document.getElementById("jumlah");
const tanggalInput = document.getElementById("tanggal");
const keteranganInput = document.getElementById("keterangan");

// ==========================
// AMBIL ID DARI URL
// ==========================

const params = new URLSearchParams(window.location.search);
const transaksiId = params.get("id");

if (!transaksiId) {

    Swal.fire(
        "Error",
        "ID transaksi tidak ditemukan.",
        "error"
    ).then(() => {
        window.location.href = "barang_masuk.html";
    });

}

// ==========================
// LOAD DATA BARANG
// ==========================

async function loadBarang() {

    const { data, error } = await supabaseClient
        .from("barang")
        .select("*")
        .order("nama");

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Gagal mengambil data barang.",
            "error"
        );

        return;

    }

    barangSelect.innerHTML =
        `<option value="">Pilih Barang</option>`;

    data.forEach(barang => {

        barangSelect.innerHTML += `
            <option value="${barang.id}">
                ${barang.nama}
            </option>
        `;

    });

}

// ==========================
// LOAD DATA TRANSAKSI
// ==========================

async function loadTransaksi() {

    const { data, error } = await supabaseClient

        .from("barang_masuk")

        .select("*")

        .eq("id", transaksiId)

        .single();

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Data tidak ditemukan.",
            "error"
        );

        return;

    }

    barangSelect.value = data.barang_id;
    jumlahInput.value = data.jumlah;
    tanggalInput.value = data.tanggal;
    keteranganInput.value = data.keterangan ?? "";

}

// ==========================
// LOAD AWAL
// ==========================

(async () => {

    await loadBarang();

    await loadTransaksi();

})();

// ==========================
// UPDATE DATA
// ==========================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const barangBaruId = barangSelect.value;
    const jumlahBaru = Number(jumlahInput.value);
    const tanggalBaru = tanggalInput.value;
    const keteranganBaru = keteranganInput.value;

    if (
        !barangBaruId ||
        !jumlahBaru ||
        !tanggalBaru
    ) {

        Swal.fire(
            "Oops",
            "Lengkapi semua data.",
            "warning"
        );

        return;

    }

    // ==========================
    // TRANSAKSI LAMA
    // ==========================

    const { data: transaksiLama } = await supabaseClient

        .from("barang_masuk")

        .select("*")

        .eq("id", transaksiId)

        .single();

    // ==========================
    // BARANG LAMA
    // ==========================

    const { data: barangLama } = await supabaseClient

        .from("barang")

        .select("*")

        .eq("id", transaksiLama.barang_id)

        .single();

    // ==========================
    // BARANG BARU
    // ==========================

    const { data: barangBaru } = await supabaseClient

        .from("barang")

        .select("*")

        .eq("id", barangBaruId)

        .single();

    // ==========================
    // JIKA BARANG DIGANTI
    // ==========================

    if (transaksiLama.barang_id !== barangBaruId) {

        // Kembalikan stok lama

        await supabaseClient

            .from("barang")

            .update({

                jumlah:
                    barangLama.jumlah -
                    transaksiLama.jumlah

            })

            .eq("id", barangLama.id);

        // Tambah stok barang baru

        await supabaseClient

            .from("barang")

            .update({

                jumlah:
                    barangBaru.jumlah +
                    jumlahBaru

            })

            .eq("id", barangBaru.id);

    }

    // ==========================
    // BARANG TETAP
    // ==========================

    else {

        const selisih =
            jumlahBaru -
            transaksiLama.jumlah;

        await supabaseClient

            .from("barang")

            .update({

                jumlah:
                    barangLama.jumlah +
                    selisih

            })

            .eq("id", barangLama.id);

    }

    // ==========================
    // UPDATE TRANSAKSI
    // ==========================

    const { error } = await supabaseClient

        .from("barang_masuk")

        .update({

            barang_id: barangBaruId,
            jumlah: jumlahBaru,
            tanggal: tanggalBaru,
            keterangan: keteranganBaru

        })

        .eq("id", transaksiId);

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Gagal mengupdate data.",
            "error"
        );

        return;

    }

    Swal.fire({

        icon: "success",

        title: "Berhasil",

        text: "Barang masuk berhasil diperbarui."

    }).then(() => {

        window.location.href =
            "barang_masuk.html";

    });

});