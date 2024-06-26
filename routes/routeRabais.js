import { Router } from "express";
import {
  ajouterRabais,
  getRabais,
  modifierRabais,
  supprimerRabais,
} from "../controlleurs/rabais.js";
import { verifierToken } from "../auth/autorisation.js";

const routesRabais = Router();

// Est-ce que l'utilisateur a besoin de voir les rabais ?  oui il a besoin de les voir

routesRabais.post("/", verifierToken, ajouterRabais);
routesRabais.get("/:id", verifierToken, getRabais);
routesRabais.put("/:id", verifierToken, modifierRabais);
routesRabais.delete("/:id", verifierToken, supprimerRabais);

export { routesRabais };
