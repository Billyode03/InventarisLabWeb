/* =========================================================
   DASHBOARD MAHASISWA

   ROLE:
   - MAHASISWA : Hanya melihat data miliknya sendiri
   ========================================================= */


// =========================================================
// USER LOGIN
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


const currentUser = getCurrentUser();


console.log(
    "USER LOGIN:",
    currentUser
);


// =========================================================
// CEK LOGIN
// =========================================================

if (
    !currentUser ||
    !currentUser.id
) {

    window.location.href = "../login.html";

}


// =========================================================
// CEK ROLE
// =========================================================

const currentRole =
    String(currentUser.role || "")
        .trim()
        .toLowerCase();


if (
    currentRole !== "mahasiswa"
) {

    console.warn(
        "Dashboard mahasiswa diakses oleh:",
        currentRole
    );

}


// =========================================================
// LOAD AWAL
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        tampilkanUser();

        loadDashboardMahasiswa();

    }
);


// =========================================================
// TAMPILKAN USER
// =========================================================

function tampilkanUser() {

    const nama =
        currentUser.nama || "-";

    const nim =
        currentUser.nim || "-";


    // SIDEBAR

    const sidebarNama =
        document.getElementById(
            "sidebarNama"
        );

    if (sidebarNama) {

        sidebarNama.textContent =
            nama;

    }


    // HEADER

    const headerNama =
        document.getElementById(
            "headerNama"
        );

    if (headerNama) {

        headerNama.textContent =
            nama;

    }


    const headerRole =
        document.getElementById(
            "headerRole"
        );

    if (headerRole) {

        headerRole.textContent =
            "Mahasiswa";

    }


    // WELCOME

    const welcomeNama =
        document.getElementById(
            "welcomeNama"
        );

    if (welcomeNama) {

        welcomeNama.textContent =
            nama;

    }


    // DETAIL LOGIN

    const detailNama =
        document.getElementById(
            "detailNama"
        );

    if (detailNama) {

        detailNama.textContent =
            nama;

    }


    const detailNim =
        document.getElementById(
            "detailNim"
        );

    if (detailNim) {

        detailNim.textContent =
            nim;

    }


    const detailRole =
        document.getElementById(
            "detailRole"
        );

    if (detailRole) {

        detailRole.textContent =
            "MAHASISWA";

    }

}


// =========================================================
// LOAD DASHBOARD
// =========================================================

async function loadDashboardMahasiswa() {

    if (
        !currentUser ||
        !currentUser.id
    ) {

        return;

    }


    const {
        data,
        error
    } = await supabaseClient

        .from("peminjaman")

        .select(`
            *,
            barang (
                nama
            )
        `)

        .eq(
            "peminjam_id",
            currentUser.id
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    console.log(
        "PEMINJAMAN MAHASISWA:",
        data
    );


    if (error) {

        console.error(
            "Gagal mengambil data:",
            error
        );

        return;
    }


    const peminjaman =
        data || [];


    // =====================================================
    // HITUNG STATISTIK
    // =====================================================

    const total =
        peminjaman.length;


    const menunggu =
        peminjaman.filter(
            item =>
                item.status === "Menunggu"
        ).length;


    /*
       Disetujui dan Dipinjam
       dianggap masih dalam proses peminjaman.
    */

    const sedangDipinjam =
        peminjaman.filter(
            item =>
                item.status === "Disetujui" ||
                item.status === "Dipinjam"
        ).length;


    const sudahDikembalikan =
        peminjaman.filter(
            item =>
                item.status === "Dikembalikan"
        ).length;


    // =====================================================
    // UPDATE CARD
    // =====================================================

    setText(
        "totalPeminjaman",
        total
    );


    setText(
        "peminjamanMenunggu",
        menunggu
    );


    setText(
        "sedangDipinjam",
        sedangDipinjam
    );


    setText(
        "sudahDikembalikan",
        sudahDikembalikan
    );


    // =====================================================
    // TABEL PEMINJAMAN AKTIF
    // =====================================================

    renderPeminjamanAktif(
        peminjaman
    );

}


// =========================================================
// HELPER TEXT
// =========================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


// =========================================================
// RENDER PEMINJAMAN AKTIF
// =========================================================

function renderPeminjamanAktif(
    data
) {

    const tbody =
        document.getElementById(
            "peminjamanAktif"
        );


    if (!tbody) {

        return;

    }


    /*
       Yang ditampilkan di sini:
       - Menunggu
       - Disetujui
       - Dipinjam

       Yang Dikembalikan tidak masuk
       karena sudah selesai.
    */

    const aktif =
        data.filter(
            item =>
                item.status === "Menunggu" ||
                item.status === "Disetujui" ||
                item.status === "Dipinjam"
        );


    // =====================================================
    // KOSONG
    // =====================================================

    if (
        aktif.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center py-10 text-gray-500"
                >

                    <div class="flex flex-col items-center">

                        <i
                            class="fas fa-box-open text-4xl text-gray-300 mb-3"
                        ></i>

                        <p>
                            Belum ada peminjaman aktif.
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    // =====================================================
    // RENDER
    // =====================================================

    tbody.innerHTML = "";


    aktif.forEach(
        item => {

            const namaBarang =
                item.barang?.nama || "-";


            const batasKembali =
                item.batas_kembali
                    ? formatTanggal(
                        item.batas_kembali
                    )
                    : "-";


            let statusBadge = "";


            // MENUNGGU

            if (
                item.status === "Menunggu"
            ) {

                statusBadge = `

                    <span
                        class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                        MENUNGGU
                    </span>

                `;

            }


            // DISETUJUI

            else if (
                item.status === "Disetujui"
            ) {

                statusBadge = `

                    <span
                        class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                        DISETUJUI
                    </span>

                `;

            }


            // DIPINJAM

            else if (
                item.status === "Dipinjam"
            ) {

                statusBadge = `

                    <span
                        class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                        DIPINJAM
                    </span>

                `;

            }


            tbody.innerHTML += `

                <tr
                    class="border-b hover:bg-gray-50"
                >

                    <td class="py-4 px-4 font-medium">

                        ${item.kode_peminjaman || "-"}

                    </td>


                    <td class="py-4 px-4">

                        ${namaBarang}

                    </td>


                    <td class="py-4 px-4">

                        ${item.jumlah ?? 0}

                    </td>


                    <td class="py-4 px-4">

                        ${batasKembali}

                    </td>


                    <td class="py-4 px-4">

                        ${statusBadge}

                    </td>

                </tr>

            `;

        }
    );

}


// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggal(
    tanggal
) {

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