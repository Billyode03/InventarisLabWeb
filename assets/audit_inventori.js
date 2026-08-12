// =========================================================
// AUDIT INVENTORI.JS
// RIWAYAT AKTIVITAS INVENTORI
// =========================================================


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


const currentUser =
    getCurrentUser();


const currentRole =
    String(
        currentUser?.role || ""
    )
    .trim()
    .toLowerCase();


console.log(
    "USER LOGIN :",
    currentUser
);

console.log(
    "ROLE LOGIN :",
    currentRole
);


// =========================================================
// LOAD AUDIT INVENTORI
// =========================================================

async function loadAuditInventori() {

    const table =
        document.getElementById(
            "dataTable"
        );


    if (!table) {

        console.error(
            "Element #dataTable tidak ditemukan."
        );

        return;
    }


    // =====================================================
    // LOADING
    // =====================================================

    table.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center py-10 text-gray-500">

                <i
                    class="fas fa-spinner fa-spin text-3xl mb-3">
                </i>

                <p>
                    Memuat data audit inventori...
                </p>

            </td>

        </tr>

    `;


    // =====================================================
    // AMBIL DATA AUDIT
    // =====================================================

    const {

        data,
        error

    } = await supabaseClient

        .from("audit_inventori")

        .select(`
            *,
            barang (
                id,
                nama
            ),
            user:users (
                id,
                nama,
                nim,
                role
            )
        `)

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    console.log(
        "DATA AUDIT INVENTORI :",
        data
    );

    console.log(
        "ERROR AUDIT INVENTORI :",
        error
    );


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        console.error(
            "Gagal mengambil data audit:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-10">

                    <div
                        class="flex flex-col items-center">

                        <i
                            class="fas fa-triangle-exclamation
                                   text-red-500
                                   text-5xl
                                   mb-4">
                        </i>

                        <h2
                            class="text-lg
                                   font-semibold
                                   text-gray-700
                                   mb-2">

                            Gagal mengambil data audit

                        </h2>

                        <p class="text-gray-500 mb-4">

                            ${
                                error.message ||
                                "Terjadi kesalahan."
                            }

                        </p>

                        <button
                            onclick="loadAuditInventori()"
                            class="bg-blue-600
                                   hover:bg-blue-700
                                   text-white
                                   px-5
                                   py-2
                                   rounded-lg">

                            Coba Lagi

                        </button>

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    // =====================================================
    // RENDER
    // =====================================================

    renderTable(
        data || []
    );

}


// =========================================================
// RENDER TABLE
// =========================================================

function renderTable(data) {

    const table =
        document.getElementById(
            "dataTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    // =====================================================
    // DATA KOSONG
    // =====================================================

    if (!data.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-12 text-gray-500">

                    <i
                        class="fas fa-clock-rotate-left
                               text-gray-300
                               text-5xl
                               mb-4
                               block">
                    </i>

                    <h2
                        class="text-lg
                               font-semibold
                               text-gray-700">

                        Belum ada aktivitas inventori.

                    </h2>

                    <p class="mt-2">

                        Riwayat aktivitas inventori akan
                        muncul di sini.

                    </p>

                </td>

            </tr>

        `;

        return;
    }


    // =====================================================
    // RENDER DATA
    // =====================================================

    data.forEach(
        (item, index) => {


            const barang =
                item.barang || {};


            const user =
                item.user || {};


            const aktivitas =
                item.aktivitas || "-";


            const badge =
                getAktivitasBadge(
                    aktivitas
                );


            table.innerHTML += `

                <tr
                    class="border-b
                           hover:bg-gray-50
                           transition">


                    <!-- NO -->

                    <td
                        class="px-6 py-4 text-center">

                        ${index + 1}

                    </td>


                    <!-- WAKTU -->

                    <td
                        class="px-6 py-4 whitespace-nowrap">

                        ${formatTanggalWaktu(
                            item.created_at
                        )}

                    </td>


                    <!-- BARANG -->

                    <td
                        class="px-6 py-4">

                        <div>

                            <p
                                class="font-medium
                                       text-gray-800">

                                ${
                                    barang.nama ||
                                    "-"
                                }

                            </p>

                            <p
                                class="text-xs
                                       text-gray-400">

                                Kode: ${
                                    barang.id ||
                                    "-"
                                }

                            </p>

                        </div>

                    </td>


                    <!-- USER -->

                    <td
                        class="px-6 py-4">

                        <div>

                            <p
                                class="font-medium
                                       text-gray-800">

                                ${
                                    user.nama ||
                                    "-"
                                }

                            </p>

                            <p
                                class="text-xs
                                       text-gray-400">

                                ${
                                    user.nim ||
                                    "-"
                                }

                            </p>

                        </div>

                    </td>


                    <!-- AKTIVITAS -->

                    <td
                        class="px-6 py-4">

                        ${badge}

                    </td>


                    <!-- DESKRIPSI -->

                    <td
                        class="px-6 py-4
                               text-gray-600
                               max-w-xl">

                        <p class="whitespace-normal">

                            ${
                                item.deskripsi ||
                                "-"
                            }

                        </p>

                    </td>


                </tr>

            `;

        }
    );

}


// =========================================================
// BADGE AKTIVITAS
// =========================================================

function getAktivitasBadge(aktivitas) {


    const value =
        String(
            aktivitas || ""
        )
        .trim()
        .toLowerCase();


    // =====================================================
    // BARANG MASUK
    // =====================================================

    if (
        value.includes("barang masuk") ||
        value.includes("masuk")
    ) {

        return `

            <span
                class="bg-green-100
                       text-green-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold
                       whitespace-nowrap">

                <i class="fas fa-arrow-down mr-1"></i>

                BARANG MASUK

            </span>

        `;

    }


    // =====================================================
    // BARANG KELUAR
    // =====================================================

    if (
        value.includes("barang keluar") ||
        value.includes("keluar")
    ) {

        return `

            <span
                class="bg-red-100
                       text-red-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold
                       whitespace-nowrap">

                <i class="fas fa-arrow-up mr-1"></i>

                BARANG KELUAR

            </span>

        `;

    }


    // =====================================================
    // PEMINJAMAN
    // =====================================================

    if (
        value.includes("peminjaman") ||
        value.includes("pinjam")
    ) {

        return `

            <span
                class="bg-blue-100
                       text-blue-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold
                       whitespace-nowrap">

                <i class="fas fa-handshake mr-1"></i>

                PEMINJAMAN

            </span>

        `;

    }


    // =====================================================
    // PENGEMBALIAN
    // =====================================================

    if (
        value.includes("pengembalian") ||
        value.includes("kembali")
    ) {

        return `

            <span
                class="bg-purple-100
                       text-purple-700
                       px-3
                       py-1
                       rounded-full
                       text-xs
                       font-semibold
                       whitespace-nowrap">

                <i class="fas fa-rotate-left mr-1"></i>

                PENGEMBALIAN

            </span>

        `;

    }


    // =====================================================
    // DEFAULT
    // =====================================================

    return `

        <span
            class="bg-gray-100
                   text-gray-700
                   px-3
                   py-1
                   rounded-full
                   text-xs
                   font-semibold
                   whitespace-nowrap">

            ${aktivitas || "AKTIVITAS"}

        </span>

    `;

}


// =========================================================
// FORMAT TANGGAL + WAKTU
// =========================================================

function formatTanggalWaktu(tanggal) {


    if (!tanggal) {

        return "-";

    }


    const date =
        new Date(
            tanggal
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleString(

        "id-ID",

        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }

    );

}


// =========================================================
// SEARCH
// =========================================================

function searchTable() {


    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    const keyword =
        input.value
            .toLowerCase()
            .trim();


    const rows =
        document.querySelectorAll(
            "#dataTable tr"
        );


    rows.forEach(
        row => {

            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(
                    keyword
                )
                    ? ""
                    : "none";

        }
    );

}


// =========================================================
// INIT
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAuditInventori();

    }
);