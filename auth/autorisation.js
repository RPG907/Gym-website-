import jwt from "jsonwebtoken";
import util from 'util'

const verify = util.promisify(jwt.verify);

export const verifierToken = async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).json({ message: "Vous n'êtes pas connecté" });
  }

  if (!bearerToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Format de token invalide" });
  }

  const token = bearerToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token malformé" });
  }

  try{
    const payload = await verify(token, process.env.CODE_SECRET);
    req.userId = payload.id;
    next();
  }catch(error){
    return res.status(401).json({ message: "Token invalide: " + error.message });
  }  
};

/*export const isAdministrateur = async (req, res, next) => {
  const id = req.userId;

  try {
    if (id === -1) {
      return next();
    } else {
      return res
        .status(403) 
        .json({ message: "Accès interdit : vous n'êtes pas administrateur." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche de l'utilisateur",
      error: error.message,
    });
  }
};*/
