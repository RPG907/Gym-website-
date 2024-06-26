import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectionPromise } from "../connexion.js";

export const login = async (req, res) => {
  const { email, motPasse } = req.body;

  if (!email || !motPasse) {
    return res
      .status(404)
      .json({ message: "L'email et le mot de passe sont obligatoires !" });
  }

  try {
    const database = await connectionPromise;
    const utilisateur = await database.get(
      `
            SELECT *
            FROM User
            WHERE email = ?
            `,
      [email]
    );

    if (!utilisateur) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    const mdpVerifier = await bcrypt.compare(motPasse, utilisateur.password);

    if (!mdpVerifier) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const payload = { id: utilisateur.user_id };
    const token = jwt.sign(payload, process.env.CODE_SECRET);

    res.status(200).json({ data: utilisateur, token });
  } catch (error) {
    res.status(404).json({ message: "Erreur lors de l'authentification." });
  }
};
