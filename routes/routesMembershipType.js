import { Router } from "express";
import { ajouterMembershipType, getMembershipType, getAllMembershipType, modifierMembershipType, supprimerMembershipType } from "../controlleurs/membershipType.js";
import { ajouterMembershipTypeValidation, modifierMembershipTypeValidation } from "../validations/membershipTypeValidation.js";
import { verifierToken} from "../auth/autorisation.js";

const routesMembershipType = Router();

routesMembershipType.post("/", verifierToken, ajouterMembershipTypeValidation, ajouterMembershipType);
routesMembershipType.get("/:id", getMembershipType);  
routesMembershipType.get("/", getAllMembershipType);
routesMembershipType.put("/:id", verifierToken, modifierMembershipTypeValidation, modifierMembershipType);
routesMembershipType.delete("/:id", verifierToken, supprimerMembershipType);

export {routesMembershipType};