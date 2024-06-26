import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterMessageClient = async (req, res) => {
  const { nom_client, email_client, sujet_message } = req.body;
  console.log(req.body);
  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    console.log("Validation Errors:", erreurs.array());
    res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;
      let resultat = await database.run(
        `
                INSERT INTO MessageClient(nom_client, email_client, sujet_message)
                VALUES(?, ?, ?)
                `,
        [nom_client, email_client, sujet_message]
      );

        res.status(201).json({
        message: "Le message à été envoyé avec succès.",
        lastId: resultat.lastID,
      });
    } catch (error) {
      console.error("Insertion Error:", error);
      res.status(400).json({
        message: "Problème l'envoie du message.",
      });
    }
  }
};
