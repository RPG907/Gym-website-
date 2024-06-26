import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterServiceMemberships = async (req, res) => {
  const { type_id, nomDeService, description } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreur: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = database.run(
        `
                INSERT INTO MembershipService(type_id, service_name, description)
                VALUES(?,?,?)
                `,
        [type_id, nomDeService, description]
      );

      res.status(201).json({
        message: "Le service a été ajouté avec succès.",
        lastId: resultat.lastId,
      });
    } catch (error) {
      res.status(400).json({
        message: "Problème avec la création du service pour la membership.",
      });
    }
  }
};

export const getServiceMembership = async (req, res) => {
  const typeId = req.params.typeId;
  console.log(typeId)
  try {
    let database = await connectionPromise;

    let resultat = await database.all(
      `
            SELECT * FROM MembershipService
            WHERE type_id = ?
            `,
      [typeId]
    );
    if (resultat.length > 0) {
      res.status(200).json({
        message: "Le service de la membership a été envoyé avec succès.",
        result: resultat,
      });
    } else {
      res.status(404).json({
        message: "Aucun service trouvé pour ce type de membership."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Problème avec l'envoi des informations du service de la membership.",
      error: error.message
    });
  }
};

export const modifierServiceMemberships = async (req, res) => {
  const { id } = req.query;
  const { nomDeService, description } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreur: erreurs.array() });
  }

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];

      if (nomDeService) {
        partialRequest.push("service_name = ?");
      }
      if (description) {
        partialRequest.push("description = ?");
      }

      let updateQuery = `
        UPDATE MembershipService
        SET ${partialRequest.join(", ")}
        WHERE service_id = ?
        `;

      let values = [];
      if (nomDeService) {
        values.push(nomDeService);
      }
      if (description) {
        values.push(description);
      }

      values.push(id);

      await database.run(updateQuery, values);

      return res.status(201).json({
        message: "Le service de la membership à été mise à jour avec succès.",
      });
    } catch (error) {      
      res.status(400).json({        
        erreurs:
          "Problème avec la suppression du service de la membership.",
      });
     }
  }
};

export const supprimerServiceMembership = async (req, res) => {
  const { id } = req.query;

  if (!Number.isInteger(parseInt(id))) {
    return res.status(400).json({
      message: "Erreur, un ID (nombre entier) doit être donnée.",
    });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.run(
      `
        DELETE FROM MembershipService
        WHERE service_id = ?
        `,
      [id]
    );
    res
      .status(200)
      .json({
        message: "Le service de la membership à été supprimé avec succès.",
        result: resultat,
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Problème avec la suppression du service de la membership.",
      });
  }
};
