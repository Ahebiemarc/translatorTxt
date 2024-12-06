import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

console.log(BASE_URL);


export const fetchPhrases = async (page: number, limit: number) : Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/translation/phrases?page=${page}&limit=${limit}`);
      return response.data; // { phrases, totalPages }
    } catch (error) {
      console.error("Erreur lors de la récupération des phrases :", error);
      throw new Error("Erreur lors de la récupération des phrases");
    }
  };
  
  export const submitTranslations = async (translations: { id: string; French: string }[]) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/translation/add-translations`, { translations });
      return response;
    } catch (error) {
      console.error("Erreur lors de l'envoi des traductions :", error);
      throw new Error("Erreur lors de l'envoi des traductions");
    }
  };