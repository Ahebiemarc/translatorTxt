import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./src/config/db";
import phraseRoutes from "./src/routes/Phrase.route";

dotenv.config();

// création de l'application express
const app = express();



app.use(cors());
app.use(express.json()); // Middleware pour parser les JSON dans les requêtes




connectDB();

app.use("/api/v1/translation", phraseRoutes);


// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});