const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const uploadBtn = document.getElementById('uploadBtn');
const pdfList = document.getElementById('pdf-list');
const pdfViewer = document.getElementById('pdfViewer');

// Drag & Drop Events
dropArea.addEventListener('dragover', e => e.preventDefault());
dropArea.addEventListener('drop', handleDrop);

// Klick auf DropArea öffnet Dateiauswahl
dropArea.addEventListener('click', () => fileElem.click());
uploadBtn.addEventListener('click', () => uploadFiles(fileElem.files));

function handleDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  uploadFiles(files);
}

// Upload Files zu Cloudinary
async function uploadFiles(files) {
  if (!files.length) return;

  for (const file of files) {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.url){
        alert(`Upload erfolgreich: ${file.name}`);
      } else {
        alert('Fehler beim Upload');
      }
      loadPdfList();
    } catch (err) {
      console.error(err);
      alert('Fehler beim Upload');
    }
  }
}

// PDFs von Cloudinary laden
async function loadPdfList() {
  try {
    const res = await fetch('http://localhost:3000/files');
    const files = await res.json();

    pdfList.innerHTML = '';

    files.forEach(file => {
      const li = document.createElement('li');
      li.textContent = file.name;
      li.style.cursor = "pointer";
      li.addEventListener('click', () => {
        pdfViewer.src = file.url; // Cloudinary URL
      });
      pdfList.appendChild(li);
    });

  } catch (err) {
    console.error('Fehler beim Laden der PDF-Liste:', err);
  }
}

// Initiales Laden
loadPdfList();
