// =========================================================
// AUTH GUARD
// =========================================================

(function () {

    // =====================================================
    // FUNGSI LOGIN PATH
    // =====================================================

    function getLoginPath() {

        const path =
            window.location.pathname;


        if (
            path.includes("/pages/")
        ) {

            return "../login.html";

        }


        if (
            path.includes("/assets/")
        ) {

            return "../login.html";

        }


        return "login.html";

    }


    // =====================================================
    // FUNGSI CEK SESSION
    // =====================================================

    function checkSession() {

        const userRaw =
            localStorage.getItem("user");

        const isLoggedIn =
            localStorage.getItem("isLoggedIn");


        console.log(
            "AUTH CHECK:",
            window.location.pathname,
            localStorage.getItem("isLoggedIn"),
            localStorage.getItem("user")
        );


        // ================================================
        // SESSION TIDAK ADA
        // ================================================

        if (
            !userRaw ||
            isLoggedIn !== "true"
        ) {

            window.location.replace(
                getLoginPath()
            );

            return false;
        }


        // ================================================
        // VALIDASI JSON USER
        // ================================================

        let user;

        try {

            user =
                JSON.parse(userRaw);

        } catch (error) {

            console.error(
                "Session user rusak:",
                error
            );


            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");


            window.location.replace(
                getLoginPath()
            );

            return false;
        }


        // ================================================
        // USER HARUS PUNYA DATA MINIMAL
        // ================================================

        if (
            !user.id ||
            !user.role
        ) {

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");


            window.location.replace(
                getLoginPath()
            );

            return false;
        }


        return true;

    }


    // =====================================================
    // CEK SAAT SCRIPT DIBACA
    // =====================================================

    if (
        !checkSession()
    ) {

        return;

    }


    // =====================================================
    // CEK SAAT HALAMAN KEMBALI DARI BACK/FORWARD
    // =====================================================

    window.addEventListener(
        "pageshow",
        function () {

            checkSession();

        }
    );


    // =====================================================
    // CEGAH HALAMAN DIPERTAHANKAN BROWSER
    // =====================================================

    window.addEventListener(
        "beforeunload",
        function () {

            // Event ini sengaja dipasang
            // untuk membantu browser tidak
            // mempertahankan halaman protected.

        }
    );

})();