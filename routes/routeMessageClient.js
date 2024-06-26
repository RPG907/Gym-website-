import { Router } from "express";
import { ajouterMessageClient } from "../controlleurs/messageClient.js";
import { ajouterMessageClientValidation } from "../validations/messageClientValidation.js";

const routesMessageClient = Router();

routesMessageClient.post("/", ajouterMessageClientValidation, ajouterMessageClient); 

export {routesMessageClient};