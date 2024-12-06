import {Router} from "express";
import { getPhrases, addTranslations } from "../controllers/Phrase.controllers";

const router = Router();

router.get("/phrases", getPhrases);
router.post("/add-translation", addTranslations);


export default router;