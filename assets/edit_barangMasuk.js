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

        .select("id, nama, jumlah")

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
            "Data transaksi tidak ditemukan.",
            "error"
        );

        return;

    }


    barangSelect.value = data.barang_id;

    jumlahInput.value = data.jumlah;

    tanggalInput.value = data.tanggal;

    keteranganInput.value =
        data.keterangan ?? "";

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

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ==========================
        // AMBIL DATA FORM
        // ==========================

        const barangBaruId =
            Number(barangSelect.value);

        const jumlahBaru =
            Number(jumlahInput.value);

        const tanggalBaru =
            tanggalInput.value;

        const keteranganBaru =
            keteranganInput.value.trim();


        // ==========================
        // VALIDASI
        // ==========================

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


        if (jumlahBaru <= 0) {

            Swal.fire(
                "Oops",
                "Jumlah barang harus lebih dari 0.",
                "warning"
            );

            return;

        }


        // ==========================
        // AMBIL TRANSAKSI LAMA
        // ==========================

        const {
            data: transaksiLama,
            error: errorTransaksi
        } = await supabaseClient

            .from("barang_masuk")

            .select("*")

            .eq("id", transaksiId)

            .single();


        if (errorTransaksi || !transaksiLama) {

            console.error(errorTransaksi);

            Swal.fire(
                "Error",
                "Data transaksi lama tidak ditemukan.",
                "error"
            );

            return;

        }


        // ==========================
        // AMBIL BARANG LAMA
        // ==========================

        const {
            data: barangLama,
            error: errorBarangLama
        } = await supabaseClient

            .from("barang")

            .select("*")

            .eq("id", transaksiLama.barang_id)

            .single();


        if (errorBarangLama || !barangLama) {

            console.error(errorBarangLama);

            Swal.fire(
                "Error",
                "Data barang lama tidak ditemukan.",
                "error"
            );

            return;

        }


        // ==========================
        // AMBIL BARANG BARU
        // ==========================

        const {
            data: barangBaru,
            error: errorBarangBaru
        } = await supabaseClient

            .from("barang")

            .select("*")

            .eq("id", barangBaruId)

            .single();


        if (errorBarangBaru || !barangBaru) {

            console.error(errorBarangBaru);

            Swal.fire(
                "Error",
                "Data barang baru tidak ditemukan.",
                "error"
            );

            return;

        }


        // =====================================================
        // JIKA BARANG DIGANTI
        // =====================================================

        if (
            Number(transaksiLama.barang_id) !==
            Number(barangBaruId)
        ) {


            // ==========================
            // KEMBALIKAN STOK BARANG LAMA
            // ==========================

            const stokLamaBaru =
                Number(barangLama.jumlah) -
                Number(transaksiLama.jumlah);


            if (stokLamaBaru < 0) {

                Swal.fire(
                    "Error",
                    "Stok barang lama tidak valid.",
                    "error"
                );

                return;

            }


            const {
                error: errorUpdateLama
            } = await supabaseClient

                .from("barang")

                .update({

                    jumlah: stokLamaBaru

                })

                .eq("id", barangLama.id);


            if (errorUpdateLama) {

                console.error(errorUpdateLama);

                Swal.fire(
                    "Error",
                    "Gagal mengembalikan stok barang lama.",
                    "error"
                );

                return;

            }


            // ==========================
            // TAMBAH STOK BARANG BARU
            // ==========================

            const stokBaruBaru =
                Number(barangBaru.jumlah) +
                Number(jumlahBaru);


            const {
                error: errorUpdateBaru
            } = await supabaseClient

                .from("barang")

                .update({

                    jumlah: stokBaruBaru

                })

                .eq("id", barangBaru.id);


            if (errorUpdateBaru) {

                console.error(errorUpdateBaru);

                Swal.fire(
                    "Error",
                    "Gagal menambahkan stok barang baru.",
                    "error"
                );

                return;

            }

        }


        // =====================================================
        // JIKA BARANG TETAP
        // =====================================================

        else {


            // ==========================
            // BATalkan TRANSAKSI LAMA
            // ==========================

            const stokSetelahBatalkan =
                Number(barangLama.jumlah) -
                Number(transaksiLama.jumlah);


            if (stokSetelahBatalkan < 0) {

                Swal.fire(
                    "Error",
                    "Stok barang tidak valid untuk transaksi ini.",
                    "error"
                );

                return;

            }


            // ==========================
            // TERAPKAN TRANSAKSI BARU
            // ==========================

            const stokFinal =
                stokSetelahBatalkan +
                Number(jumlahBaru);


            const {
                error: errorUpdateStok
            } = await supabaseClient

                .from("barang")

                .update({

                    jumlah: stokFinal

                })

                .eq("id", barangLama.id);


            if (errorUpdateStok) {

                console.error(errorUpdateStok);

                Swal.fire(
                    "Error",
                    "Gagal memperbarui stok barang.",
                    "error"
                );

                return;

            }

        }


        // ==========================
        // UPDATE TRANSAKSI
        // ==========================

        const {
            error: errorUpdateTransaksi
        } = await supabaseClient

            .from("barang_masuk")

            .update({

                barang_id: barangBaruId,

                jumlah: jumlahBaru,

                tanggal: tanggalBaru,

                keterangan: keteranganBaru

            })

            .eq("id", transaksiId);


        if (errorUpdateTransaksi) {

            console.error(errorUpdateTransaksi);

            Swal.fire(
                "Error",
                "Stok sudah diperbarui, tetapi data transaksi gagal diperbarui.",
                "error"
            );

            return;

        }


        // ==========================
        // SUCCESS
        // ==========================

        Swal.fire({

            icon: "success",

            title: "Berhasil",

            text: "Barang masuk berhasil diperbarui.",

            confirmButtonColor: "#2563eb"

        }).then(() => {

            window.location.href =
                "barang_masuk.html";

        });

    }
);