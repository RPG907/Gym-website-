import { Router } from "express";
import {
  ajouterVideo,
  getVideo,
  modifierVideo,
  supprimerVideo,
} from "../controlleurs/video.js";
import { verifierToken } from "../auth/autorisation.js";

const routesVideo = Router();

// Pour getVideo utilisateur peut utiliser ? seule les utisateur avec un membership autorisé auront acces à cette page
//Ou va etre deja dans l'application web pour n'importe peux voir ?

routesVideo.post("/", verifierToken, ajouterVideo);
routesVideo.get("/:id", verifierToken, getVideo); 
routesVideo.put("/:id", verifierToken, modifierVideo);
routesVideo.delete("/:id", verifierToken, supprimerVideo);

export { routesVideo };
