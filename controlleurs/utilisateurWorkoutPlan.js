import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterUserWorkoutPlan = async (req, res) => {
  const { user_id, plan_id, dateDebut, dateFin } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
        INSERT INTO UserWorkoutPlan(user_id, plan_id, start_date, end_date) 
        VALUES (?, ?, ?, ?)
        `,
        [user_id, plan_id, dateDebut, dateFin]
      );

      res.status(201).json({
        message:
          "Le plan d'entraînement de l'utilisateur a été créé avec succès.",
        lastID: resultat.lastID,
      });
    } catch (error) {
      res.status(400).json({
        erreurs:
          "Problème avec la création du plan d'entraînement de l'utilisateur.",
      });
    }
  }
};

export const getUserWorkoutPlan = async (req, res) => {
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
        SELECT * FROM UserWorkoutPlan
        WHERE user_workout_id = ?
        `,
      [id]
    );

    if (resultat) {
      res.status(200).json({
        message:
          "Les informations du plan d'entraînement de l'utilisateur ont été envoyées avec succès.",
        result: resultat,
      });
    } else {
      res
        .status(404)
        .json({ message: "Plan d'entraînement de l'utilisateur non trouvé." });
    }
  } catch (error) {
    res.status(400).json({
      erreurs:
        "Problème avec l'envoi des informations du plan d'entraînement de l'utilisateur.",
    });
  }
};

export const modifierUserWorkoutPlan = async (req, res) => {
  const { id } = req.query;
  const { dateDebut, dateFin } = req.body;

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

      if (dateDebut) {
        partialRequest.push("start_date = ?");
      }
      if (dateFin) {
        partialRequest.push("end_date = ?");
      }

      let updateQuery = `UPDATE UserWorkoutPlan
      SET ${partialRequest.join(", ")}
      WHERE user_workout_id = ?
      `;

      let values = [];
      if (dateDebut) {
        values.push(dateDebut);
      }
      if (dateFin) {
        values.push(dateFin);
      }

      values.push(id);

      await database.run(updateQuery, values);

      return res.status(201).json({
        message:
          "Le plan d'entraînement de l'utilisateur a été mis à jour avec succès.",
      });
    } catch (error) {
      res.status(400).json({
        erreurs:
          "Problème avec la mise à jour du plan d'entraînement de l'utilisateur.",
      });
    }
  }
};

export const supprimerUserWorkoutPlan = async (req, res) => {
  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  }
  try {
    let database = await connectionPromise;

    let resultat = database.run(
      `
            DELETE FROM UserWorkoutPlan
            WHERE user_workout_id = ?
        `,
      [id]
    );

    res.status(200).json({
      message:
        "Le plan d'entraînement de l'utilisateur a été supprimé avec succès.",
        result: resultat,
    });
  } catch (error) {
    res.status(400).json({
      erreurs:
        "Problème avec la suppression du plan d'entraînement de l'utilisateur.",
    });
  }
};
