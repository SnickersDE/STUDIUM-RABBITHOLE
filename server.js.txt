const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// Ordnerstruktur: uploads/semesterX
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const semester = req.body.semester;
    const dir = path.join(__dirname, 'uploads', semester);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Upload Endpoint
app.post('/upload', upload.array('files'), (req, res) => {
  res.json({ message: 'Upload erfolgreich' });
});

// PDF Liste Endpoint
app.get('/pdfs', (req, res) => {
  const semesters = ['semester1','semester2','semester3','semester4','semester5','semester6'];
  let pdfs = [];

  semesters.forEach(sem => {
    const dir = path.join(__dirname, 'uploads', sem);
    if(fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        pdfs.push({
          name: file,
          semester: sem,
          url: `/uploads/${sem}/${file}`
        });
      });
    }
  });
  res.json(pdfs);
});

// Server starten
app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));
