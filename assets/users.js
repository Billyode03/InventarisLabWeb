// ==========================
// LOAD DATA USER
// ==========================

const tableBody = document.getElementById("dataTable");

async function loadUsers() {

    const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .neq("role", "admin")
        .order("nama", { ascending: true });

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Gagal mengambil data user",
            "error"
        );

        return;
    }

    tableBody.innerHTML = "";


    // ==========================
    // CEK DATA KOSONG
    // ==========================

    if (data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    class="text-center py-8 text-gray-500">

                    Belum ada data user.

                </td>

            </tr>

        `;

        return;
    }


    // ==========================
    // TAMPILKAN DATA
    // ==========================

    data.forEach((user, index) => {

        tableBody.insertAdjacentHTML(
            "beforeend",
            `

            <tr class="table-row border-b">

                <td class="px-6 py-4 text-center">
                    ${index + 1}
                </td>

                <td class="px-6 py-4">
                    ${user.nama}
                </td>

                <td class="px-6 py-4">
                    ${user.nim}
                </td>

                <td class="px-6 py-4">
                    ${user.email}
                </td>

                <td class="px-6 py-4">

                    <span class="
                        px-3 py-1 rounded-full text-sm font-medium

                        ${
                            user.role === "kajur"
                                ? "bg-green-100 text-green-700"

                            : user.role === "mahasiswa"
                                ? "bg-yellow-100 text-yellow-700"

                            : "bg-gray-100 text-gray-700"
                        }

                    ">

                        ${user.role}

                    </span>

                </td>

                <td class="px-6 py-4">

                    <div class="flex justify-center gap-2">

                        <button
                            onclick="editUser('${user.id}')"
                            class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg">

                            <i class="fas fa-edit"></i>

                        </button>

                        <button
                            onclick="hapusUser('${user.id}')"
                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg">

                            <i class="fas fa-trash"></i>

                        </button>

                    </div>

                </td>

            </tr>

            `
        );

    });

}

// ==========================
// SEARCH
// ==========================

function searchTable() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        let text = rows[i].innerText.toLowerCase();

        rows[i].style.display = text.includes(input)
            ? ""
            : "none";

    }

}

// ==========================
// EDIT
// ==========================

function editUser(id) {

    window.location.href = `edit_user.html?id=${id}`;

}

// ==========================
// HAPUS
// ==========================

async function hapusUser(id) {

    const result = await Swal.fire({

        title: "Yakin?",
        text: "Data user akan dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus"

    });

    if (!result.isConfirmed) return;

    const { error } = await supabaseClient
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {

        Swal.fire(
            "Gagal",
            "Data tidak berhasil dihapus",
            "error"
        );

        return;

    }

    Swal.fire(
        "Berhasil",
        "Data user berhasil dihapus",
        "success"
    );

    loadUsers();

}

// ==========================
// LOAD PERTAMA
// ==========================

loadUsers();