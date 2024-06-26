import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterWorkoutPlan = async (req, res) => {
  const { nomPlan, description, contenuPlan } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `       
            INSERT INTO WorkoutPlan(plan_name, description, plan_content) 
            VALUES (?, ?, ?)
        `,[nomPlan, description, contenuPlan]
      );

      res
        .status(201)
        .json({
          message: "Le plan d'entraînement a été créé avec succès.",
          lastID: resultat.lastID,
        });
    } catch (error) {
      res
        .status(400)
        .json({ erreurs: "Problème avec la création du plan d'entraînement." });
    }
  }
};

export const modifierWorkoutPlan = async (req, res) => {

  const { id } = req.query;
  const { nomPlan, description, contenuPlan } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  }

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donné." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];
      if (nomPlan) {
        partialRequest.push("plan_name = ?");
      }
      if (description) {
        partialRequest.push("description = ?");
      }
      if (contenuPlan) {
        partialRequest.push("plan_content = ?");
      }

      let updateQuery = `
      UPDATE WorkoutPlan
      SET ${partialRequest.join(", ")}
      WHERE plan_id = ?
      `;
     

      let values = [];
      if (nomPlan) {
        values.push(nomPlan);
      }
      if (description) {
        values.push(description);
      }
      if (contenuPlan) {
        values.push(contenuPlan);
      }

      values.push(id);

      await database.run(updateQuery, values);

      res
        .status(201)
        .json({
          message: "Le plan d'entraînement a été mis à jour avec succès.",
        });
    } catch (error) {      
      res.status(400).json({
        erreurs:
          "Problème avec la mise à jour du plan d'entraînement de l'utilisateur.",
      });
    }
  }
};

export const supprimerWorkoutPlan = async (req, res) => {

  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donné." });
  }
  try {
    let database = await connectionPromise;

    await database.run(
      `
            DELETE 
            FROM WorkoutPlan
            WHERE plan_id = ?
        `,
      [id]
    );

    res
      .status(200)
      .json({ message: "Le plan d'entraînement a été supprimé avec succès." });
  } catch (error) {
    res
      .status(400)
      .json({
        erreurs: "Problème avec la suppression du plan d'entraînement.",
      });
  }
};

export const getWorkoutPlan = async (req, res) => {

  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donné." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.get(
      `
        SELECT * FROM WorkoutPlan
        WHERE plan_id = ?
        `,
      [id]
    );

    res
      .status(200)
      .json({
        message:
          "Les informations du plan d'entraînement ont été envoyées avec succès.",
        result: resultat,
      });
  } catch (error) {
    res
      .status(400)
      .json({
        erreurs:
          "Problème avec l'envoi des informations du plan d'entraînement.",
      });
  }
};
