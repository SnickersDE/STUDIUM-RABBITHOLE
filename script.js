const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const uploadBtn = document.getElementById('uploadBtn');
const semesterSelect = document.getElementById('semesterSelect');
const pdfList = document.getElementById('pdf-list');
const pdfViewer = document.getElementById('pdfViewer');

// Cloudinary Config
const cloudName = 'DEIN_CLOUD_NAME'; // von Cloudinary Dashboard
const uploadPreset = 'DEIN_UPLOAD_PRESET'; // im Dashboard unsigned anlegen

// Drag & Drop Event Listener
dropArea.addEventListener('dragover', e => e.preventDefault());
dropArea.addEventListener('drop', handleDrop);

function handleDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  uploadFiles(files);
}

uploadBtn.addEventListener('click', () => {
  const files = fileElem.files;
  uploadFiles(files);
});

function uploadFiles(files) {
  const semester = semesterSelect.value;

  for (const file of files) {
    // Cloudinary Upload Widget (programmatisch)
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', semester); // speichert im Semester-Ordner

    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log('Upload erfolgreich:', data.secure_url);
      alert(`Upload erfolgreich: ${file.name}`);
      addPdfToList(data.secure_url, semester);
    })
    .catch(err => console.error(err));
  }
}

// PDF-Liste im Frontend verwalten
function addPdfToList(url, semester) {
  const div = document.createElement('div');
  div.textContent = `${semester}: ${url.split('/').pop()}`;
  div.addEventListener('click', () => {
    pdfViewer.src = url;
  });
  pdfList.appendChild(div);
}

// Optional: alte loadPdfList Funktion behalten, falls du irgendwann ein Backend nutzen willst
function loadPdfList() {
  pdfList.innerHTML = ''; // bisher leer
  // Cloudinary selbst speichert keine "Liste" automatisch im Frontend
  // Du könntest hier CSV/JSON speichern oder Cloudinary Admin API nutzen, falls nötig
}

// Initial laden
loadPdfList();
