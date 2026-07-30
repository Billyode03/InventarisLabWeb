const tbody = document.getElementById("dataTable");

loadBarang();

// ==============================
// LOAD DATA
// ==============================
async function loadBarang() {
  // Loading
  tbody.innerHTML = `
        <tr>
            <td colspan="9" class="py-16 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-4xl mb-3"></i>
                <p>Memuat data barang...</p>
            </td>
        </tr>
    `;

  const { data, error } = await supabaseClient
    .from("barang")
    .select("*")
    .order("id", { ascending: true });

  console.log(data);
  console.log(error);

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
  if (data.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="9">

                    <div class="flex flex-col items-center py-20">

                        <i class="fas fa-box-open text-gray-300 text-7xl mb-5"></i>

                        <h2 class="text-xl font-semibold text-gray-700">
                            Belum ada barang
                        </h2>

                        <p class="text-gray-500 mt-2">
                            Silakan tambahkan data barang terlebih dahulu.
                        </p>

                    </div>

                </td>
            </tr>
        `;

    return;
  }

  // ==============================
  // RENDER DATA
  // ==============================

  tbody.innerHTML = "";

  data.forEach((item, index) => {
    let badge = "";

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

    tbody.innerHTML += `
<tr>

    <td class="px-6 py-4">
        ${index + 1}
    </td>

    <td class="px-6 py-4 font-medium">
        ${item.nama}
    </td>

    <td class="px-6 py-4">
        ${item.spesifikasi}
    </td>

    <td class="px-6 py-4">
        ${item.lokasi}
    </td>

    <td class="px-6 py-4">
        ${badge}
    </td>

    <td class="px-6 py-4">
        ${item.jumlah}
    </td>

    <td class="px-6 py-4">
        ${item.jenis}
    </td>

    <td class="px-6 py-4">
        ${item.keterangan || "-"}
    </td>

    <td class="px-6 py-4">

        <div class="flex justify-center gap-2">

            <button
                class="text-amber-500 hover:text-amber-700"
                title="Detail">
                <i class="fas fa-eye"></i>
            </button>

            <button
                onclick="editBarang(${item.id})"
                class="text-blue-500 hover:text-blue-700"
                title="Edit">
                <i class="fas fa-edit"></i>
            </button>

           <button
                onclick="hapusBarang(${item.id})"
                class="text-red-500 hover:text-red-700"
                title="Hapus">
                <i class="fas fa-trash"></i>
        </button>

        </div>

    </td>

</tr>
`;
  });
}

// ==============================
// SEARCH
// ==============================

function searchTable() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const rows = tbody.querySelectorAll("tr");

  rows.forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(keyword)
      ? ""
      : "none";
  });
}

function editBarang(id) {
  window.location.href = `edit_barang.html?id=${id}`;
}


async function hapusBarang(id) {

    const result = await Swal.fire({

        title: "Hapus Barang?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",

        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"

    });

    if (!result.isConfirmed) return;

    const { error } = await supabaseClient
        .from("barang")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Data gagal dihapus."
        });

        return;
    }

    Swal.fire({

        icon: "success",
        title: "Berhasil",
        text: "Data berhasil dihapus.",
        timer: 1500,
        showConfirmButton: false

    });

    tbody.innerHTML = "";

    loadBarang();

}