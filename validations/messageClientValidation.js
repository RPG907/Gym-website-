import { body } from "express-validator";

export const ajouterMessageClientValidation = [
  body("nom_client")
    .notEmpty()
    .withMessage("Le prénom ne peut pas être vide")
    .isAlpha("fr-FR", { ignore: " " })
    .withMessage("Le prénom doit contenir que des lettres")
    .isLength({ min: 2 })
    .withMessage("Le prénom doit avoir minimum 2 lettres"),
  body("email_client")
    .isEmail()
    .withMessage("L'email doit être une adresse email valide"),
  body("sujet_message")
    .notEmpty()
    .isLength({ min: 10 })
    .withMessage("Votre message doit contenir minimum 10 charactères"),
];
