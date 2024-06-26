import { Router } from "express";
import { ajouterCarteUtilisateur, getCarteUtilisateur, modifierCarteUtilisateur, supprimerCarteUtilisateur } from "../controlleurs/utilisateurCarte.js";
import {ajouterCarteUtilisateurValidation, modifierCarteUtilisateurValidation} from '../validations/carteUtilisateurValidation.js'
import { verifierToken } from "../auth/autorisation.js";


const routesCarteUtilisateur = Router();

routesCarteUtilisateur.post("/", verifierToken, ajouterCarteUtilisateurValidation, ajouterCarteUtilisateur);
routesCarteUtilisateur.get("/:id", verifierToken, getCarteUtilisateur);
routesCarteUtilisateur.put("/:id", verifierToken, modifierCarteUtilisateurValidation, modifierCarteUtilisateur);
routesCarteUtilisateur.delete("/:id", verifierToken, supprimerCarteUtilisateur);

export {routesCarteUtilisateur};