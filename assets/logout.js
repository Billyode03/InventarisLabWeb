// =========================================================
// LOGOUT
// =========================================================

async function logout() {

    const yakin = confirm("Yakin ingin logout?");

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
        // SUPABASE AUTH JIKA ADA
        // =================================================

        if (
            typeof supabaseClient !== "undefined" &&
            supabaseClient?.auth
        ) {

            try {

                await supabaseClient.auth.signOut();

            } catch (error) {

                console.warn(
                    "Supabase Auth tidak aktif:",
                    error
                );

            }

        }


        // =================================================
        // REDIRECT KE LOGIN
        // =================================================

        if (
            window.location.pathname.includes("/pages/")
        ) {

            // Jika sedang berada di folder pages
            window.location.href =
                "../login.html";

        } else {

            // Jika sedang berada di root
            window.location.href =
                "login.html";

        }


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        // =================================================
        // PASTIKAN SESSION DIHAPUS
        // =================================================

        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");


        // =================================================
        // REDIRECT
        // =================================================

        if (
            window.location.pathname.includes("/pages/")
        ) {

            window.location.href =
                "../login.html";

        } else {

            window.location.href =
                "login.html";

        }

    }

}