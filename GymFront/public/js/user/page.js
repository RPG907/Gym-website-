import { validationModifyDetails } from "./validationDetails.js";

let modifyDetailsButtons = document.getElementsByClassName("modifyUserDetails");
let modifyDetailsForm = document.getElementById("modifyDetailsForm");
let submitNewPersonalDetails = document.getElementById("submitNewDetails");
let succesMessage = document.getElementById("success-message");
let profilePicture = document.getElementById("profile-picture");
let inputFile = document.getElementById("input-file");
let isUserDataFetched = false;
let isMembershipDataInitialized = false;

// Ecouteur d'événements pour modifier les détails
for (let button of modifyDetailsButtons) {
  button.addEventListener("click", showFormToModifyDetails);
}

// Soumission des détails personnels
submitNewPersonalDetails.addEventListener("click", function (e) {
  e.preventDefault();
  const newUserInfo = collectUserInfo();

  if (validationModifyDetails(newUserInfo)) {
    updateUserData(newUserInfo);
  }
});

// Modifier la photo de profil
inputFile.onchange = function () {
  uploadProfilePicture();
};

//Section pour afficher dans le profil user les donnees fetcher dans la base de donnee
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("userToken");
  if (token) {  
    
    fetch("http://localhost:5000/utilisateurs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("User data not found");
          }
          throw new Error("Failed to fetch user data: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {        
        if (data.result && data.result.length > 0) {
          updateDOMWithUserData(data.result[0]);
          initializeMembershipData()
        } else {
          console.error("No user data received");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        document.getElementById("userAbonnement").textContent =
          "Erreur lors de la récupération des données";
        const userAbonnement = document.getElementById("userAbonnement");
        if (userAbonnement) {
          userAbonnement.textContent =
            "Erreur lors de la récupération des données";
        }
      });
  }
});

function formatAddress(
  appartment,
  street,
  city,
  province,
  postalCode,
  country
) {
  return [appartment, street, city, province, postalCode, country]
    .filter((part) => part)
    .join(", ");
}

// Section pour fetcher les informations personnels de la base de donnee
function updateDOMWithUserData(userData) {
  console.log("Updating DOM with user data:", userData);

  // Détails utilisateurs et update du DOM
  const userFirstName = document.getElementById("userFirstName");
  userFirstName.textContent = userData.first_name || "Non spécifié";
  const userLastName = document.getElementById("userLastName");
  userLastName.textContent = userData.last_name || "Non spécifié";
  const userEmail = document.getElementById("userEmail");
  userEmail.textContent = userData.email || "Non spécifié";
  const userPhone = document.getElementById("userPhone");
  userPhone.textContent = userData.phone_number || "Non spécifié";
  const userAddress = document.getElementById("userAddress");
  userAddress.textContent = formatAddress(
    userData.appartment,
    userData.street,
    userData.city,
    userData.province,
    userData.postal_code,
    userData.country
  );
  const userName = document.querySelector(".userName");
  userName.textContent = `${userData.first_name || "Non spécifié"} ${
    userData.last_name || "Non spécifié"
  }`;
  // Gestion de l'affichage de la membership
  const userAbonnement = document.getElementById("userAbonnement");
  userAbonnement.textContent =
    userData.membershipTypeName || "Aucun abonnement";
    
  // Mise à jour et gestion du type d'abonnement
  const membershipType = userData.membershipTypeName
    ? userData.membershipTypeName.toLowerCase().trim()
    : "aucun";
  userAbonnement.textContent =
    membershipType === "aucun" ? "aucun" : userData.membershipTypeName;
 
  if (["platinium", "golden"].includes(membershipType)) {
    upgradeMessage.style.display = "none";
  } else {
    upgradeMessage.style.display = "block";
  }

  if (membershipType === "aucun") {    
    displayServices([]); 
  } else {    
    initializeMembershipData();
  }
}

async function fetchUserDataAndInitialize(token) {
  try {
    const userData = await fetchUserData(token);
    updateDOMWithUserData(userData);
    initializeMembershipData();
  } catch (error) {
    console.error("Failed to fetch user data", error);
    document.getElementById("userAbonnement").textContent = "Erreur lors de la récupération des données";
  }
}

async function fetchUserData(token) {
  const response = await fetch("http://localhost:5000/utilisateurs", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch user data: " + response.statusText);
  const data = await response.json();
  return data.result[0];
}

// Cherche les services offert d'une membershipType 
async function initializeMembershipData() {
  if (!isMembershipDataInitialized) {
    try {
      const types = await chercherMembershipType();
      if (Array.isArray(types)) {
        await Promise.all(types.map(type => fetchAndDisplayServicesForType(type.type_id)));
        isMembershipDataInitialized = true;
      } else {
        console.error('Expected an array of types, received:', types);
      }
    } catch (error) {
      console.error("Failed to initialize membership data:", error);
    }
  }
}

// Chercher les types de membership qu'il y a dans la base de donnee
async function chercherMembershipType() {  
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch("http://localhost:5000/membershipType", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch membership types: ' + response.statusText);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {    
    throw error;
  }
}

// Chercher les services offert pour les membershipType qu'il y a dans la base de donnee
async function chercherServiceMembership(typeId) {
  const token = localStorage.getItem('userToken');
  const response = await fetch(`http://localhost:5000/serviceMembership/${typeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch services for membership type ${typeId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.result;
}

// Afficher les services fetcher dans la section avantage de la page user
function displayServices(services) {
  const servicesContainer = document.querySelector('.current-membership ul');
  servicesContainer.innerHTML = '';

  if (services && services.length > 0) {
    services.forEach(service => {
      const li = document.createElement('li');
      li.textContent = service.service_name;
      servicesContainer.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Aucun service disponible';
    servicesContainer.appendChild(li);
  }
}

// Fetcher et afficher les services dependant du membershipType
async function fetchAndDisplayServicesForType(typeId) {
  try {
    const services = await chercherServiceMembership(typeId);
    if (services) {
      displayServices(services);
    }
  } catch (error) {
    displayServices([]);
  }
}

// Saisie les nouvelles donnees du formulaire de l'utilisateur
function collectUserInfo() {
  return {
    name: document.getElementById("name").value,
    firstName: document.getElementById("firstName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    oldPassword: document.getElementById("oldPassword").value,
    newPassword: document.getElementById("newPassword").value,
    street: document.getElementById("street").value,
    appartment: document.getElementById("appartment").value,
    province: document.getElementById("province").value,
    city: document.getElementById("city").value,
    countryCode: document.getElementById("countryCode").value,
    country: document.getElementById("country").value,
  };
}

// Affiche la form pour modifier les donnees de l'utilisateur
function showFormToModifyDetails() {
  modifyDetailsForm.style.display = "flex";
  succesMessage.style.display = "none";
  modifyDetailsForm.scrollIntoView({ behavior: "smooth" });
}

// Section pour gerer la modification des informations personnels du profil user
function updateUserData(userData) {
  const token = localStorage.getItem("userToken");
  if (!token) {
    console.error("Token not found");
    return;
  }
  console.log("Sending update data:", JSON.stringify(userData));
  fetch("http://localhost:5000/utilisateurs", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch, status: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      succesMessage.style.display = "block";
      succesMessage.textContent =
        "Vos informations ont été mises à jour avec succès.";
      modifyDetailsForm.style.display = "none";
    })
    .catch((error) => {
      console.error("Error updating user data:", error);
    });
}

// Section pour gerer la modification de la photo du profil user
function uploadProfilePicture() {
  const file = inputFile.files[0];
  if (file) {
    profilePicture.src = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("profilePicture", file);

    fetch("http://localhost:5000/utilisateurs", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Photo uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }
}
