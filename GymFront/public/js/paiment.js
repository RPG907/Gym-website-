let profilePicture = document.getElementById("profile-picture");
let inputFile = document.getElementById("input-file");

document.querySelector(".card-number-input").oninput = () => {
  document.querySelector(".card-number-box").innerText =
    document.querySelector(".card-number-input").value;
};

document.querySelector(".card-holder-input").oninput = () => {
  document.querySelector(".card-holder-name").innerText =
    document.querySelector(".card-holder-input").value;
};

document.querySelector(".month-input").oninput = () => {
  document.querySelector(".exp-month").innerText =
    document.querySelector(".month-input").value;
};

document.querySelector(".year-input").oninput = () => {
  document.querySelector(".exp-year").innerText =
    document.querySelector(".year-input").value;
};

document.querySelector(".cvv-input").onmouseenter = () => {
  document.querySelector(".front").style.transform =
    "perspective(1000px) rotateY(-180deg)";
  document.querySelector(".back").style.transform =
    "perspective(1000px) rotateY(0deg)";
};

document.querySelector(".cvv-input").onmouseleave = () => {
  document.querySelector(".front").style.transform =
    "perspective(1000px) rotateY(0deg)";
  document.querySelector(".back").style.transform =
    "perspective(1000px) rotateY(180deg)";
};

document.querySelector(".cvv-input").oninput = () => {
  document.querySelector(".cvv-box").innerText =
    document.querySelector(".cvv-input").value;
};


// Section qui permet de saisir les information de la membershipType pour les apporters a 
// la page de paiement
document.addEventListener("DOMContentLoaded", async function () {
  const paymentForm = document.querySelector("form");  
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    alert("Veuillez vous connecter pour continuer.");
    window.location.href = "http://localhost:5000/login"
    //return;
  }

  try {
    const membershipResponse = await fetch(`http://localhost:5000/memberships`, {
      headers: { "Authorization": `Bearer ${userToken}` }
    });
    if (!membershipResponse.ok) {
      throw new Error("Failed to load membership details");
    }
    const membershipData = await membershipResponse.json();
    document.getElementById("membership-type").textContent = membershipData.membershipTypeName;
    document.getElementById("membership-price").textContent = membershipData.price;
    document.getElementById("membership-id").value = membershipData.membershipId; 
  } catch (error) {
    console.error("Failed to load membership details:", error);
    alert("Unable to load membership details.");
    
    return; 
  } 

  paymentForm.addEventListener("submit", async function (e) {
    e.preventDefault();    

    const paymentData = {     
      dateDePaiement: new Date().toISOString(),
      montantPayee: document.getElementById("membership-price").textContent,
      cardHolderName: document.querySelector(".card-holder-input").value,
      address: document.querySelector('input[type="address"]').value,
      postalCode: document.querySelector(
        '.card-holder-input[placeholder="J9H 0K3"]'
      ).value,
      province: document.querySelector(".province-input").value,
      cardNumber: document.querySelector(".card-number-input").value,
      expMonth: document.querySelector(".month-input").value,
      expYear: document.querySelector(".year-input").value,
      cvv: document.querySelector(".cvv-input").value,
    };

    try {
      const response = await fetch("http://localhost:5000/paiementMembership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Erreur de paiement : ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Payment success:", data);
      alert("Paiement effectué avec succès !");
      window.location.href = "/process-payment";
    } catch (error) {
      console.error("Payment error:", error);
      alert("Une erreur s'est produite lors du paiement: " + error.message);
    }
  });
});
