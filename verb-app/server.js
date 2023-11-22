import express from "express";
import router from "./routes/index.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 9000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.use("/", router);
