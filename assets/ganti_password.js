
// =========================================================
// GANTI_PASSWORD.JS
//
// ROLE:
// - ADMIN      : Bisa ganti password
// - KAJUR      : Bisa ganti password
// - MAHASISWA  : Bisa ganti password
// =========================================================


// =========================================================
// ELEMENT
// =========================================================

const form =
    document.getElementById("formGantiPassword");

const passwordLama =
    document.getElementById("passwordLama");

const passwordBaru =
    document.getElementById("passwordBaru");

const konfirmasiPassword =
    document.getElementById("konfirmasiPassword");


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


// =========================================================
// CEK USER
// =========================================================

if (
    !currentUser ||
    !currentUser.id
) {

    Swal.fire({

        icon: "error",

        title: "Sesi Tidak Ditemukan",

        text:
            "Silakan login kembali."

    }).then(() => {

        window.location.href =
            "../index.html";

    });

}


// =========================================================
// TAMPILKAN INFORMASI AKUN
// =========================================================

const infoUser =
    document.getElementById("infoUser");

const infoRole =
    document.getElementById("infoRole");


if (infoUser) {

    infoUser.textContent =
        currentUser.nama || "-";

}


if (infoRole) {

    const role =
        String(
            currentUser.role || ""
        )
        .trim()
        .toLowerCase();


    if (role === "admin") {

        infoRole.textContent =
            "Administrator";

    }

    else if (
        role === "kajur" ||
        role === "ketua jurusan"
    ) {

        infoRole.textContent =
            "Ketua Jurusan";

    }

    else if (
        role === "mahasiswa"
    ) {

        infoRole.textContent =
            "Mahasiswa";

    }

    else {

        infoRole.textContent =
            currentUser.role || "-";

    }

}


// =========================================================
// SUBMIT FORM
// =========================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // =============================================
            // AMBIL INPUT
            // =============================================

            const lama =
                passwordLama.value.trim();

            const baru =
                passwordBaru.value.trim();

            const konfirmasi =
                konfirmasiPassword.value.trim();


            // =============================================
            // VALIDASI
            // =============================================

            if (!lama) {

                Swal.fire({

                    icon: "warning",

                    title: "Password Lama Kosong",

                    text:
                        "Masukkan password lama terlebih dahulu."

                });

                return;
            }


            if (!baru) {

                Swal.fire({

                    icon: "warning",

                    title: "Password Baru Kosong",

                    text:
                        "Masukkan password baru."

                });

                return;
            }


            if (baru.length < 8) {

                Swal.fire({

                    icon: "warning",

                    title: "Password Terlalu Pendek",

                    text:
                        "Password baru minimal 8 karakter."

                });

                return;
            }


            if (baru !== konfirmasi) {

                Swal.fire({

                    icon: "warning",

                    title: "Konfirmasi Tidak Cocok",

                    text:
                        "Password baru dan konfirmasi password harus sama."

                });

                return;
            }


            if (lama === baru) {

                Swal.fire({

                    icon: "warning",

                    title: "Password Sama",

                    text:
                        "Password baru harus berbeda dari password lama."

                });

                return;
            }


            // =============================================
            // LOADING
            // =============================================

            const result =
                await Swal.fire({

                    title:
                        "Memproses...",

                    text:
                        "Sedang memeriksa password.",

                    allowOutsideClick:
                        false,

                    didOpen: () => {

                        Swal.showLoading();

                    }

                });


            // =============================================
            // AMBIL USER DARI DATABASE
            // =============================================

            const {
                data: userData,
                error: userError
            } = await supabaseClient

                .from("users")

                .select(`
                    id,
                    nama,
                    nim,
                    role,
                    password
                `)

                .eq(
                    "id",
                    currentUser.id
                )

                .single();


            Swal.close();


            if (
                userError ||
                !userData
            ) {

                console.error(
                    userError
                );

                Swal.fire({

                    icon: "error",

                    title: "Gagal",

                    text:
                        "Data akun tidak ditemukan."

                });

                return;
            }


            // =============================================
            // CEK PASSWORD LAMA
            // =============================================

            if (
                userData.password !== lama
            ) {

                Swal.fire({

                    icon: "error",

                    title: "Password Lama Salah",

                    text:
                        "Password lama yang Anda masukkan tidak benar."

                });

                return;
            }


            // =============================================
            // KONFIRMASI
            // =============================================

            const confirm =
                await Swal.fire({

                    title:
                        "Simpan Password Baru?",

                    text:
                        "Password akun Anda akan diperbarui.",

                    icon:
                        "question",

                    showCancelButton:
                        true,

                    confirmButtonColor:
                        "#2563eb",

                    cancelButtonColor:
                        "#6b7280",

                    confirmButtonText:
                        "Ya, Simpan",

                    cancelButtonText:
                        "Batal"

                });


            if (
                !confirm.isConfirmed
            ) {

                return;
            }


            // =============================================
            // UPDATE PASSWORD
            // =============================================

            const {
                error: updateError
            } = await supabaseClient

                .from("users")

                .update({

                    password:
                        baru

                })

                .eq(
                    "id",
                    currentUser.id
                );


            if (updateError) {

                console.error(
                    updateError
                );

                Swal.fire({

                    icon: "error",

                    title: "Gagal Mengubah Password",

                    text:
                        updateError.message

                });

                return;
            }


            // =============================================
            // BERHASIL
            // =============================================

            await Swal.fire({

                icon:
                    "success",

                title:
                    "Password Berhasil Diubah",

                text:
                    "Password akun Anda telah diperbarui.",

                timer:
                    1800,

                showConfirmButton:
                    false

            });


            // =============================================
            // RESET FORM
            // =============================================

            form.reset();

        }
    );

}

