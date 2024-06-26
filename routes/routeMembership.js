import { Router } from "express";
import { ajouterMembership, getMembership, getMembershipDetailsByToken, modifierMembership, supprimerMembership } from "../controlleurs/memberships.js";
import { verifierToken } from "../auth/autorisation.js";

const routesMembership = Router();

routesMembership.post("/", verifierToken, ajouterMembership); 
routesMembership.get("/:id", verifierToken, getMembership);
routesMembership.get('/detailsByToken', verifierToken, getMembershipDetailsByToken);
routesMembership.put("/:id", verifierToken, modifierMembership);
routesMembership.delete("/:id", verifierToken, supprimerMembership);

export {routesMembership};