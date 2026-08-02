// ==========================
// TAMBAH USER
// ==========================


const formUser = document.getElementById("formUser");


formUser.addEventListener("submit", async function(e){

    e.preventDefault();



    // Ambil value form

    const nama = document.getElementById("nama").value.trim();

    const nim = document.getElementById("nim").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const role = document.getElementById("role").value;



    // ==========================
    // VALIDASI
    // ==========================


    if(
        !nama ||
        !nim ||
        !email ||
        !password ||
        !role
    ){

        Swal.fire(
            "Peringatan",
            "Semua data user wajib diisi",
            "warning"
        );

        return;

    }




    // ==========================
    // INSERT SUPABASE
    // ==========================


    const { data, error } = await supabaseClient
    .from("users")
    .insert([{

        nama: nama,
        nim: nim,
        email: email,
        password: password,
        role: role

    }]);




    if(error){

        console.error(error);


        Swal.fire(
            "Gagal",
            error.message,
            "error"
        );


        return;

    }




    // ==========================
    // SUCCESS
    // ==========================


    Swal.fire({

        title: "Berhasil",

        text: "User berhasil ditambahkan",

        icon: "success",

        confirmButtonColor:"#2563eb"

    })
    .then(()=>{

        window.location.href="users.html";

    });



});