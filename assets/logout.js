// =========================================================
// LOGOUT
// =========================================================

async function logout() {

    const yakin = confirm(
        "Yakin ingin logout?"
    );

    if (!yakin) {
        return;
    }


    try {

        // =================================================
        // HAPUS SESSION LOCAL
        // =================================================

        localStorage.removeItem("user");

        localStorage.removeItem("isLoggedIn");


        // =================================================
        // HAPUS SESSION SUPABASE JIKA ADA
        // =================================================

        try {

            await supabaseClient.auth.signOut();

        } catch (error) {

            console.warn(
                "Supabase Auth tidak aktif:",
                error
            );

        }


        // =================================================
        // CEGAH HALAMAN LAMA DARI CACHE
        // =================================================

        window.location.replace(
            "../login.html"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        // =================================================
        // PASTIKAN SESSION TETAP DIHAPUS
        // =================================================

        localStorage.removeItem("user");

        localStorage.removeItem("isLoggedIn");


        window.location.replace(
            "login.html"
        );

    }

}