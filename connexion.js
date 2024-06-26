import { existsSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

const env = dotenv.config();
console.log("DB_NAME:", process.env.DB_NAME);

/**
 * Constante indiquant si la base de données existe au démarrage du serveur
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_NAME);

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
  let connection = await connectionPromise;

  await connection.exec(
    `  
        
      CREATE TABLE IF NOT EXISTS User(
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        address TEXT,
        photo BLOB,
        joining_date TEXT
      );

      CREATE TABLE IF NOT EXISTS UserCard(
        userCard_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cardHolderName TEXT NOT NULL,
        address TEXT NOT NULL,
        postalCode TEXT NOT NULL,
        province TEXT NOT NULL,
        cardNumber TEXT NOT NULL,
        expMonth INTEGER NOT NULL,
        expYear INTEGER NOT NULL,
        cvv INTEGER NOT NULL,
        user_id INTEGER,
        CONSTRAINT fk_user_userCard
            FOREIGN KEY (user_id)
            REFERENCES User(user_id)
            ON DELETE SET NULL
            ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS WorkoutPlan(
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_name TEXT,
        description TEXT,
        plan_content TEXT
      );

      CREATE TABLE IF NOT EXISTS MembershipType(
        type_id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_name TEXT,
        description TEXT,
        price REAL
      );

      CREATE TABLE IF NOT EXISTS Video(
        video_id INTEGER PRIMARY KEY AUTOINCREMENT,
        videoName TEXT,
        videoFilePath TEXT
      )

      CREATE TABLE IF NOT EXISTS MembershipService(
        service_id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_id INTEGER NOT NULL,
        service_name TEXT,
        description TEXT,
        CONSTRAINT fk_membershipType_membershipService 
            FOREIGN KEY (type_id)
            REFERENCES MembershipType(type_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Membership(
        membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        membership_type_id INTEGER NOT NULL,
        start_date TEXT,
        end_date TEXT,
        CONSTRAINT fk_membershipType_membership 
            FOREIGN KEY (membership_type_id)
            REFERENCES MembershipType(type_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE,
        CONSTRAINT fk_user_membership
            FOREIGN KEY (user_id)
            REFERENCES User(user_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
      );


      CREATE TABLE IF NOT EXISTS MembershipPayment(
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        membership_id INTEGER NOT NULL,
        payment_date TEXT,
        amount_paid REAL,
        CONSTRAINT fk_user_membershipPayment
            FOREIGN KEY (user_id)
            REFERENCES User(user_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE,
        CONSTRAINT fk_membership_membershipPayment
            FOREIGN KEY (membership_id)
            REFERENCES Membership(membership_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS UserWorkoutPlan(
        user_workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        start_date TEXT,
        end_date TEXT,
        CONSTRAINT fk_user_userWorkoutPlan
            FOREIGN KEY (user_id)
            REFERENCES User(user_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE,
        CONSTRAINT fk_workoutPlan_UserWorkoutPlan
            FOREIGN KEY (plan_id)
            REFERENCES WorkoutPlan(plan_id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Rabais(
        rabais_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pourcentage_rabais TEXT,
        start_date TEXT,
        end_date TEXT,
        CONSTRAINT fk_membershipType_Rabais
        FOREIGN KEY (type_id)
        REFERENCES MembershipType(type_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
      );

        `
  );

  return connection;
};

// Base de données dans un fichier
export let connectionPromise = open({
  filename: process.env.DB_NAME,
  driver: sqlite3.Database,
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
  connectionPromise = createDatabase(connectionPromise).catch((error) => {
    console.error("Erreur lors de la création de la base de données:", error);
    process.exit(1);
  });
}

//export default database;
