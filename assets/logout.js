async function logout() {

    const yakin = confirm("Yakin ingin logout?");

    if (!yakin) return;

    try {

        // Logout dari Supabase Auth
        await supabaseClient.auth.signOut();

        // Hapus data user yang tersimpan
        localStorage.removeItem("user");

        // Bersihkan session tambahan kalau ada
        localStorage.removeItem("supabase.auth.token");

        // Kembali ke halaman login
        window.location.href = "login.html";

    } catch (error) {

        console.error("Logout error:", error);

        // Tetap hapus user lokal
        localStorage.removeItem("user");

        window.location.href = "../login.html";

    }

}