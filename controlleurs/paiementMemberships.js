import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";
import cron from 'node-cron'


/*async function ajouterPaiementAutomatique(user_id, membership_id, montant){
  try{
    let database = await connectionPromise;
    let dateDePaiement = new Date().toISOString().split('T')[0];

    let resultat = await database.run(
      `
      INSERT INTO MembershipPayment(user_id, membership_id, payment_date, amount_paid) 
      VALUES(?,?,?,?)
      `,
      [user_id, membership_id, dateDePaiement, montant]
    );
    console.log("Paiement ajouté avec succès. ID:", resultat.lastID);
  }catch (error){
    console.error("Erreur lors de l'ajout du paiement:", error.message);
  }
}*/


// Faire un payment qui va prendre les donnees de la carte et le montant a payer et faire le payment
// On peut effacer les autre function ?


export const ajouterPaiementMembership = async (req, res) => {
  const { user_id, membership_id, dateDePaiement, montantPayee } = req.body;

  const erreurs = validationResult(req);
  console.log("Données reçues:", req.body);
  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreurs: erreurs.array() });
    console.log("Erreurs de validation:", erreurs.array());
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
            INSERT INTO MembershipPayment(user_id, membership_id, payment_date, amount_paid)
            VALUES(?,?,?,?)
             `,
        [user_id, membership_id, dateDePaiement, montantPayee]
      );

      res.status(201).json({
        message: "Le paiement pour la membership à été ajouté avec succès.",
        lastId: resultat.lastID,
      });
    } catch (error) {
      res.status(400).json({
        message: "Problème avec l'ajout du paiement de la membership.",
      });
    }
  }
};

export const getPaiementMembership = async (req, res) => {
  const id = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.get(
      `
            SELECT * FROM MembershipPayment
            WHERE payment_id = ?
            `,
      [id]
    );
    res.status(200).json({
      message: "Le paiement de la membership a été envoyé avec succès.",
      result: resultat,
    });
  } catch (error) {
    res.status(400).json({
      message:
        "Problème avec l'envoi des informations du paiement de la membership.",
    });
  }
};

export const modifierPaiementMembership = async (req, res) => {
  const { id } = req.query;
  const { dateDePaiement, montantPayee } = req.body;

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreurs: erreurs.array() });
  }

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  } else {
    try {
      let database = await connectionPromise;

      let partialRequest = [];
      if (dateDePaiement) {
        partialRequest.push("payment_date = ?");
      }
      if (montantPayee) {
        partialRequest.push("amount_paid = ?");
      }

      let updateQuery = `UPDATE MembershipPayment
        SET ${partialRequest.join(", ")}
        WHERE payment_id = ?
        `;

      let values = [];
      if (dateDePaiement) {
        values.push(dateDePaiement);
      }
      if (montantPayee) {
        values.push(montantPayee);
      }

      values.push(id);

      await database.run(updateQuery, values);

      return res.status(201).json({
        message: "Le paiement de la membership à été mise à jour avec succès.",
      });
    } catch (error) {
      return res.status(400).json({ erreurs: error });
    }
  }
};

export const supprimerPaiementMembership = async (req, res) => {
  const id = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res.status(400).json({
      message: "Erreur, un ID (nombre entier) doit être donnée.",
    });
  }
  try {
    let database = await connectionPromise;

    let resultat = database.run(
      `
        DELETE FROM MembershipPayment
        WHERE payment_id = ?
        `,
      [id]
    );

    res.status(200).json({
      message: "Le paiement de la membership à été supprimé avec succès.",
      result: resultat,
    });
  } catch (error) {
    res.status(400).json({
      message: "Problème avec la suppression du paiement de la membership.",
    });
  }
};
