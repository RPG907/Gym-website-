var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");
function login() {
  x.style.left = "4px";
  y.style.right = "-520px";
  a.className += " white-btn";
  b.className = "btn";
  x.style.opacity = 1;
  y.style.opacity = 0;
}
function register() {
  x.style.left = "-510px";
  y.style.right = "5px";
  a.className = "btn";
  b.className += " white-btn";
  x.style.opacity = 0;
  y.style.opacity = 1;
}

// Section pour gerer la connexion utilisateur 
document.addEventListener("DOMContentLoaded", function () {  
  const Login = document.getElementById("connexion");
  Login.addEventListener("click", function (e) {
    e.preventDefault();

    const loginData = {
      email: document.getElementById("LEmail").value,
      motPasse: document.getElementById("LPassword").value,
    };
   
    fetch("http://localhost:5000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La réponse réseau n\'est pas correct ' + response.statusText);
      }
      return response.json();
    })
      .then((data) => {
        if(data.token){
          localStorage.setItem("userToken", data.token);
          window.location.href = "/user"                  
        }else {
          alert("Erreur de connexion: " + data.message);
          throw new Error('L\'authentication à failli: ' + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("button is working");
  });

  // Section pour gerer la creation du compte utilisateur
  const Registrer = document.getElementById("Register");
  Registrer.addEventListener("click", function (e) {
    e.preventDefault();
    const prenom = document.getElementById("RPrenom").value;
    const nom = document.getElementById("RNom").value;
    const email = document.getElementById("REmail").value;
    const numeroTelephone = document.getElementById("Rtel").value;
    const password = document.getElementById("RPassword").value;
    const confirmPassword = document.getElementById("RcPassword").value;

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      console.log('Les mots de passe ne correspondent pas.');
      return;
    }

    const signupData = {
      prenom,
      nom,
      email,
      numeroTelephone,
      motPasse: password
    };

    fetch("http://localhost:5000/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    })
    .then(async response => {
      if (!response.ok) {
        try {
          const data = await response.json();
          throw new Error('Erreur du serveur : ' + (data.message || response.statusText));
        } catch (jsonError) {
          throw new Error(response.statusText);
        }
      }
      return response.json();
    })
    .then(data => {
      if (data.message === "L'utilisateur a été créé avec succès.") {
        window.location.href = "/forms#login";
      } else {
        alert(data.message || "Erreur lors de l'inscription.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Une erreur est survenue: " + error.message);
    });
  });
});
