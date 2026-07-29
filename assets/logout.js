async function logout() {

    const yakin = confirm("Yakin ingin logout?");

    if (!yakin) return;

    await supabaseClient.auth.signOut();

    localStorage.removeItem("user");

    window.location.href = "login.html";
}