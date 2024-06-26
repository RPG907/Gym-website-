import { body } from "express-validator";

export const ajouterServiceMembership = [
  body("nomDeService")
    .notEmpty()
    .withMessage("Le nom du service ne peut pas être vide"),
  body("description")
    .notEmpty()
    .withMessage("La description du service ne peut pas être vide")
    .isLength({ min: 10 })
    .withMessage("La description doit contenir au moins 10 caractères"),
];


export const modifierServiceMembership = [
    body("nomDeService")
      .notEmpty()
      .withMessage("Le nom du service ne peut pas être vide"),
    body("description")
      .notEmpty()
      .withMessage("La description du service ne peut pas être vide")
      .isLength({ min: 10 })
      .withMessage("La description doit contenir au moins 10 caractères"),
  ];