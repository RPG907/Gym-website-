import { validationResult } from "express-validator";
import { connectionPromise } from "../connexion.js";

import bcrypt from "bcryptjs";

// POST un user
export const ajouterUtilisateur = async (req, res) => {
  const {
    nom,
    prenom,
    numeroTelephone,
    email,
    motPasse,
    photo    
  } = req.body;

  const mdpCrypter = bcrypt.hashSync(motPasse, 10);
  const dateDArriver = new Date()

  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    res.status(400).json({ erreurs: erreurs.array() });
  } else {
    try {
      let database = await connectionPromise;

      let resultat = await database.run(
        `
            INSERT INTO User(first_name, last_name, phone_number, email, password, photo, joining_date )
            VALUES (?, ?, ?, ?, ?, ?, ?) 
        `,
        [
          prenom,
          nom,
          numeroTelephone || null,
          email,
          mdpCrypter,
          photo || null,
          dateDArriver
        ]
      );

      res.status(201).json({
        message: "L'utilisateur a été créé avec succès.",
        lastID: resultat.lastID,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Erreur interne du serveur lors de la création de l'utilisateur.",
        erreur: error.message,
      });
    }
  }
};

// Put un user a partir de son token 
export const modifierUtilisateur = async (req, res) => {
  const id = req.userId;
  const { nom, prenom, numeroTelephone, email, motPasse, street, appartment, province, city, postal_code, country } = req.body;

  if (!id) {
    return res
      .status(401)
      .json({ message: "L'utilisateur n'est pas authentifié correctement." });
  } 

  try{
    let mdpCrypter = motPasse ? bcrypt.hashSync(motPasse, 10) : null;
    let database = await connectionPromise;
    let partialRequest = [];
    let values = [];

    const currentUser = await database.get("SELECT email FROM User WHERE user_id = ?", [id]);

    if (prenom) {
      partialRequest.push("first_name = ?"); values.push(prenom);
    }
    if (nom) {
      partialRequest.push("last_name = ?"); values.push(nom);
    }
    if (numeroTelephone) {
      partialRequest.push("phone_number = ?"); values.push(numeroTelephone);
    }
    if (email && email !== currentUser.email) {
      partialRequest.push("email = ?"); values.push(email);
    } else if (email === currentUser.email) {
      console.log("Email is the same, not updating:", email);
    }
    if (mdpCrypter) {
      partialRequest.push("password = ?"); values.push(mdpCrypter);
    }
    if (street) {
      partialRequest.push("street = ?"); values.push(street);
    }
    if (appartment) {
      partialRequest.push("appartment = ?"); values.push(appartment);
    }
    if (province) {
      partialRequest.push("province = ?"); values.push(province);
    }
    if (city) {
      partialRequest.push("city = ?"); values.push(city);
    }
    if (postal_code) {
      partialRequest.push("postal_code = ?"); values.push(postal_code);
    }
    if (country) {
      partialRequest.push("country = ?"); values.push(country);
    }

    if (partialRequest.length > 0) {
      let updateQuery = `UPDATE User SET ${partialRequest.join(", ")} WHERE user_id = ?`;
      values.push(id);

      console.log("Attempting to update user with ID:", id);
      console.log("SQL Query:", updateQuery);
      console.log("Values:", values);
          await database.run(updateQuery, values, function(err) {
      if (err) {
        console.error("Error executing SQL:", err);
        return res.status(500).json({ message: "Erreur lors de l'exécution de la mise à jour." });
      }
      console.log(`Rows affected: ${this.changes}`);
      if (this.changes > 0) {
        console.log(`User updated successfully, ${this.changes} row(s) modified.`);
        res.status(201).json({ message: "L'utilisateur a été mis à jour avec succès." });
      } else {
        console.log("No rows updated.");
        res.status(500).json({ message: "Aucune modification effectuée." });
      }
    });

      res.status(201).json({ message: "L'utilisateur a été mis à jour avec succès." });
    } else {
      return res.status(400).json({ message: "Aucune donnée fournie pour la mise à jour." });
    }
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
    return; 
  }
};

// Peut etre supprimer ??
export const supprimerUtilisateur = async (req, res) => {
  const id = req.query.id;

  if (!Number.isInteger(parseInt(id))) {
    return res
      .status(400)
      .json({ message: "Erreur, un ID (nombre entier) doit être donnée." });
  }
  try {
    let database = await connectionPromise;

    await database.run(
      `
        DELETE FROM User
        WHERE user_id = ?
        `,
      [id]
    );

    res.status(200).json({
      message: "L'utilisateur à été supprimé avec succès.",
      result: resultat,
    });
  } catch (error) {
    res.status(400).json({ erreurs: error.message });
  }
};

// Get l'utilisateur a partir du token
export const getUtilisateur = async (req, res) => {
  const id = req.userId;

  if (!id) {
    return res
      .status(401)
      .json({ message: "L'utilisateur n'est pas authentifié correctement." });
  }
  try {
    let database = await connectionPromise;

    let resultat = await database.all(
      `
        SELECT u.*, mt.type_id, mt.type_name AS membershipTypeName
        FROM User u
        LEFT JOIN Membership m ON u.user_id = m.user_id
        LEFT JOIN MembershipType mt ON m.membership_type_id = mt.type_id        
        WHERE u.user_id = ?
        `,
      [id]
    );

    if (resultat) {
      console.log
      res.status(200).json({
        message:
          "Les informations de l'utilisateur ont été envoyées avec succès.",
        result: resultat,
      });
    } else {
      res.status(404).json({
        message: "Utilisateur non trouvé.",
      });
    }
  } catch (error) {
    res.status(500).json({
      erreurs: error.message,
    });
  }
};

