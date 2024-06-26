import "dotenv/config";
import express, { json } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { engine } from "express-handlebars";
import bcrypt from "bcryptjs";
import { getUtilisateur } from "../GymBack/controlleurs/utilisateurs.js";

//creation server
const app = express();

//configuration engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//middlewares
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5000", "data:", "blob:"],
    },
  })
);
app.use(cors());
app.use(compression());
app.use(json());
app.use(express.static("public"));
app.use(express.static("public/images"));

//route here
app.get("/layout", (req, res) => {
  res.render("main", {
    style: [
      "css/Page_acceuill.css",
      "css/footer.css",
      "css/header.css",
      "css/style-price.css",
    ],
    script: ["/js/Swiper.js", "js/drop.js"],
  });
});
app.get("/", (req, res) => {
  res.render("index", {
    titre: "Page d'accueil",
    style: [
      "css/Page_acceuill.css",
      "css/footer.css",
      "css/header.css",
      "css/style-price.css",
    ],
    script: ["/js/Swiper.js", "js/drop.js"],
  });
});
app.get("/user", (req, res) => {
  res.render("user", {
    title: "Profil",
    style: [
      "css/normalize.css",
      "css/user.main.css",
      "css/final_form.css",
      "css/footer.css",
      "css/header.css",
      "https://fonts.googleapis.com/icon?family=Material+Icons",
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0",
    ],
    script: [
      "/js/Swiper.js",
      "js/drop.js",
      "js/user/page.js",
      "js/user/validationDetails.js",
    ],
  });
});
app.get("/paiment", (req, res) => {
  res.render("paiment", {
    titre: "paiment",
    style: ["css/payment.css", "css/footer.css", "css/header.css"],
    script: ["js/paiment.js", "js/drop.js"],
  });
});

// Activities page route
app.get("/activities", (req, res) => {
  res.render("activities", {
    titre: "Activities",
  });
});

// Membership page route
app.get("/membership", (req, res) => {
  res.render("membership", {
    titre: "Membership",
  });
});

// About us page route
app.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    titre: "About Us",
  });
});

// Contact us page route
app.get("/contactus", (req, res) => {
  res.render("contactus", {
    titre: "Contact Us",
  });
});

// Login page route
app.get("/forms", (req, res) => {
  res.render("forms", {
    titre: "Connexion",
    style: [
      "css/forms.css",
      "css/footer.css",
      "css/header.css",
      "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
      //"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    ],
    script: ["js/forms.js"],
    script: ["js/forms.js"],
  });
});

// Route to display static src images
app.get("/static", (req, res) => {
  res.render("static");
});

// Route to display dynamic src images
app.get("/dynamic", (req, res) => {
  imageList = [];
  imageList.push({ src: "icons/flask.png", name: "flask" });
  imageList.push({ src: "icons/javascript.png", name: "javascript" });
  imageList.push({ src: "icons/react.png", name: "react" });
  res.render("dynamic", { imageList: imageList });
});

app.post("/submit-contact-form", (req, res) => {
  const { nom, email, sujet } = req.body; // Récupère les données envoyées

  console.log("Nom:", nom);
  console.log("Email:", email);
  console.log("Sujet:", sujet);

  // Ici,on va traiter les données, comme les enregistrer dans une base de données
  // ou envoyer un email

  // Réponse avec un message de succès
  res.json({ message: "Votre message a été reçu avec succès !" });
});

app.post("/login", async(req, res) => {
  const { email, motPasse } = req.body; 

  const utilisateur = await getUtilisateur(email)

  if(!utilisateur){
    return res.status(404).json({message:"Utilisateur non trouvé"})
  }

  const validPassword = await bcrypt.compare(motPasse, utilisateur.motPasse)
  if(!validPassword){
    return res.status(401).json({message: "Mot de passe incorrect"})
  }

  const token = jwt.sign({id:utilisateur.id}, process.env.SECRET_KEY,{expiresIn: '1h'})
  res.json({
    message: "Connexion réussie",
    token,
    prenom: utilisateur.prenom
  })
  .then((data)=>{
    if(data.token){
      localStorage.setItem("userToken",data.token);
      localStorage.setItem("userPrenom",data.prenom)
      window.location.href = "/user"
      alert("Bonjour"+ data.prenom)
    } else {
      alert("Erreur de connexion :" + data.message)
    }
  })
});

app.post("/register", async (req, res) => {
  const { prenom, nom, email, tel, password, confirmPassword } = req.body;
  // Assurez-vous que les mots de passe correspondent et hachez le mot de passe
  console.log("Tentative d'inscription de:", email);

  // Pour l'exemple, nous allons juste répondre avec un succès fictif
  res.json({ message: "Inscription réussie!" });
});

app.post("/process-payment", (req, res) => {
  const {
    cardHolderName,
    address,
    postalCode,
    province,
    cardNumber,
    expMonth,
    expYear,
    cvv,
  } = req.body;

  console.log("Processing payment for:", cardHolderName);

  // Ici, intégrez avec votre processeur de paiement
  // Pour cet exemple, nous allons juste simuler une réponse de succès
  res.json({ message: "Paiement traité avec succès!" });
});

app.listen(process.env.PORT);
console.info("Server is running");
console.info("http://localhost:" + process.env.PORT);
