// Sélecteurs
const btnListe = document.getElementById('btn-liste');
const modalListe = document.getElementById('modal-liste');
const modalCloseListe = document.getElementById('modal-close-liste');
const listeBlagues = document.getElementById('liste-blagues');

const btnAjout = document.getElementById('btn-ajout');
const modalAjout = document.getElementById('modal-ajout');
const modalCloseAjout = document.getElementById('modal-close-ajout');
const formAjout = document.getElementById('form-ajout');
const inputQuestion = document.getElementById('input-question');
const inputReponse = document.getElementById('input-reponse');
const messageAjout = document.getElementById('message-ajout');

const btnAfficher = document.getElementById('btn-afficher');
const btnReponse = document.getElementById('btn-reponse');
const questionEl = document.getElementById('question');
const reponseEl = document.getElementById('reponse');

const API_BASE = 'https://carambar-co-blague-back.onrender.com/api/v1/blagues';

let blagueCourante = null;

// Liste des blagues

btnListe.addEventListener('click', () => {
  listeBlagues.innerHTML = '<li>Chargement...</li>';
  modalListe.style.display = 'block';

  fetch(`${API_BASE}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.length) {
        listeBlagues.innerHTML = '<li>Aucune blague disponible.</li>';
        return;
      }
      listeBlagues.innerHTML = '';
      data.forEach(blague => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Q :</strong> ${blague.question}<br/><em>R :</em> ${blague.reponse}`;
        listeBlagues.appendChild(li);
      });
    })
    .catch(err => {
      listeBlagues.innerHTML = `<li>Erreur lors du chargement : ${err.message}</li>`;
    });
});

modalCloseListe.addEventListener('click', () => {
  modalListe.style.display = 'none';
});

//Ajout d'une blague 
btnAjout.addEventListener('click', () => {
  modalAjout.style.display = 'block';
  messageAjout.textContent = '';
  formAjout.reset();
});

modalCloseAjout.addEventListener('click', () => {
  modalAjout.style.display = 'none';
});

// Fermer modales en cliquant en dehors
window.addEventListener('click', (e) => {
  if (e.target === modalListe) modalListe.style.display = 'none';
  if (e.target === modalAjout) modalAjout.style.display = 'none';
});

formAjout.addEventListener('submit', (e) => {
  e.preventDefault();

  const question = inputQuestion.value.trim();
  const reponse = inputReponse.value.trim();

  if (!question || !reponse) {
    messageAjout.style.color = 'red';
    messageAjout.textContent = 'Merci de remplir question et réponse.';
    return;
  }

  messageAjout.style.color = 'black';
  messageAjout.textContent = 'Envoi en cours...';

  fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, reponse }),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      messageAjout.style.color = 'green';
      messageAjout.textContent = 'Blague ajoutée avec succès !';
      formAjout.reset();
    })
    .catch(err => {
      messageAjout.style.color = 'red';
      messageAjout.textContent = 'Erreur lors de l\'ajout : ' + err.message;
    });
});

//  Blague aléatoire

btnAfficher.addEventListener('click', () => {
  questionEl.textContent = 'Chargement...';
  reponseEl.style.display = 'none';
  btnReponse.disabled = true;
  reponseEl.textContent = '';

  fetch(`${API_BASE}/random`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data || !data.question || !data.reponse) {
        questionEl.textContent = 'Blague introuvable ou mal formatée.';
        return;
      }
      blagueCourante = data;
      questionEl.textContent = data.question;
      btnReponse.disabled = false;
    })
    .catch(err => {
      questionEl.textContent = 'Erreur lors de la récupération de la blague : ' + err.message;
    });
});

// Voir réponse 
btnReponse.addEventListener('click', () => {
  if (!blagueCourante) return;
  reponseEl.style.display = 'block';
  reponseEl.textContent = blagueCourante.reponse;
});
