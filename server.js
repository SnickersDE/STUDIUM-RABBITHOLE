import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import path from 'path';
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

});

dotenvConfig();
// Hilfsvariablen für ES-Module (statt __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
const app = express();
const PORT = process.env.PORT || 4000;

// Laden des Frontend und Einbindung der Respo Dateien
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'index.html')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html, style.css'));

app.use(express.static("public"));

// Cloudinary Konfiguration
cloudinary.config({
  cloud_name: process.env.dkt1uwxg7,
  api_key: process.env.414614911359457
  api_secret: process.env.mq7xiUOH5nKPcHGQzg1KkMbzBUs
});

// Upload Endpoint
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "lernsoftwareV2"
    });
    // Lokale Temp-Datei löschen
    fs.unlinkSync(req.file.path);
    res.json({ message: "Datei erfolgreich hochgeladen!", url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload fehlgeschlagen" });
  }
});

// PDF Liste Endpoint (Cloudinary)
app.get("/files", async (req, res) => {
  try {
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "lernsoftware2V/",
      resource_type: "raw"
    });
    const files = resources.resources.map(f => ({
      name: f.public_id.split("/").pop(),
      url: f.secure_url
    }));
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Konnte PDF-Liste nicht laden" });
  }
});

app.listen(PORT, () => console.log(`✅ Server läuft auf http://localhost:${PORT}`));


