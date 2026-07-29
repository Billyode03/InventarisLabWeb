const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const button = form.querySelector("button");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  errorEl.classList.add("hidden");

  const nim = document.getElementById("nim").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nim || !password) {
    errorEl.textContent = "NIM dan Password wajib diisi";
    errorEl.classList.remove("hidden");
    return;
  }

  button.disabled = true;
  button.innerText = "Loading...";

  try {
    console.log("NIM INPUT :", nim);

    // ==========================
    // Cari user berdasarkan NIM
    // ==========================
    const { data, error } = await supabaseClient
      .from("users")
      .select("*")
      .eq("nim", nim);

    console.log("DATA :", data);
    console.log("ERROR :", error);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("NIM tidak ditemukan");
    }

    const user = data[0];

    console.log("USER :", user);

    // ==========================
    // Login menggunakan Supabase Auth
    // ==========================
    const { error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

    if (authError) {
      console.error("AUTH ERROR:", authError);
      throw new Error(authError.message);
    }

    // ==========================
    // Pastikan session aktif
    // ==========================
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    console.log("SESSION :", session);

    if (!session) {
      throw new Error("Session login gagal dibuat");
    }

    // ==========================
    // Simpan user ke localStorage
    // ==========================
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        nama: user.nama,
        nim: user.nim,
        email: user.email,
        role: user.role,
      })
    );

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);

    errorEl.textContent = err.message || "Terjadi kesalahan";
    errorEl.classList.remove("hidden");

  } finally {
    button.disabled = false;
    button.innerText = "Log In";
  }
});



