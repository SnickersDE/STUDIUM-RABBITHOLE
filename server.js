import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config as dotenvConfig } from "dotenv";
import fs from "fs";
import path from 'path';
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

dotenvConfig();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Cloudinary Konfiguration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Setup (lokal temporär)
const upload = multer({ dest: "tmp/" });

// Upload Endpoint
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "lernsoftware"
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
      prefix: "lernsoftware/",
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

