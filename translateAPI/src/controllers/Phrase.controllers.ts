import {Request, Response} from "express";
import Phrase from "../models/Phrase.model";


// Afficher les phrases dont la traduction en français est vide avec pagination
export const getPhrases = async (req: Request, res: Response) => {
    try {
      // Récupérer les paramètres de pagination (page et limit)
      const page = parseInt(req.query.page as string) || 1; // Page par défaut : 1
      const limit = parseInt(req.query.limit as string) || 100; // Taille par défaut : 100
  
      // Calculer le nombre de documents à ignorer
      const skip = (page - 1) * limit;
  
      // Récupérer les phrases avec pagination
      const phrases = await Phrase.find({ French: "" })
        .skip(skip)
        .limit(limit);
  
      // Compter le total de phrases sans traduction
      const total = await Phrase.countDocuments({ French: "" });
  
      // Retourner les résultats avec des informations de pagination
      res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: phrases,
      });
    } catch (error) {
      console.error("Error fetching phrases:", error);
      res.status(500).json({ message: "Server error" });
    }
};


// Ajouter une traduction en français
/*export const addTranslation = async (req: Request, res: Response) => {
    const { id, French } = req.body; 
  
    if (!id || !French) {
      return res.status(400).json({ message: "Missing id or French translation" });
    }
  
    try {
      const phrase = await Phrase.findById(id);
      if (!phrase) {
        return res.status(404).json({ message: "Phrase not found" });
      }
  
      phrase.French = French;
      await phrase.save();
  
      res.json({ message: "Translation added", phrase });
    } catch (error) {
      console.error("Error adding translation:", error);
      res.status(500).json({ message: "Server error" });
    }
};
*/
// Traduire plusieurs phrases
export const addTranslations = async (req: Request, res: Response) => {
  try {
    const translations = req.body.translations; // Attend un tableau d'objets { id, French }

    // Vérifie que les traductions sont fournies
    if (!Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({ message: "Translations array is required." });
    }

    const updatedPhrases = [];
    for (const { id, French } of translations) {
      // Vérifie que chaque objet contient `id` et `French`
      if (!id || !French) {
        return res
          .status(400)
          .json({ message: "Each translation must include an id and French text." });
      }

      // Mets à jour la traduction pour chaque phrase
      const updatedPhrase = await Phrase.findByIdAndUpdate(
        id,
        { French },
        { new: true }
      );

      if (!updatedPhrase) {
        return res
          .status(404)
          .json({ message: `Phrase with id ${id} not found.` });
      }

      updatedPhrases.push(updatedPhrase);
    }

    res.json({ message: "Translations updated successfully.", data: updatedPhrases });
  } catch (error) {
    console.error("Error adding translations:", error);
    res.status(500).json({ message: "Server error." });
  }
};
