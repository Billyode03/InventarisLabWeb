// =========================================================
// KAJUR DASHBOARD.JS
// =========================================================

// =========================================================
// USER LOGIN
// =========================================================

function getKajurUser() {


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

const kajurUser =
getKajurUser();

const kajurRole =
String(
kajurUser?.role || ""
)
.trim()
.toLowerCase();

console.log(
"KAJUR DASHBOARD USER:",
kajurUser
);

// =========================================================
// CEK AKSES
// =========================================================

if (
    kajurRole !== "kajur" &&
    kajurRole !== "ketua jurusan"
) {

    Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Dashboard ini khusus untuk Kajur."
    }).then(() => {
        window.location.href = "../login.html";
    });

}

// =========================================================
// LOAD DASHBOARD
// =========================================================

loadKajurDashboard();

// =========================================================
// LOAD SEMUA DATA DASHBOARD
// =========================================================

async function loadKajurDashboard() {


await loadTotalBarang();

await loadPeminjamanStatistik();

await loadPantauanPeminjaman();


}

// =========================================================
// TOTAL BARANG
// =========================================================

async function loadTotalBarang() {


const {
    count,
    error
} = await supabaseClient

    .from("barang")

    .select(
        "id",
        {
            count: "exact",
            head: true
        }
    );


if (error) {

    console.error(
        "Gagal mengambil total barang:",
        error
    );

    return;
}


const element =
    document.getElementById(
        "totalBarang"
    );


if (element) {

    element.textContent =
        count ?? 0;

}


}

// =========================================================
// STATISTIK PEMINJAMAN
// =========================================================

async function loadPeminjamanStatistik() {


const {
    data,
    error
} = await supabaseClient

    .from("peminjaman")

    .select(
        "status"
    );


if (error) {

    console.error(
        "Gagal mengambil statistik peminjaman:",
        error
    );

    return;
}


const total =
    data.length;


const menunggu =
    data.filter(
        item =>
            item.status === "Menunggu"
    ).length;


const dikembalikan =
    data.filter(
        item =>
            item.status === "Dikembalikan"
    ).length;


const totalElement =
    document.getElementById(
        "totalPeminjaman"
    );


const menungguElement =
    document.getElementById(
        "menungguApproval"
    );


const dikembalikanElement =
    document.getElementById(
        "dikembalikan"
    );


if (totalElement) {

    totalElement.textContent =
        total;

}


if (menungguElement) {

    menungguElement.textContent =
        menunggu;

}


if (dikembalikanElement) {

    dikembalikanElement.textContent =
        dikembalikan;

}


}

// =========================================================
// PANTAUAN PEMINJAMAN
// =========================================================

async function loadPantauanPeminjaman() {


const tbody =
    document.getElementById(
        "kajurPeminjamanTable"
    );


if (!tbody) {

    return;
}


tbody.innerHTML = `

    <tr>

        <td
            colspan="9"
            class="py-12 text-center text-gray-400">

            <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>

            <p>
                Memuat data peminjaman...
            </p>

        </td>

    </tr>

`;


const {
    data,
    error
} = await supabaseClient

    .from("peminjaman")

    .select(`

        id,
        kode_peminjaman,
        jumlah,
        tanggal_pinjam,
        batas_kembali,
        status,

        barang (
            nama
        ),

        peminjam:users!peminjam_id (
            nama,
            nim
        )

    `)

    .order(
        "created_at",
        {
            ascending: false
        }
    )

    .limit(10);


console.log(
    "PANTAUAN PEMINJAMAN:",
    data
);


if (error) {

    console.error(
        error
    );


    tbody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="py-12 text-center">

                <i class="fas fa-triangle-exclamation text-red-500 text-4xl mb-3"></i>

                <p class="font-medium text-gray-700">
                    Gagal mengambil data peminjaman
                </p>

                <p class="text-sm text-gray-500 mt-1">
                    ${error.message}
                </p>

            </td>

        </tr>

    `;

    return;
}


if (
    !data ||
    data.length === 0
) {

    tbody.innerHTML = `

        <tr>

            <td
                colspan="9"
                class="py-16 text-center text-gray-400">

                <i class="fas fa-handshake text-5xl mb-4"></i>

                <p class="font-medium">
                    Belum ada data peminjaman.
                </p>

                <p class="text-sm mt-1">
                    Pengajuan peminjaman mahasiswa akan muncul di sini.
                </p>

            </td>

        </tr>

    `;

    return;
}


tbody.innerHTML = "";


data.forEach(
    (item, index) => {

        const namaBarang =
            item.barang?.nama || "-";


        const namaPeminjam =
            item.peminjam?.nama || "-";


        const nimPeminjam =
            item.peminjam?.nim || "-";


        const tanggalPinjam =
            item.tanggal_pinjam
                ? formatTanggalKajur(
                    item.tanggal_pinjam
                )
                : "-";


        const batasKembali =
            item.batas_kembali
                ? formatTanggalKajur(
                    item.batas_kembali
                )
                : "-";


        // =============================================
        // STATUS
        // =============================================

        let statusBadge = "";


        switch (
            item.status
        ) {

            case "Menunggu":

                statusBadge = `

                    <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">

                        MENUNGGU

                    </span>

                `;

                break;


            case "Disetujui":

                statusBadge = `

                    <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">

                        DISETUJUI

                    </span>

                `;

                break;


            case "Ditolak":

                statusBadge = `

                    <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">

                        DITOLAK

                    </span>

                `;

                break;


            case "Dipinjam":

                statusBadge = `

                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">

                        DIPINJAM

                    </span>

                `;

                break;


            case "Dikembalikan":

                statusBadge = `

                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">

                        DIKEMBALIKAN

                    </span>

                `;

                break;


            default:

                statusBadge = `

                    <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">

                        ${item.status || "-"}

                    </span>

                `;
        }


        // =============================================
        // AKSI
        // =============================================

        let aksi = `

            <div class="flex justify-center gap-3">

                <button
                    onclick="detailPeminjamanKajur(${item.id})"
                    class="text-amber-500 hover:text-amber-700"
                    title="Detail">

                    <i class="fas fa-eye"></i>

                </button>

        `;


        aksi += `</div>`;


        // =============================================
        // ROW
        // =============================================

        tbody.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="px-6 py-4">
                    ${index + 1}
                </td>


                <td class="px-6 py-4">

                    <p class="font-medium">
                        ${namaPeminjam}
                    </p>

                </td>


                <td class="px-6 py-4 text-gray-600">
                    ${nimPeminjam}
                </td>


                <td class="px-6 py-4 font-medium">
                    ${namaBarang}
                </td>


                <td class="px-6 py-4">
                    ${item.jumlah ?? 0}
                </td>


                <td class="px-6 py-4">
                    ${tanggalPinjam}
                </td>


                <td class="px-6 py-4">
                    ${batasKembali}
                </td>


                <td class="px-6 py-4">
                    ${statusBadge}
                </td>


                <td class="px-6 py-4">
                    ${aksi}
                </td>

            </tr>

        `;

    }
);


}

// =========================================================
// FORMAT TANGGAL
// =========================================================

function formatTanggalKajur(
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

// =========================================================
// DETAIL
// =========================================================

function detailPeminjamanKajur(
id
) {


window.location.href =
    `pages/detail_peminjaman.html?id=${id}`;


}

