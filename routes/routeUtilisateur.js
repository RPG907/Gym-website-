import { Router } from "express";
import {
  ajouterUtilisateur,
  getUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
} from "../controlleurs/utilisateurs.js";
import { ajouterUtilisateurValidation, modifierUtilisateurValidation } from "../validations/utilisateurValidation.js";
import {verifierToken} from '../auth/autorisation.js'

const routesUtilisateur = Router();

routesUtilisateur.post("/", ajouterUtilisateurValidation, ajouterUtilisateur);
routesUtilisateur.get("/", verifierToken, getUtilisateur);
routesUtilisateur.patch("/", verifierToken, modifierUtilisateurValidation, modifierUtilisateur);
routesUtilisateur.delete("/:id", verifierToken, supprimerUtilisateur);

export { routesUtilisateur };
