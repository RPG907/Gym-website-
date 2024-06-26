import { body } from "express-validator";

const regexMotDePasse =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  export const ajouterUtilisateurValidation = [
    body("nom")
      .notEmpty()
      .withMessage("Le nom ne peut pas être vide")
      .isAlpha('fr-FR', { ignore: ' ' })
      .withMessage("Le nom doit contenir que des lettres")
      .isLength({ min: 2 })
      .withMessage("Le nom doit avoir minimum 2 lettres"),
    body("prenom")
      .notEmpty()
      .withMessage("Le prénom ne peut pas être vide")
      .isAlpha('fr-FR', { ignore: ' ' })
      .withMessage("Le prénom doit contenir que des lettres")
      .isLength({ min: 2 })
      .withMessage("Le prénom doit avoir minimum 2 lettres"),
    body("email")
      .isEmail()
      .withMessage("L'email doit être une adresse email valide"),
    body("motPasse")
      .matches(regexMotDePasse)
      .withMessage(
        "Le mot de passe doit inclure au moins une majuscule, une minuscule, un chiffre, un caractère spécial et doit être d'au moins 8 caractères de long"
      ),
  ];

export const modifierUtilisateurValidation = [
    body("nom")
      .notEmpty()
      .withMessage("Le nom ne peut pas etre vide")
      .isAlpha()
      .withMessage("Le nom doit contenir que des lettres")
      .withMessage("Le nom doit avoir minimum 2 lettres"),
    body("prenom")
      .notEmpty()
      .withMessage("Le prenom ne peut pas etre vide")
      .isAlpha()
      .withMessage("Le prenom doit contenir que des lettres")
      .withMessage("Le prenom doit avoir minimum 2 lettres"),
    body("email").isEmail(),
    body("motPasse")
      .matches(regexMotDePasse)
      .withMessage(
        "Le mot de passe doit inclure une majuscule, une minuscule, un nombre, un caractère spécial et doit être d'au moins 8 caractères de long"
      ),
  ];
