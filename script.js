const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const uploadBtn = document.getElementById('uploadBtn');
const semesterSelect = document.getElementById('semesterSelect');
const pdfList = document.getElementById('pdf-list');
const pdfViewer = document.getElementById('pdfViewer');

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
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }
  formData.append('semester', semester);

  fetch('http://localhost:3000', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert('Upload erfolgreich!');
    loadPdfList();
  })
  .catch(err => console.error(err));
}

function loadPdfList() {
  fetch('/pdfs')
  .then(res => res.json())
  .then(data => {
    pdfList.innerHTML = '';
    data.forEach(pdf => {
      const div = document.createElement('div');
      div.textContent = `${pdf.name} (${pdf.semester})`;
      div.addEventListener('click', () => {
        pdfViewer.src = pdf.url;
      });
      pdfList.appendChild(div);
    });
  });
}

// Initial laden
loadPdfList();

