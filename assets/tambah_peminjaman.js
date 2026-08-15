// ==========================================
// TAMBAH PEMINJAMAN
// ==========================================

// ==========================
// ELEMENT
// ==========================

const form =
    document.getElementById("formPeminjaman");

const peminjamSelect =
    document.getElementById("peminjam");

const nimInput =
    document.getElementById("nim");

const namaInput =
    document.getElementById("nama_peminjam");

const keperluanInput =
    document.getElementById("keperluan");

const barangSelect =
    document.getElementById("barang");

const kodeBarangInput =
    document.getElementById("kode_barang");

const lokasiInput =
    document.getElementById("lokasi");

const stokInput =
    document.getElementById("stok");

const jumlahPinjamInput =
    document.getElementById("jumlah_pinjam");

const tanggalPinjamInput =
    document.getElementById("tanggal_pinjam");

const tanggalKembaliInput =
    document.getElementById("tanggal_kembali");

const catatanInput =
    document.getElementById("catatan");

const btnSimpan =
    document.getElementById("btnSimpan");


// ==========================
// DATA SEMENTARA
// ==========================

let daftarMahasiswa = [];
let daftarBarang = [];

let userPeminjam = null;


// ==========================================
// LOAD MAHASISWA
// ==========================================

async function loadMahasiswa() {

    peminjamSelect.innerHTML = `
        <option value="">
            Memuat data mahasiswa...
        </option>
    `;


    const { data, error } =
        await supabaseClient

            .from("users")

            .select(`
                id,
                nama,
                nim,
                role
            `)

            .eq("role", "mahasiswa")

            .order("nama");


    if (error) {

        console.error(
            "ERROR LOAD MAHASISWA:",
            error
        );


        peminjamSelect.innerHTML = `
            <option value="">
                Gagal mengambil data mahasiswa
            </option>
        `;


        Swal.fire(
            "Error",
            "Gagal mengambil data mahasiswa.",
            "error"
        );


        return;
    }


    daftarMahasiswa = data || [];

    console.log("DATA MAHASISWA:", daftarMahasiswa);


    peminjamSelect.innerHTML = `
        <option value="">
            -- Pilih Mahasiswa --
        </option>
    `;


    daftarMahasiswa.forEach(user => {
        console.log("USER:", user);

        peminjamSelect.innerHTML += `
            <option value="${user.id}">
                ${user.nim} - ${user.nama}
            </option>
        `;

    });

    

}


// ==========================================
// PILIH MAHASISWA
// ==========================================

peminjamSelect.addEventListener(
    "change",
    function () {

        const userId =
            this.value;


        // ==========================
        // RESET
        // ==========================

        if (!userId) {

            userPeminjam = null;

            nimInput.value = "";
            namaInput.value = "";

            return;
        }


        // ==========================
        // CARI DATA USER
        // ==========================

        const user =
            daftarMahasiswa.find(
                item =>
                    String(item.id) ===
                    String(userId)
            );


        if (!user) {

            userPeminjam = null;

            nimInput.value = "";
            namaInput.value = "";

            return;
        }


        // ==========================
        // SIMPAN USER
        // ==========================

        userPeminjam = user;


        // ==========================
        // TAMPILKAN DATA
        // ==========================

        nimInput.value =
            user.nim || "-";

        namaInput.value =
            user.nama || "-";

    }
);


// ==========================================
// LOAD BARANG
// ==========================================

async function loadBarang() {

    barangSelect.innerHTML = `
        <option value="">
            Memuat data barang...
        </option>
    `;


    const { data, error } =
        await supabaseClient

            .from("barang")

            .select("*")

            .order("nama");


    if (error) {

        console.error(
            "ERROR LOAD BARANG:",
            error
        );


        barangSelect.innerHTML = `
            <option value="">
                Gagal mengambil data barang
            </option>
        `;


        Swal.fire(
            "Error",
            "Gagal mengambil data barang.",
            "error"
        );


        return;
    }


    daftarBarang = data || [];


    barangSelect.innerHTML = `
        <option value="">
            -- Pilih Barang --
        </option>
    `;


    daftarBarang.forEach(barang => {

        barangSelect.innerHTML += `
            <option value="${barang.id}">
                ${barang.nama}
            </option>
        `;

    });

}


// ==========================================
// PILIH BARANG
// ==========================================

barangSelect.addEventListener(
    "change",
    function () {

        const barangId =
            Number(this.value);


        // ==========================
        // RESET
        // ==========================

        if (!barangId) {

            kodeBarangInput.value = "";
            lokasiInput.value = "";
            stokInput.value = "";
            jumlahPinjamInput.value = "";

            return;
        }


        // ==========================
        // CARI BARANG
        // ==========================

        const barang =
            daftarBarang.find(
                item =>
                    Number(item.id) ===
                    barangId
            );


        if (!barang) {
            return;
        }


        // ==========================
        // TAMPILKAN DATA BARANG
        // ==========================

        kodeBarangInput.value =
            barang.kode_barang || "-";

        lokasiInput.value =
            barang.lokasi || "-";

        stokInput.value =
            barang.jumlah ?? 0;


        // ==========================
        // RESET JUMLAH
        // ==========================

        jumlahPinjamInput.value = "";

    }
);


// ==========================================
// TANGGAL PINJAM DEFAULT
// ==========================================

const hariIni =
    new Date();

const tahun =
    hariIni.getFullYear();

const bulan =
    String(
        hariIni.getMonth() + 1
    ).padStart(2, "0");

const tanggal =
    String(
        hariIni.getDate()
    ).padStart(2, "0");


tanggalPinjamInput.value =
    `${tahun}-${bulan}-${tanggal}`;


// ==========================================
// SUBMIT FORM
// ==========================================

form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ==========================
        // AMBIL DATA FORM
        // ==========================

        const keperluan =
            keperluanInput.value.trim();


        const barangId =
            Number(
                barangSelect.value
            );


        const jumlah =
            Number(
                jumlahPinjamInput.value
            );


        const tanggalPinjam =
            tanggalPinjamInput.value;


        const tanggalKembali =
            tanggalKembaliInput.value ||
            null;


        const catatan =
            catatanInput.value.trim();


        // ==========================
        // VALIDASI MAHASISWA
        // ==========================

        if (!userPeminjam) {

            Swal.fire(
                "Data Peminjam",
                "Silakan pilih mahasiswa terlebih dahulu.",
                "warning"
            );

            return;
        }


        // ==========================
        // VALIDASI BARANG
        // ==========================

        if (!barangId) {

            Swal.fire(
                "Data Barang",
                "Silakan pilih barang.",
                "warning"
            );

            return;
        }


        // ==========================
        // VALIDASI JUMLAH
        // ==========================

        if (!jumlah || jumlah < 1) {

            Swal.fire(
                "Jumlah Tidak Valid",
                "Jumlah pinjam minimal 1.",
                "warning"
            );

            return;
        }


        // ==========================
        // AMBIL STOK TERBARU
        // ==========================

        const {
            data: barang,
            error: barangError
        } = await supabaseClient

            .from("barang")

            .select("*")

            .eq("id", barangId)

            .single();


        if (
            barangError ||
            !barang
        ) {

            console.error(
                "ERROR LOAD BARANG:",
                barangError
            );


            Swal.fire(
                "Error",
                "Data barang tidak ditemukan.",
                "error"
            );

            return;
        }


        // ==========================
        // CEK STOK
        // ==========================

        if (
            Number(barang.jumlah) <
            jumlah
        ) {

            Swal.fire({

                icon: "warning",

                title: "Stok Tidak Cukup",

                text:
                    `Stok tersedia hanya ${barang.jumlah} barang.`

            });

            return;
        }


        // ==========================
        // CEK TANGGAL
        // ==========================

        if (!tanggalKembali) {

            Swal.fire(
                "Tanggal Kembali",
                "Silakan tentukan batas tanggal pengembalian.",
                "warning"
            );

            return;
        }
        if (
            tanggalKembali &&
            tanggalKembali <
            tanggalPinjam
        ) {

            Swal.fire(
                "Tanggal Tidak Valid",
                "Tanggal kembali tidak boleh sebelum tanggal pinjam.",
                "warning"
            );

            return;
        }


        // ==========================
        // GENERATE KODE PEMINJAMAN
        // ==========================

        const timestamp =
            Date.now()
                .toString()
                .slice(-6);


        const kodePeminjaman =
            `PMJ-${timestamp}`;


        // ==========================
        // STATUS AWAL
        // ==========================

        const status =
            "Menunggu";


        // ==========================
        // DISABLE BUTTON
        // ==========================

        btnSimpan.disabled =
            true;


        btnSimpan.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Menyimpan...
        `;


        // ==========================
        // INSERT PEMINJAMAN
        // ==========================

        const {
            error
        } = await supabaseClient

            .from("peminjaman")

            .insert({

                kode_peminjaman:
                    kodePeminjaman,

                barang_id:
                    barangId,

                peminjam_id:
                    userPeminjam.id,

                approver_id:
                    null,

                jumlah:
                    jumlah,

                tanggal_pinjam:
                    tanggalPinjam,

                tanggal_kembali:
                    null,

                batas_kembali:
                    tanggalKembali,

                status:
                    status,

                keperluan:
                    keperluan,

                catatan_admin:
                    catatan || null

            });


        // ==========================
        // ERROR INSERT
        // ==========================

        if (error) {

            console.error(
                "ERROR INSERT PEMINJAMAN:",
                error
            );


            btnSimpan.disabled =
                false;


            btnSimpan.innerHTML = `
                <i class="fas fa-floppy-disk mr-2"></i>
                Simpan Peminjaman
            `;


            Swal.fire({

                icon: "error",

                title: "Gagal",

                text:
                    error.message

            });


            return;
        }


        // ==========================================
        // AUDIT INVENTORI
        // ==========================================

        const {
            error: auditError
        } = await supabaseClient

            .from("audit_inventori")

            .insert({

                barang_id:
                    barangId,

                user_id:
                    userPeminjam.id,

                aktivitas:
                    "PENGAJUAN_PEMINJAMAN",

                deskripsi:
                    `Pengajuan peminjaman ${barang.nama} sebanyak ${jumlah} unit oleh ${userPeminjam.nama}.`

            });


        if (auditError) {

            console.error(
                "ERROR AUDIT PEMINJAMAN:",
                auditError
            );

        }


        // ==========================
        // BERHASIL
        // ==========================

        await Swal.fire({

            icon: "success",

            title: "Berhasil",

            text:
                "Pengajuan peminjaman berhasil disimpan dan menunggu persetujuan.",

            confirmButtonText:
                "OK"

        });


        // ==========================
        // KEMBALI
        // ==========================

        window.location.href =
            "../pages/peminjaman.html";

    }
);


// ==========================================
// LOAD AWAL
// ==========================================

loadMahasiswa();
loadBarang();