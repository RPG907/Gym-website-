import { Router } from "express";
import { ajouterPaiementMembership, getPaiementMembership, modifierPaiementMembership, supprimerPaiementMembership } from "../controlleurs/paiementMemberships.js";
import { verifierToken } from "../auth/autorisation.js";


const routesPaiementMembership = Router();


// Peux etre refaire les controlleurs pour les paiements. Les utilisateurs peuvent seulement interagir avec les paiements
// si => modifierPaiement (mensuel, annuelle ou) ou supprimerPaiement (quand utilisateur supprime son abbonement)
// get => peux voir les paiements qu'il doit faire 

routesPaiementMembership.post("/", verifierToken, ajouterPaiementMembership);
routesPaiementMembership.get("/:id", verifierToken, getPaiementMembership);
routesPaiementMembership.put("/:id", verifierToken, modifierPaiementMembership);
routesPaiementMembership.delete("/:id", verifierToken, supprimerPaiementMembership);

export {routesPaiementMembership};