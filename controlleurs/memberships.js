import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";


// Ajouter condition pour verifier l'etat du client (logedin or not/ a un compte alors en creer un)
export const ajouterMembership = async (req, res) => {
  const { membership_type_id,  } = req.body;
  const user_id = req.userId

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreur: erreurs.array() });
  } else {
    try {
      const dateActivationMembership = new Date();
      const dateExpirationMembership = new Date(
        new Date().setFullYear(dateActivationMembership.getFullYear() + 1)
      );

      let database = await connectionPromise;

      let resultat = await database.run(
        `
                INSERT into Membership(user_id, membership_type_id, start_date, end_date)
                VALUES (?,?,?,?)
            `,
        [
          user_id,
          membership_type_id,
          dateActivationMembership.toISOString().split("T")[0],
          dateExpirationMembership.toISOString().split("T")[0],
        ]
      );

      res.status(201).json({
        message: "Le membership à été ajouté avec succès.",
        lastID: resultat.lastID,
      });
    } catch (error) {
      res
        .status(400)
        .json({
          message: "Problème avec l'ajout de la membership.",
          detail: error.message,
        });
    }
  }
};

export const modifierMembership = async (req, res) => {
  const { id } = req.query;
  const { membership_type_id } = req.body;

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
      let valeursAModifier = [];
      let setClause = [];

      if (membership_type_id) {
        const dateActivationMembership = new Date();
        const dateExpirationMembership = new Date(
          new Date().setFullYear(dateActivationMembership.getFullYear() + 1)
        );

        setClause.push(
          "membership_type_id = ?",
          "start_date = ?",
          "end_date = ?"
        );
        valeursAModifier.push(
          membership_type_id,
          dateActivationMembership.toISOString().split("T")[0],
          dateExpirationMembership.toISOString().split("T")[0]
        );
      } else {
        const { dateExpirationMembership } = req.body;

        if (dateExpirationMembership) {
          setClause.push("end_date = ?");
          valeursAModifier.push(dateExpirationMembership);
        }
      }

      if (setClause.length > 0) {
        let updateQuery = `
        UPDATE Membership
        SET ${partialRequest.join(", ")}
        WHERE  membership_id = ?
        `;
        valeursAModifier.push(id);

        await database.run(updateQuery, valeursAModifier);

        return res
          .status(201)
          .json({ message: "Le membership à été mise à jour avec succès." });
      }
    } catch (error) {
      res.status(400).json({ erreurs: error });
    }
  }
};

export const getMembership = async (req, res) => {
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
            SELECT * from Membership
            WHERE membership_id = ?
            `,
      [id]
    );

    res
      .status(200)
      .json({
        message: "Le membership a été envoyé avec succès.",
        result: resultat,
      });
  } catch (error) {
    res.status(400).json({ erreur: error });
  }
};

export const getMembershipDetailsByToken = async (req, res) => {
  try {
      const userId = req.userId; 
      let database = await connectionPromise;

      let resultat = await database.get(`
      SELECT m.*, mt.type_name
      FROM Membership m
      INNER JOIN MembershipType mt ON m.membershipType_id = mt.id
      WHERE m.user_id = ?
  `, [userId]);

      if (resultat) {
          res.status(200).json({
              message: "Membership details fetched successfully",
              membershipDetails: resultat
          });
      } else {
          res.status(404).json({ message: "No membership found for this user." });
      }
  } catch (error) {
      console.error('Error fetching membership details by token:', error);
      res.status(500).json({ message: "Internal server error" });
  }
};


export const supprimerMembership = async (req, res) => {
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
        DELETE from Membership
        WHERE membership_id = ?
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
      .json({ message: "Problème avec la suppression de la membership." });
  }
};
