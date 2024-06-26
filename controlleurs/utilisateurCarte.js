import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

export const ajouterCarteUtilisateur = async (req, res) => {
  const { user_id, cardHolderName, address, postalCode, province, cardNumber, expMonth, expYear, cvv } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
            INSERT INTO UserCard(user_id, cardHolderName, address, postalCode, province, cardNumber, expMonth, expYear, cvv)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)            
            `,
        [user_id, cardHolderName, address, postalCode, province, cardNumber, expMonth, expYear, cvv]
      );

      res.status(200).json({
        message: "La carte de l'utilisateur a été créé avec succès.",
        lastID: resultat.lastID,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erreurs: "Problème avec la création du plan d'entraînement." });
    }
  }
};

export const modifierCarteUtilisateur = async (req, res) => {
  const { id } = req.query;
  const { cardHolderName, address, postalCode, province, cardNumber, expMonth, expYear, cvv } = req.body;

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

      if (cardHolderName) {
        partialRequest.push("cardHolderName = ?");
      }
      if (address) {
        partialRequest.push("address = ?");
      }
      if (postalCode) {
        partialRequest.push("postalCode = ?");
      }
      if (province) {
        partialRequest.push("province = ?");
      }
      if (cardNumber) {
        partialRequest.push("cardNumber = ?");
      }
      if (expMonth) {
        partialRequest.push("expMonth = ?");
      }
      if (expYear) {
        partialRequest.push("expYear = ?");
      }
      if (cvv) {
        partialRequest.push("cvv = ?");
      }

      let updateQuery = `
            UPDATE UserCard
            SET ${partialRequest.join(", ")}
            WHERE userCard_id = ?
            `;

      let values = [];
      if (cardHolderName) {
        values.push(cardHolderName);
      }
      if (address) {
        values.push(address);
      }
      if (postalCode) {
        values.push(postalCode);
      }
      if (province) {
        values.push(province);
      }
      if (cardNumber) {
        values.push(cardNumber);
      }
      if (expMonth) {
        values.push(expMonth);
      }
      if (expYear) {
        values.push(expYear);
      }
      if (cvv) {
        values.push(cvv);
      }

      values.push(id);

      await database.run(updateQuery, values)

      res.status(201).json({
        message: "La carte de l'utilisateur a été mis à jour avec succès.",
      });
    } catch (error) {
      res.status(400).json({
        erreurs: "Problème avec la mise à jour de la carte de l'utilisateur.",
      });
    }
  }
};


export const supprimerCarteUtilisateur = async (req, res) => {

  const id = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donné." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.run(
      `
            DELETE 
            FROM UserCard
            WHERE userCard_id = ?
            `,[id]
    );

    res.status(200).json({
      message: "La carte de l'utilisateur a été supprimé avec succès.",
      result: resultat,
    });
  } catch (error) {
      res.status(400).json({
      message: "Problème avec la suppression de la carte de l'utilisateur.",
    });
  }
};

export const getCarteUtilisateur = async (req, res) => {

  const { id } = req.query;
  const userId = req.user_id

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donné." });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.get(
        `
          SELECT *
          FROM UserCard
          WHERE userCard_id = ?
        `,
        [id]
      );

      if(resultat && resultat.user_id !== userId){
        return res.status(403).json({message: "Accès non autorisé à cette carte."})
      }

      res
        .status(200)
        .json({
          message:
            "Les informations de la carte ont été envoyées avec succès.",
          result: resultat,
        });
    } catch (error) {
      res
        .status(400)
        .json({
          erreurs:
            "Problème avec l'accès aux informations de la carte.",
        });
    }
  }
};
