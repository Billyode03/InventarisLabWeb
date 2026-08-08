// ==============================
// BARANG.JS
// ==============================

const tbody = document.getElementById("dataTable");

// ==============================
// USER / ROLE
// ==============================

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


// ==============================
// ROLE LOGIN
// ==============================

const currentUser = getCurrentUser();

const currentRole =
    String(currentUser?.role || "")
        .trim()
        .toLowerCase();

        // ==============================
// ATUR HAK AKSES HALAMAN
// ==============================

function aturHakAkses() {

    const btnTambah =
        document.getElementById("btnTambahBarang");


    // ==========================
    // ADMIN
    // ==========================

    if (currentRole === "admin") {

        if (btnTambah) {
            btnTambah.classList.remove("hidden");
        }

    }


    // ==========================
    // KAJUR
    // ==========================

    if (
        currentRole === "kajur" ||
        currentRole === "ketua jurusan"
    ) {

        // Sembunyikan tombol tambah

        if (btnTambah) {
            btnTambah.classList.add("hidden");
        }

    }


    // ==========================
    // NAMA USER
    // ==========================

    const sidebarNama =
        document.getElementById("sidebarNama");

    const headerNama =
        document.getElementById("headerNama");

    const headerRole =
        document.getElementById("headerRole");


    if (sidebarNama) {

        sidebarNama.textContent =
            currentUser?.nama || "-";

    }


    if (headerNama) {

        headerNama.textContent =
            currentUser?.nama || "-";

    }


    if (headerRole) {

        if (currentRole === "admin") {

            headerRole.textContent = "Admin";

        } else if (
            currentRole === "kajur" ||
            currentRole === "ketua jurusan"
        ) {

            headerRole.textContent = "Ketua Jurusan";

        } else {

            headerRole.textContent =
                currentUser?.role || "-";

        }

    }

}



console.log("USER LOGIN :", currentUser);
console.log("ROLE LOGIN :", currentRole);


// ==============================
// LOAD DATA
// ==============================

aturHakAkses();
loadBarang();


// ==============================
// LOAD BARANG
// ==============================

async function loadBarang() {

    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="py-16 text-center text-gray-500">

                <i class="fas fa-spinner fa-spin text-4xl mb-3"></i>

                <p>
                    Memuat data barang...
                </p>

            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient

            .from("barang")

            .select("*")

            .order("id", {
                ascending: true
            });


    console.log("DATA BARANG :", data);
    console.log("ERROR BARANG :", error);


    // ==============================
    // ERROR
    // ==============================

    if (error) {

        console.error(error);


        tbody.innerHTML = `
            <tr>

                <td colspan="9">

                    <div class="flex flex-col items-center py-16">

                        <i class="fas fa-triangle-exclamation text-red-500 text-6xl mb-5"></i>

                        <h2 class="text-xl font-semibold mb-2">
                            Gagal mengambil data
                        </h2>

                        <p class="text-gray-500 mb-5">
                            Periksa koneksi atau Supabase Anda.
                        </p>

                        <button
                            onclick="loadBarang()"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">

                            Coba Lagi

                        </button>

                    </div>

                </td>

            </tr>
        `;

        return;

    }


    // ==============================
    // DATA KOSONG
    // ==============================

    if (!data || data.length === 0) {

        tbody.innerHTML = `
            <tr>

                <td colspan="9">

                    <div class="flex flex-col items-center py-20">

                        <i class="fas fa-box-open text-gray-300 text-7xl mb-5"></i>

                        <h2 class="text-xl font-semibold text-gray-700">
                            Belum ada barang
                        </h2>

                        <p class="text-gray-500 mt-2">
                            Belum ada data barang.
                        </p>

                    </div>

                </td>

            </tr>
        `;

        return;

    }


    // ==============================
    // RENDER
    // ==============================

    tbody.innerHTML = "";


    data.forEach((item, index) => {

        let badge = "";


        // ==========================
        // KONDISI
        // ==========================

        switch (item.kondisi) {

            case "Baru":

                badge = `
                    <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        BARU
                    </span>
                `;

                break;


            case "Bagus":

                badge = `
                    <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                        BAGUS
                    </span>
                `;

                break;


            case "Rusak Ringan":

                badge = `
                    <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                        RUSAK RINGAN
                    </span>
                `;

                break;


            default:

                badge = `
                    <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                        RUSAK BERAT
                    </span>
                `;

        }


        // ==========================
        // TOMBOL AKSI
        // ==========================

        let tombolAksi = `

            <!-- DETAIL -->

            <button
                onclick="detailBarang(${item.id})"
                class="text-amber-500 hover:text-amber-700"
                title="Detail">

                <i class="fas fa-eye"></i>

            </button>

        `;


        // ==========================
        // ADMIN SAJA
        // ==========================

        if (currentRole === "admin") {

            tombolAksi += `

                <!-- EDIT -->

                <button
                    onclick="editBarang(${item.id})"
                    class="text-blue-500 hover:text-blue-700"
                    title="Edit">

                    <i class="fas fa-edit"></i>

                </button>


                <!-- HAPUS -->

                <button
                    onclick="hapusBarang(${item.id})"
                    class="text-red-500 hover:text-red-700"
                    title="Hapus">

                    <i class="fas fa-trash"></i>

                </button>

            `;

        }

        


        // ==========================
        // RENDER ROW
        // ==========================

        tbody.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <!-- NO -->

                <td class="px-6 py-4">
                    ${index + 1}
                </td>


                <!-- NAMA -->

                <td class="px-6 py-4 font-medium">
                    ${item.nama || "-"}
                </td>


                <!-- SPESIFIKASI -->

                <td class="px-6 py-4">
                    ${item.spesifikasi || "-"}
                </td>


                <!-- LOKASI -->

                <td class="px-6 py-4">
                    ${item.lokasi || "-"}
                </td>


                <!-- KONDISI -->

                <td class="px-6 py-4">
                    ${badge}
                </td>


                <!-- JUMLAH -->

                <td class="px-6 py-4">
                    ${item.jumlah ?? 0}
                </td>


                <!-- JENIS -->

                <td class="px-6 py-4">
                    ${item.jenis || "-"}
                </td>


                <!-- KETERANGAN -->

                <td class="px-6 py-4">
                    ${item.keterangan || "-"}
                </td>


                <!-- AKSI -->

                <td class="px-6 py-4">

                    <div class="flex justify-center gap-3">

                        ${tombolAksi}

                    </div>

                </td>

            </tr>

        `;

    });

}


// ==============================
// DETAIL BARANG
// ==============================

function detailBarang(id) {

    window.location.href =
        `detail_barang.html?id=${id}`;

}


// ==============================
// SEARCH
// ==============================

function searchTable() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const rows =
        tbody.querySelectorAll("tr");


    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

}


// ==============================
// EDIT
// ==============================

function editBarang(id) {

    // ADMIN SAJA

    if (currentRole !== "admin") {

        Swal.fire({

            icon: "warning",

            title: "Akses Ditolak",

            text:
                "Anda tidak memiliki akses untuk mengedit barang."

        });

        return;

    }


    window.location.href =
        `edit_barang.html?id=${id}`;

}


// ==============================
// HAPUS
// ==============================

async function hapusBarang(id) {

    // ADMIN SAJA

    if (currentRole !== "admin") {

        Swal.fire({

            icon: "warning",

            title: "Akses Ditolak",

            text:
                "Anda tidak memiliki akses untuk menghapus barang."

        });

        return;

    }


    const result =
        await Swal.fire({

            title: "Hapus Barang?",

            text:
                "Data yang dihapus tidak dapat dikembalikan.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#6b7280",

            confirmButtonText: "Ya, Hapus",

            cancelButtonText: "Batal"

        });


    if (!result.isConfirmed) {
        return;
    }


    const { error } =
        await supabaseClient

            .from("barang")

            .delete()

            .eq("id", id);


    if (error) {

        console.error(error);


        Swal.fire({

            icon: "error",

            title: "Gagal",

            text:
                "Data gagal dihapus."

        });

        return;

    }


    await Swal.fire({

        icon: "success",

        title: "Berhasil",

        text:
            "Data berhasil dihapus.",

        timer: 1500,

        showConfirmButton: false

    });


    loadBarang();

}