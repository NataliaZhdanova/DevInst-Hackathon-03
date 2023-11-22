import express from "express";
const router = express.Router();
import bodyParser from "body-parser";
import knex from "knex";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "public",
    port: 5432
  }
});

router.use(bodyParser.json());

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

router.get("/random-verb", async(req, res) => {
    try {
        const randomVerb = await db("verbs").select("*").orderByRaw("RANDOM()").limit(1);

        if (randomVerb.length > 0) {
            res.status(200).json(randomVerb[0]);
        } else {
            res.status(404).json({ error: "No verbs found. You need to add some to the database." });
        }
    } catch (error) {
        console.error("Error fetching random verb:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/openai", async(req, res) => {
    const verb = req.query.verb;
    try {
        const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `Create 9 meaningful sentences with a word ${verb} in the following tenses: Präsens, Präteritum, Perfekt, Plusquamperfekt, Futur I, Futur II, Konjunktiv I, Konjunktiv II, Konditional II.` }],
        model: "gpt-3.5-turbo",
        });
        res.status(200).json(completion.choices[0]);
    } catch (error) {
        console.error("Error fetching sentences:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/verb", async (req, res) => {
    try {
      const { verb, translation, state } = req.body;
      const verbExists = await db.select("verb").from("verbs").where("verb", "=", verb);
  
      if (verbExists.length > 0) {
        return res.status(400).json({ error: "This verb already exists!" });
      }
  
      await db("verbs").insert({ verb, translation, state });
      res.status(201).json({ message: "The verb is saved successfully!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.put("/verb", async (req, res) => {
    try {
      const { verb, translation, state } = req.body;
      
      await db("verbs").update({ verb, translation, state }).where("verb", "=", verb);
      res.status(201).json({ message: "The verb is updated successfully!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.post("/sentences", async (req, res) => {
    try {
      const { verb, sentences } = req.body;

      await db("sentences").insert({ verb, sentences });
      res.status(201).json({ message: "Sentences are saved successfully!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;