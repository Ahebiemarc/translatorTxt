import { useEffect, useState } from "react";
import { fetchPhrases, submitTranslations } from "./service/api";
import "./App.css"

import img2 from "../public/logo.png";


interface Phrase {
  _id: string;
  Arabizi: string;
  French: string;
}

const PHRASES_PER_PAGE = 100;


function App() {

  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [translations, setTranslations] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Récupère les phrases depuis l'API
  useEffect(() => {
    const loadPhrases = async () => {
      try {
        const data = await fetchPhrases(currentPage, PHRASES_PER_PAGE);
        console.log(data);
        
        setPhrases(data.phrases);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    loadPhrases();
  }, [currentPage]);

  // Gestion des inputs de traduction
  const handleTranslationChange = (id: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Vérifie si tous les champs sont remplis
  const allInputsFilled =
  Object.keys(translations).length === phrases.length && // Vérifie qu'il y a une correspondance
  Object.values(translations).every((value) => value.trim() !== "" && value.length !== 0); // Vérifie que tous les champs sont remplis
  

  // Soumission des traductions
  const handleSubmit = async () => {
    if (!allInputsFilled) return;

    try {
      const data = Object.keys(translations).map((id) => ({
        id,
        French: translations[id],
      }));

      console.log(data);
      

      await submitTranslations(data);

      alert("Traductions envoyées avec succès !");
      setTranslations({});
      setCurrentPage(1); // Recharger les phrases ou revenir à la première page
    } catch (error) {
      alert("Une erreur s'est produite, veuillez réessayer.");
    }
  };

  return (
      <div className="container">
      <h1>Traduction des Phrases</h1>
      <img src={img2} className="image" />
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Arab tounsi </th>
            <th>Traduction (Français)</th>
          </tr>
        </thead>
        <tbody>
          {phrases.map((phrase, index) => (
            <tr key={phrase._id}>
              <td>{index + 1 + (currentPage - 1) * PHRASES_PER_PAGE}</td>
              <td>{phrase.Arabizi}</td>
              <td>
                <textarea
                  data-gramm="false"
                  value={translations[phrase._id] || ""}
                  onChange={(e) => handleTranslationChange(phrase._id, e.target.value)}
                  className="translation-textarea"
                  rows={8} // Nombre de lignes visibles
                  placeholder="Saisir la traduction..."
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Suivant
        </button>
      </div>

      {/* Bouton Envoyer */}
      <button disabled={!allInputsFilled} onClick={handleSubmit} className="send-btn">
        Envoyer les traductions
      </button>
    </div>
  )
}

export default App
