 import express from "express";
import bodyParser from "body-parser";
import cors from "cors"

import { routesUtilisateur } from "./routes/routeUtilisateur.js";
import { routesCarteUtilisateur } from "./routes/routeCarteUtilisateur.js";
import { routesMembership } from "./routes/routeMembership.js";
import { routesMembershipType } from "./routes/routesMembershipType.js";
import { routesPaiementMembership } from "./routes/routePaiementMembership.js";
import { routesServiceMembership } from "./routes/routeServiceMembership.js";
import { routesUserWorkoutPlan } from "./routes/routeUtilisateurWorkoutPlan.js";
import { routesWorkoutPlan } from "./routes/routeWorkoutPlan.js";
import { routesRabais } from "./routes/routeRabais.js";
import { routesVideo } from "./routes/routeVideo.js";
import { routesMessageClient } from "./routes/routeMessageClient.js";
import { routeLogin } from "./routes/routeLogin.js";

const app = express();
const router = express.Router();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:4000",
}));


app.use("/memberships", routesMembership);
app.use("/membershipType", routesMembershipType);
app.use("/paiementMembership", routesPaiementMembership);
app.use("/rabais", routesRabais);
app.use("/serviceMembership", routesServiceMembership);
app.use("/carteUtilisateur", routesCarteUtilisateur);
app.use("/utilisateurs", routesUtilisateur);
app.use("/userWorkoutPlan", routesUserWorkoutPlan);
app.use("/video", routesVideo);
app.use("/workoutPlan", routesWorkoutPlan);
app.use("/messageClient", routesMessageClient);
app.use("/login", routeLogin);

app.use((req, res, next) => {
  res.header("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:5000");
  next();
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).send("404: Page not Found");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
