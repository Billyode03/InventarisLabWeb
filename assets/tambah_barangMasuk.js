// ==========================
// SET TANGGAL HARI INI
// ==========================

document.getElementById("tanggal").value =
    new Date().toISOString().split("T")[0];


// ==========================
// LOAD DATA BARANG
// ==========================

async function loadBarang() {

    const selectBarang = document.getElementById("barang_id");

    const { data, error } = await supabaseClient
        .from("barang")
        .select("id, nama")
        .order("nama", { ascending: true });

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Gagal mengambil data barang",
            "error"
        );

        return;

    }

    data.forEach((barang) => {

        selectBarang.innerHTML += `
            <option value="${barang.id}">
                ${barang.nama}
            </option>
        `;

    });

}

loadBarang();


// ==========================
// TAMBAH BARANG MASUK
// ==========================

const form = document.getElementById("formBarangMasuk");

form.addEventListener("submit", async function (e) {

    e.preventDefault();


    // ==========================
    // AMBIL DATA FORM
    // ==========================

    const barang_id = Number(document.getElementById("barang_id").value);

    const jumlah = Number(document.getElementById("jumlah").value);

    const tanggal = document.getElementById("tanggal").value;

    const keterangan = document.getElementById("keterangan").value.trim();


    // ==========================
    // VALIDASI
    // ==========================

    if (
        !barang_id ||
        !jumlah ||
        !tanggal
    ) {

        Swal.fire(
            "Peringatan",
            "Semua data wajib diisi",
            "warning"
        );

        return;

    }


    // ==========================
    // AMBIL DATA BARANG
    // ==========================

    const { data: barang, error: errorBarang } = await supabaseClient
        .from("barang")
        .select("*")
        .eq("id", barang_id)
        .single();

    if (errorBarang) {

        Swal.fire(
            "Error",
            "Barang tidak ditemukan",
            "error"
        );

        return;

    }


    // ==========================
    // SIMPAN BARANG MASUK
    // ==========================

    const { error } = await supabaseClient
        .from("barang_masuk")
        .insert([{

            barang_id: barang_id,
            jumlah: jumlah,
            tanggal: tanggal,
            keterangan: keterangan

        }]);

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            error.message,
            "error"
        );

        return;

    }


    // ==========================
    // UPDATE STOK BARANG
    // ==========================

    const stokBaru = Number(barang.jumlah) + jumlah;

    const { error: updateError } = await supabaseClient
        .from("barang")
        .update({

            jumlah: stokBaru

        })
        .eq("id", barang_id);

    if (updateError) {

        console.error(updateError);

        Swal.fire(
            "Error",
            "Barang masuk tersimpan, tetapi stok gagal diperbarui.",
            "error"
        );

        return;

    }

    // ==========================
        // SIMPAN AUDIT INVENTORI
        // ==========================

        const currentUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        const { error: auditError } =
            await supabaseClient
                .from("audit_inventori")
                .insert([{

                    barang_id: barang_id,

                    user_id: currentUser?.id || null,

                    aktivitas: "Barang Masuk",

                    deskripsi:
                        `Menambahkan ${jumlah} unit barang masuk. ${keterangan || ""}`

                }]);

        if (auditError) {

            console.error(
                "Gagal menyimpan audit:",
                auditError
            );

        }


    // ==========================
    // SUCCESS
    // ==========================

    Swal.fire({

        title: "Berhasil",

        text: "Barang masuk berhasil ditambahkan.",

        icon: "success",

        confirmButtonColor: "#2563eb"

    }).then(() => {

        window.location.href = "barang_masuk.html";

    });

});