import { body } from "express-validator";

export const ajouterMembershipTypeValidation = [
  body("membershipTypeName")
    .notEmpty()
    .withMessage("Le nom du type de la membership ne peut pas être vide"),
  body("prixMembershipType")
    .notEmpty()
    .withMessage("Le prix de la membership ne peut pas être vide")
];

export const modifierMembershipTypeValidation = [
  body("membershipTypeName")
    .notEmpty()
    .withMessage("Le nom du type de la membership ne peut pas être vide"),  
  body("prixMembershipType")
    .notEmpty("Le prix de la membership ne peut pas être vide")
    .withMessage("")   
];
