// =========================================================
// AUTH GUARD
// =========================================================

(function () {

    // =====================================================
    // AMBIL SESSION
    // =====================================================

    const userRaw =
        localStorage.getItem("user");

    const isLoggedIn =
        localStorage.getItem("isLoggedIn");


    // =====================================================
    // CEK SESSION
    // =====================================================

    if (
        !userRaw ||
        isLoggedIn !== "true"
    ) {

        // Tidak login
        window.location.replace(
            getLoginPath()
        );

        return;
    }


    // =====================================================
    // VALIDASI DATA USER
    // =====================================================

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

        return;
    }


    // =====================================================
    // USER HARUS PUNYA DATA MINIMAL
    // =====================================================

    if (
        !user.id ||
        !user.role
    ) {

        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");


        window.location.replace(
            getLoginPath()
        );

        return;
    }


    // =====================================================
    // CEGAH CACHE HALAMAN
    // =====================================================

    window.addEventListener(
        "pageshow",
        function (event) {

            if (
                event.persisted
            ) {

                const masihLogin =
                    localStorage.getItem(
                        "isLoggedIn"
                    );


                const masihUser =
                    localStorage.getItem(
                        "user"
                    );


                if (
                    masihLogin !== "true" ||
                    !masihUser
                ) {

                    window.location.replace(
                        getLoginPath()
                    );

                }

            }

        }
    );


    // =====================================================
    // FUNGSI LOGIN PATH
    // =====================================================

    function getLoginPath() {

        const path =
            window.location.pathname;


        // Kalau halaman ada di /pages/
        if (
            path.includes("/pages/")
        ) {

            return "../login.html";

        }


        // Kalau halaman ada di /assets/
        if (
            path.includes("/assets/")
        ) {

            return "../login.html";

        }


        // Root
        return "login.html";

    }

})();