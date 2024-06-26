import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterRabais = async (req, res) => {
  const { pourcentage, dateDebut, dateFin, type_id } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  }

  try {
    let database = await connectionPromise;

    let resultat = await database.run(
      `
      INSERT INTO Rabais (pourcentage_rabais, start_date, end_date, type_id) 
      VALUES (?, ?, ?, ?)
      `,
      [pourcentage, dateDebut, dateFin, type_id]
    );

    return res.status(201).json({
      message: "Le rabais a été ajouté avec succès.",
      lastID: resultat.lastID,
    });
  } catch (error) {
    return res.status(400).json({ erreurs: error.message });
  }
};

export const modifierRabais = async (req, res) => {

  const { id } = req.query;
  const { pourcentage, dateDebut, dateFin, type_id} = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  }

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];

      if (pourcentage) {
        partialRequest.push("pourcentage_rabais = ?");
      }
      if (dateDebut) {
        partialRequest.push("start_date = ?");
      }
      if (dateFin) {
        partialRequest.push("end_date = ?");
      }
      if (type_id) {
        partialRequest.push("type_id = ?");
      }

      let updateQuery = `
        UPDATE Rabais
        SET ${partialRequest.join(", ")}  
        WHERE rabais_id = ?
      `;

      let values = [];
      if (pourcentage) {
        values.push(pourcentage);
      }
      if (dateDebut) {
        values.push(dateDebut);
      }
      if (dateFin) {
        values.push(dateFin);
      }
      if (type_id) {
        values.push(type_id);
      }

      values.push(id);

      await database.run(updateQuery, values);

      return res
        .status(200)
        .json({ message: "Le rabais a été mis à jour avec succès." });
    } catch (error) {
      return res.status(400).json({ erreurs: error.message });
    }
  }
};

export const getRabais = async (req, res) => {
  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.get(
        `SELECT * 
          FROM Rabais 
          WHERE rabais_id = ?
          `,
        [id]
      );

      return res
        .status(200)
        .json({
          message: "Les informations du rabais ont été envoyées avec succès.",
          result: resultat,
        });
    } catch (error) {
      return res.status(400).json({ erreurs: error.message });
    }
  }
};

export const supprimerRabais = async (req, res) => {
  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      await database.run(
        `
            DELETE 
            FROM Rabais 
            WHERE rabais_id = ?
            `,
        [id]
      );

      return res
        .status(200)
        .json({ message: "Le rabais a été supprimé avec succès." });
    } catch (error) {
      return res.status(400).json({ erreurs: error.message });
    }
  }
};
