import { Router } from "express";
import { ajouterUserWorkoutPlan, getUserWorkoutPlan, modifierUserWorkoutPlan, supprimerUserWorkoutPlan } from "../controlleurs/utilisateurWorkoutPlan.js";
import { verifierToken } from "../auth/autorisation.js";


const routesUserWorkoutPlan = Router();

// Comment fonctionne cette partie dans le front-end ?? Besoin de plus de clarity, a ton besoin de isAdmin ?

routesUserWorkoutPlan.post("/", verifierToken, ajouterUserWorkoutPlan);
routesUserWorkoutPlan.get("/:id", verifierToken, getUserWorkoutPlan);
routesUserWorkoutPlan.put("/:id", verifierToken, modifierUserWorkoutPlan);
routesUserWorkoutPlan.delete("/:id", verifierToken, supprimerUserWorkoutPlan);

export {routesUserWorkoutPlan};