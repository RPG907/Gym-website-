import { body } from "express-validator";

// Doit etre en format mm/aa et etre valide
const regexDateDexpiration = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
// Doit avoir 3 chiffres
const regexCVV = /^[0-9]{3}$/;

export const ajouterCarteUtilisateurValidation = [
  body("cardHolderName")
    .notEmpty()
    .withMessage("Le nom ne peut pas être vide")
    .isAlpha()
    .withMessage("Le nom contenir seulement des lettres"),
  body("dateExpiration")
    .matches(regexDateDexpiration)
    .withMessage(
      "La date d'expiration doit etre valide et etre dans le format suivant mm/aa"
    ),
  body("cvv")
    .matches(regexCVV)
    .withMessage("Le cvv doit etre un nombre a trois chiffres"),
];

export const modifierCarteUtilisateurValidation = [
    body("cardHolderName")
      .notEmpty()
      .withMessage("Le nom ne peut pas etre vide")
      .isAlpha()
      .withMessage("Le nom contenir seulement des lettres"),
    body("dateExpiration")
      .matches(regexDateDexpiration)
      .withMessage(
        "La date d'expiration doit etre valide et etre dans le format suivant mm/aa"
      ),
    body("cvv")
      .matches(regexCVV)
      .withMessage("Le cvv doit etre un nombre a trois chiffres"),
  ];
