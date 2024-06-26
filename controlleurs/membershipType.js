import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterMembershipType = async (req, res) => {
  const { membershipTypeName, prixMembershipType } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
          INSERT INTO MembershipType(type_name, price )
          VALUES (?, ?)
        `,
        [membershipTypeName, prixMembershipType]
      );

      res.status(201).json({
        message: "Le membershipType a été ajouté avec succès.",
        lastID: resultat.lastID,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Problème avec l'ajout du MembershipType." });
    }
  }
};

export const modifierMembershipType = async (req, res) => {
  const { id } = req.query;
  const { membershipTypeName, prixMembershipType } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreurs: erreurs.array() });
  }

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(200)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];
      if (membershipTypeName) {
        partialRequest.push("type_name = ?");
      }     
      if (prixMembershipType) {
        partialRequest.push("price = ?");
      }

      let updateQuery = `
                UPDATE MembershipType
                SET ${partialRequest.join(", ")}
                WHERE type_id = ?
            `;

      let values = [];
      if (membershipTypeName) {
        values.push(membershipTypeName);
      }      
      if (prixMembershipType) {
        values.push(prixMembershipType);
      }
      values.push(id);

      await database.run(updateQuery, values);

      return res
        .status(201)
        .json({ message: "Le membershipType à été mise à jour avec succès." });
    } catch (error) {
      return res.status(400).json({ erreurs: error });
    }
  }
};

export const getMembershipType = async (req, res) => {
  const id = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(200)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.get(
      `
        SELECT * FROM MembershipType
        WHERE type_id = ?
        `,
      [id]
    );

    res.status(200).json({
      message: "Le membershipType a été envoyé avec succès.",
      result: resultat,
    });
  } catch (error) {
    res.status(400).json({
      erreurs: "Problème avec l'envoi des informations du membershipType.",
    });
  }
};

export const getAllMembershipType = async (req, res) => {
  try {
    let database = await connectionPromise;

    let resultat = await database.all(
      `
        SELECT * 
        FROM MembershipType        
        `,      
    );

    res.status(200).json({
      message: "Les membershipType ont été récupérés avec succès.",
      result: resultat,
    });
  } catch (error) {
    console.error("Error fetching membership types:", error);
    res.status(400).json({
      erreurs: "Problème avec la récupération des informations des membershipType.",
    });
  }
}

export const supprimerMembershipType = async (req, res) => {
  const id = req.query.id;
  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.run(
      `
        DELETE FROM MembershipType
        WHERE type_id = ?
        `,
      [id]
    );

    res
      .status(200)
      .json({
        message: "Le membershipType à été supprimé avec succès.",
        result: resultat,
      });
  } catch (error) {
    res
      .status(400)
      .json({ erreurs: "Problème avec la suppression du membershipType." });
  }
};
