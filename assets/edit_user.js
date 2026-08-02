// ==========================
// AMBIL ID DARI URL
// ==========================

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const formUser = document.getElementById("formUser");

// ==========================
// LOAD DATA USER
// ==========================

async function loadUser() {

    const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Data user tidak ditemukan",
            "error"
        ).then(() => {
            window.location.href = "users.html";
        });

        return;
    }

    // Isi form

    document.getElementById("nama").value = data.nama;
    document.getElementById("nim").value = data.nim;
    document.getElementById("email").value = data.email;
    document.getElementById("password").value = data.password;
    document.getElementById("role").value = data.role;

}

// ==========================
// UPDATE USER
// ==========================

formUser.addEventListener("submit", async function (e) {

    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // Validasi

    if (
        !nama ||
        !nim ||
        !email ||
        !password ||
        !role
    ) {

        Swal.fire(
            "Peringatan",
            "Semua data wajib diisi",
            "warning"
        );

        return;

    }

    // Update

    const { error } = await supabaseClient
        .from("users")
        .update({

            nama: nama,
            nim: nim,
            email: email,
            password: password,
            role: role

        })
        .eq("id", id);

    if (error) {

        console.error(error);

        Swal.fire(
            "Gagal",
            error.message,
            "error"
        );

        return;

    }

    Swal.fire({

        title: "Berhasil",
        text: "Data user berhasil diperbarui",
        icon: "success",
        confirmButtonColor: "#2563eb"

    }).then(() => {

        window.location.href = "users.html";

    });

});

// ==========================
// LOAD PERTAMA
// ==========================

loadUser();