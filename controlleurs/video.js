import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterVideo = async (req, res) => {
  const { nomVideo, videoFilePath } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
                INSERT INTO Video(videoName, videoFilePath)
                VALUES (?, ?) 
                `,
        [nomVideo, videoFilePath]
      );

      res.status(201).json({
        message: "La vidéo a été créée avec succès.",
        lasID: resultat.lastID,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Problème avec la création de la vidéo." });
    }
  }
};

export const modifierVideo = async (req, res) => {
  const { id } = req.query;
  const { nomVideo, videoFilePath } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(200).json({ erreurs: erreurs.array() });
  }
  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];
      if (nomVideo) {
        partialRequest.push("videoName = ?");
      }
      if (videoFilePath) {
        partialRequest.push("videoFilePath = ?");
      }
      let updateQuery = `
            UPDATE Video
            SET ${partialRequest.join(", ")}
            WHERE video_id = ?
            `;

      let values = [];
      if (nomVideo) {
        values.push(nomVideo);
      }
      if (videoFilePath) {
        values.push(videoFilePath);
      }

      values.push(id);

      await database.run(updateQuery, values);

      return res
        .status(200)
        .json({ message: "La vidéo à été mise à jour avec succès." });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Problème avec la mise à jour de la vidéo." });
    }
  }
};

export const supprimerVideo = async (req, res) => {
  const { id } = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
                DELETE
                FROM Video
                WHERE video_id = ?
                `,
        [id]
      );

      res.status(200).json({
        message: "La vidéo à été supprimée avec succès.",
        result: resultat,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Problème avec la suppression de la vidéo." });
    }
  }
};

export const getVideo = async (req, res) => {
  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
                SELECT *
                FROM Video
                WHERE video_id = ?
                `,
        [id]
      );

      res
        .status(200)
        .json({
          message: "Les informations de la vidéo ont été envoyées avec succès.",
          result: resultat,
        });
    } catch (error) {
      return res
        .status(400)
        .json({
          message: "Problème avec l'envoi des informations de la vidéo.",
        });
    }
  }
};
