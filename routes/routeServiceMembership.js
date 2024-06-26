import { Router } from "express";
import { ajouterServiceMemberships, getServiceMembership, modifierServiceMemberships, supprimerServiceMembership } from "../controlleurs/serviceMemberships.js";
import { ajouterServiceMembership, modifierServiceMembership } from "../validations/serviceMembershipValidation.js";
import { verifierToken } from "../auth/autorisation.js";

const routesServiceMembership = Router();
 
routesServiceMembership.post("/", verifierToken, ajouterServiceMembership, ajouterServiceMemberships);
routesServiceMembership.get("/:typeId", verifierToken, getServiceMembership); 
routesServiceMembership.put("/:id", verifierToken, modifierServiceMembership, modifierServiceMemberships);
routesServiceMembership.delete("/:id", verifierToken, supprimerServiceMembership);

export {routesServiceMembership};