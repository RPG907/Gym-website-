const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  } else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return;
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

let mybutton = document.getElementById("myBtn");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

/* Events listener When the user clicks on the button*/

//Section pour la connection au backend pour s'abonner ou modifier une membership
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        alert("Veuillez vous connecter pour vous abonner.");
        window.location.href = "http://localhost:5000/forms#login"
      }

      const card = this.closest(".pricing-card");
      const membershipTypeId = card.getAttribute("data-membership-type-id");
      const planType = card.querySelector(".type").textContent;
      const price = card.querySelector(".price span").textContent;

      window.location.href = `/paiment?planType=${encodeURIComponent(
        planType
      )}&price=${encodeURIComponent(price)}`;

      const subscriptionData = {
        membership_type_id: membershipTypeId,
        membershipTypeName: planType,
        prixMembershipType: price,
      };

      console.log("Envoi de données au serveur:", subscriptionData);

      fetch("http://localhost:5000/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(subscriptionData),
      })
        .then((response) => {
          if (!response.ok) {
            response.json().then((data) => {
              console.log("Réponse serveur:", data);
              throw new Error(
                "Problème lors de la réponse réseau: " + data.message
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          alert("Inscription réussie: " + data.message);
          console.log("Button cliqué");
        })
        .catch((error) => {
          console.error("Erreur:", error);
          alert("Une erreur est survenue: " + error.message);
        });
    });
  });
});

//Section pour la connection au backend pour envoyer des messages des clients
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-input");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      nom_client: document.getElementById("fname").value,
      email_client: document.getElementById("femail").value,
      sujet_message: document.getElementById("subject").value,
    };

    fetch("http://localhost:5000/messageClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        response.json().then(data => {
          throw new Error(data.message || "Échec de l'envoi du message");
        });
      }
    })
    .then((data) => {
      console.log("Success:", data);
      displayFormFeedback("Message envoyé avec succès !");
      form.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      displayFormFeedback("Une erreur s'est produite lors de l'envoi du message.", false);
    });
  });
});

function displayFormFeedback(message, isSuccess = true){
  const feedbackElement = document.getElementById("formFeedback")
  feedbackElement.textContent = message;
  feedbackElement.style.color = isSuccess ? 'green' : 'red';  
}

