import { Router } from "express";
import {
  ajouterWorkoutPlan,
  getWorkoutPlan,
  modifierWorkoutPlan,
  supprimerWorkoutPlan,
} from "../controlleurs/workoutPlan.js";
import { verifierToken } from "../auth/autorisation.js";

const routesWorkoutPlan = Router();

// Get getWorkoutPlan l'utilisateur peux voir les plans proposer avant de selectionner 1 qui devient userWorkoutPlan ?? oui

routesWorkoutPlan.post("/", verifierToken, ajouterWorkoutPlan);
routesWorkoutPlan.get("/:id", verifierToken, getWorkoutPlan);
routesWorkoutPlan.put("/:id", verifierToken, modifierWorkoutPlan);
routesWorkoutPlan.delete("/:id", verifierToken, supprimerWorkoutPlan);

export { routesWorkoutPlan };
