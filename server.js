const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
// Optional, falls du Server-seitige Cloudinary Aktionen machen willst
// const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PDF_FILE = './pdfs.json';

// --- Optional: Cloudinary Config via Environment Variables ---
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// --- GET /pdfs ---
// Gibt die persistente Liste aller PDFs zurück
app.get('/pdfs', async (req, res) => {
  const pdfs = await fs.readJson(PDF_FILE);
  res.json(pdfs);
});

// --- POST /add-pdf ---
// Fügt neue PDFs in die JSON-Liste ein
app.post('/add-pdf', async (req, res) => {
  const { name, semester, url } = req.body;
  if (!name || !semester || !url) {
    return res.status(400).json({ error: 'Missing data' });
  }

  const pdfs = await fs.readJson(PDF_FILE);
  pdfs.push({ name, semester, url });
  await fs.writeJson(PDF_FILE, pdfs, { spaces: 2 });

  res.json({ success: true });
});

// --- Server starten ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

