const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const button = form.querySelector("button");

form.addEventListener("submit", async function (e) {

e.preventDefault();

errorEl.classList.add("hidden");

const nim =
    document.getElementById("nim").value.trim();

const password =
    document.getElementById("password").value.trim();


// ==========================================
// VALIDASI
// ==========================================

if (!nim || !password) {

    errorEl.textContent =
        "NIM dan Password wajib diisi.";

    errorEl.classList.remove("hidden");

    return;
}


button.disabled = true;
button.innerText = "Loading...";


try {

    console.log("================================");
    console.log("LOGIN DIMULAI");
    console.log("NIM :", nim);
    console.log("================================");


    // ==========================================
    // CARI USER BERDASARKAN NIM
    // ==========================================

    const {
        data,
        error
    } = await supabaseClient

        .from("users")

        .select("*")

        .eq("nim", nim)

        .limit(1);


    console.log("DATA :", data);
    console.log("ERROR :", error);


    if (error) {
        throw error;
    }


    // ==========================================
    // NIM TIDAK DITEMUKAN
    // ==========================================

    if (!data || data.length === 0) {

        throw new Error(
            "NIM tidak ditemukan."
        );
    }


    const user = data[0];


    console.log("USER :", user);


    // ==========================================
    // CEK PASSWORD DARI TABLE USERS
    // ==========================================

    if (
        String(user.password) !==
        String(password)
    ) {

        throw new Error(
            "Password salah."
        );
    }


    console.log(
        "PASSWORD BENAR"
    );


    // ==========================================
    // NORMALISASI ROLE
    // ==========================================

    const role =
        String(user.role || "")
            .trim()
            .toLowerCase();


    console.log(
        "ROLE LOGIN :",
        role
    );


    // ==========================================
    // SIMPAN USER KE LOCAL STORAGE
    // ==========================================

    localStorage.setItem(
        "user",
        JSON.stringify({

            id: user.id,

            nama: user.nama,

            nim: user.nim,

            email: user.email || "",

            role: role

        })
    );


    // ==========================================
    // FLAG LOGIN
    // ==========================================

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );


    console.log(
        "USER BERHASIL DISIMPAN"
    );


    // ==========================================
    // REDIRECT BERDASARKAN ROLE
    // ==========================================


    // ADMIN
    if (role === "admin") {

        console.log(
            "REDIRECT → ADMIN"
        );

        window.location.href =
            "dashboard.html";

        return;
    }


    // KAJUR
    if (
        role === "kajur" ||
        role === "ketua jurusan"
    ) {

        console.log(
            "REDIRECT → KAJUR"
        );

        window.location.href =
            "kajur_dashboard.html";

        return;
    }


    // MAHASISWA
    if (role === "mahasiswa") {

        console.log(
            "REDIRECT → MAHASISWA"
        );

        window.location.href =
            "dashboard_mahasiswa.html";

        return;
    }


    // ==========================================
    // ROLE TIDAK DIKENAL
    // ==========================================

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );


    throw new Error(
        "Role pengguna tidak dikenali."
    );


} catch (err) {

    console.error(
        "LOGIN ERROR :",
        err
    );


    errorEl.textContent =
        err.message ||
        "Terjadi kesalahan saat login.";


    errorEl.classList.remove(
        "hidden"
    );


} finally {

    button.disabled = false;

    button.innerText =
        "Log In";

}


});
