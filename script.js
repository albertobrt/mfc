/* =========================================================
   MONTREUIL FOOTBALL CLUB — SCRIPT
   ========================================================= */

const pageBanner = document.querySelector('.page-banner');
const bannerByPage = {
  actualites: 'page-banner--actualites',
  calendrier: 'page-banner--calendrier',
  effectif: 'page-banner--effectif',
  'nos-equipes': 'page-banner--equipes',
  'pole-elite': 'page-banner--equipes',
  'pole-feminines': 'page-banner--equipes',
  'pole-performance': 'page-banner--equipes',
  apropos: 'page-banner--stade',
  boutique: 'page-banner--boutique',
  contact: 'page-banner--stade',
  educateurs: 'page-banner--stade',
  pratique: 'page-banner--club',
  staff: 'page-banner--stade'
};

if (pageBanner) {
  const pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const bannerClass = bannerByPage[pageName];
  if (bannerClass) pageBanner.classList.add(bannerClass);
}

const offcanvasNav = document.querySelector('#offcanvas > ul');
if (offcanvasNav && !offcanvasNav.querySelector('a[href="boutique.html"]')) {
  const boutiqueItem = document.createElement('li');
  boutiqueItem.innerHTML = '<a href="boutique.html">Boutique</a>';
  const clubItem = offcanvasNav.querySelector('details summary');
  clubItem?.closest('li')?.before(boutiqueItem);
}

if (!window.location.hash && (window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/'))) {
  window.history.scrollRestoration = 'manual';
  window.addEventListener('load', () => window.scrollTo(0, 0));
}

document.addEventListener('DOMContentLoaded', () => {
    /* ---------- 0. INTRO D'OUVERTURE (une fois par session) ---------- */
  const intro = document.getElementById('intro');
  if (intro){
    if (sessionStorage.getItem('mfcIntroShown')){
      intro.remove();
      document.body.style.overflow = '';
    } else {
      const introSkip = document.getElementById('introSkip');
      function closeIntro(){
        intro.classList.add('intro--out');
        document.body.style.overflow = '';
        sessionStorage.setItem('mfcIntroShown', '1');
        setTimeout(() => intro.remove(), 650);
      }
      introSkip.addEventListener('click', closeIntro);
      setTimeout(closeIntro, 2300);
    }
  }

  /* ---------- 1. MENU LATÉRAL (3 traits) ---------- */
  const burger = document.getElementById('burgerBtn');
  const offcanvas = document.getElementById('offcanvas');
  const backdrop = document.getElementById('offcanvasBackdrop');

  function toggleMenu(open){
    const isOpen = open ?? !offcanvas.classList.contains('open');
    offcanvas.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  }
  burger.addEventListener('click', () => toggleMenu());
  backdrop.addEventListener('click', () => toggleMenu(false));
  offcanvas.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- 2. LIEN ACTIF DANS LE MENU ---------- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  offcanvas.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
      a.classList.add('active');
      const parentDetails = a.closest('details');
      if (parentDetails) parentDetails.open = true;
    }
  });

  /* ---------- 3. COMPTE À REBOURS PROCHAIN MATCH ---------- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl){
    const matchDate = new Date(2026, 8, 19, 18, 0, 0);

    function updateCountdown(){
      const now = new Date();
      let diff = Math.max(0, matchDate - now);
      const j = Math.floor(diff / 86400000); diff -= j * 86400000;
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
      const m = Math.floor(diff / 60000);   
      countdownEl.innerHTML = `${j}<small>j</small>${h}<small>h</small>${m}<small>m</small>`;
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  /* ---------- 4. EFFECTIF — DONNÉES + RENDU ---------- */
  const squad = [
    { prenom:'Anthony Adel',       photo:'Anthony-Adel.jpg',       poste:'Milieu'    },
    { prenom:'Dialla Danfakha',    photo:'Dialla-DANFAKHA.jpg',    poste:'Milieu'    },
    { prenom:'Fousseny Diabate',   photo:'Fousseny-DIABATE.jpg',   poste:'Attaquant' },
    { prenom:'Kalvin Guede',       photo:'Kalvin-GUEDE.jpg',       poste:'Défenseur' },
    { prenom:'Mahamadou Sissoko',  photo:'Mahamadou-SISSOKO.jpg',  poste:'Défenseur' },
    { prenom:'Mamoudou Sow',       photo:'Mamoudou-SOW.jpg',       poste:'Défenseur' },
    { prenom:'Matala Coulibaly',   photo:'Matala-COULIBALY.jpg',   poste:'Défenseur' },
    { prenom:'Mehdi Khaouad',      photo:'Mehdi-KHAOUAD.jpg',      poste:'Défenseur' },
    { prenom:'Mohand Lounici',     photo:'Mohand-Lounici.jpg',     poste:'Attaquant' },
    { prenom:'Mouhamed Sangare',   photo:'Mouhamed-SANGARE.jpg',   poste:'Milieu'    },
    { prenom:'Oumar Sissoko',      photo:'Oumar-SISSOKO.jpg',      poste:'Gardien'   },
    { prenom:'Rohan Sadala Alain', photo:'Rohan-SADALA-ALAIN.jpg', poste:'Milieu'    },
    { prenom:'Romann Mivekannin',  photo:'Romann-MIVEKANNIN.jpg',  poste:'À définir' },
    { prenom:'Saloum Soumare',     photo:'Saloum-SOUMARE.jpg',     poste:'Attaquant' },
    { prenom:'Yoann-Axel Nkouka',  photo:'Yoann-Axel-NKOUKA.jpg',  poste:'Défenseur' },
  ];

  function slugify(str){
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }

  function buildCard(person, roleKey){
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <div class="player-photo" data-initial="${person.prenom.charAt(0)}">
        <img src="assets/players/${person.photo}" alt="Photo de ${person.prenom}, joueur du Montreuil Football Club">
        <div class="player-photo__caption">
          <div class="player-card__name">${person.prenom}</div>
          <div class="player-card__pos">${person[roleKey]}</div>
        </div>
      </div>
    `;
    const img = card.querySelector('img');
    const photoBox = card.querySelector('.player-photo');
    img.addEventListener('load', () => photoBox.classList.add('has-photo'));
    img.addEventListener('error', () => photoBox.classList.remove('has-photo'));
    return card;
  }

  // Carrousel (aperçu sur la page d'accueil)
  const track = document.getElementById('squadTrack');
  if (track){
    [...squad, ...squad].forEach(p => track.appendChild(buildCard(p, 'poste')));
  }

  // Grille complète (page Effectif)
  const grid = document.getElementById('squadGrid');
  if (grid){
    squad.forEach(p => grid.appendChild(buildCard(p, 'poste')));
  }

  // Éducateurs (page Éducateurs)
  const educGrid = document.getElementById('educateursGrid');
  if (educGrid){
    const educateurs = [
      { prenom:'Karim',   poste:'Éducateur U6-U9'   },
      { prenom:'Sarah',   poste:'Éducateur U10-U13' },
      { prenom:'Julien',  poste:'Éducateur U15'     },
      { prenom:'Nadia',   poste:'Éducateur U17'     },
      { prenom:'Marc',    poste:'Entraîneur Seniors'},
      { prenom:'Fatou',   poste:'Entraîneur adjoint'},
    ];
    educateurs.forEach(p => educGrid.appendChild(buildCard(p, 'poste')));
  }

  // Comité directeur (page Staff)
  const staffGrid = document.getElementById('staffGrid');
  if (staffGrid){
    const staff = [
      { prenom:'Abdoulaye Sow',           poste:'Président'                     },
      { prenom:'Abdessamad Cherfouni',    poste:"Vice-président d'honneur"     },
      { prenom:'Mathieu Gomis',           poste:'Vice-président'                },
      { prenom:'Marc Guenzi',             poste:'Secrétaire général'            },
      { prenom:'Mara Djikine',            poste:'Secrétaire adjoint'             },
      { prenom:'Aimé Crepin',             poste:'Trésorier'                     },
      { prenom:'Demba Sissoko',           poste:'Responsable communication'     },
      { prenom:'Gilberto da Graça',       poste:'Responsable technique'         },
      { prenom:'Laura Guenzi',            poste:'Membre'                        },
    ];
    staff.forEach(p => staffGrid.appendChild(buildCard(p, 'poste')));
  }

  /* ---------- 5. LOGOS PARTENAIRES (repli si logo manquant) ---------- */
    document.querySelectorAll('.partner-logo img').forEach(img => {
    const box = img.closest('.partner-logo');
    if (img.complete && img.naturalWidth > 0) {
      box.classList.add('has-logo');
    } else {
      img.addEventListener('load', () => box.classList.add('has-logo'));
      img.addEventListener('error', () => box.classList.remove('has-logo'));
    }
  });
   

      /* ---------- 5bis. PHOTOS BOUTIQUE (repli si photo manquante) ---------- */
  document.querySelectorAll('.product__photo img').forEach(img => {
    const box = img.closest('.product__photo');
    if (img.complete && img.naturalWidth > 0) {
      box.classList.add('has-photo');
    }  else {
      img.addEventListener('load', () => box.classList.add('has-photo'));
      img.addEventListener('error', () => box.classList.remove('has-photo'));
    }
  });

    /* ---------- 4bis. CALENDRIER DE LA SAISON (sept. 2026 → juin 2027) ---------- */
    const MATCHES = [
    { date:'2026-09-05', opponent:'Le Mée Sports',          home:true  },
    { date:'2026-09-13', opponent:'Grigny Football 91',     home:false },
    { date:'2026-09-19', opponent:'Mantois 78 FC',          home:false },
    { date:'2026-10-03', opponent:'FC 93 Bobigny',          home:true  },
    { date:'2026-10-17', opponent:'St Brice F.C.',          home:false },
    { date:'2026-10-31', opponent:'Aulnaysienne ESP',       home:true  },
    { date:'2026-11-07', opponent:'Paris 13 Atletico 2',    home:true  },
    { date:'2026-11-21', opponent:'Mureaux OFC',            home:false },
    { date:'2026-11-28', opponent:'Montrouge',              home:true  },
    { date:'2026-12-05', opponent:'Mitry Compans Goelly',   home:false },
    { date:'2026-12-12', opponent:'St Leu 95 FC',           home:true  },
    { date:'2027-01-16', opponent:'Ulis CO',                home:false },
    { date:'2027-01-23', opponent:'St Brice FC',            home:true  },
    { date:'2027-01-30', opponent:'Aulnaysienne ESP',       home:false },
    { date:'2027-02-28', opponent:'Paris 13 Atletico 2',    home:false },
    { date:'2027-03-06', opponent:'Mureaux OFC',            home:true  },
    { date:'2027-03-13', opponent:'Montrouge FC 92',        home:false },
    { date:'2027-03-20', opponent:'Mitry Compans Goelly',   home:true  },
    { date:'2027-04-04', opponent:'Le Mée Sports',          home:false },
    { date:'2027-04-24', opponent:'St Leu 95 FC',           home:false },
    { date:'2027-05-08', opponent:'Mantois 78 FC',          home:true  },
    { date:'2027-05-22', opponent:'Ulis CO',                home:true  },
    { date:'2027-05-29', opponent:'FC 93 Bobigny',          home:false },
    // Pour ajouter un match : copie une ligne et modifie date / opponent / home (true = domicile, false = extérieur)
  ];

  const HOUSE_ICON = `<svg class="day-cell__icon" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v10h14V10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const BUS_ICON   = `<svg class="day-cell__icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7.5" cy="19" r="1.5" fill="currentColor"/><circle cx="16.5" cy="19" r="1.5" fill="currentColor"/><path d="M3 11h18" stroke="currentColor" stroke-width="2"/></svg>`;

  function slugifyOpponent(str){
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  function buildMonthCalendar(year, monthIndex, matches){
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const weekdays = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

    const block = document.createElement('div');
    block.className = 'month-block';

    const title = document.createElement('h3');
    title.className = 'month-block__title';
    title.textContent = `${monthNames[monthIndex]} ${year}`;
    block.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'month-grid';
    weekdays.forEach(w => {
      const el = document.createElement('div');
      el.className = 'month-grid__weekday';
      el.textContent = w;
      grid.appendChild(el);
    });

    const firstDay = new Date(year, monthIndex, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++){
      const empty = document.createElement('div');
      empty.className = 'day-cell day-cell--empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++){
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const match = matches.find(m => m.date === dateStr);
      const cell = document.createElement('div');
      cell.className = 'day-cell' + (match ? ' day-cell--match' : '');

      const num = document.createElement('span');
      num.className = 'day-cell__num';
      num.textContent = d;
      cell.appendChild(num);

      if (match){
        cell.insertAdjacentHTML('beforeend', match.home ? HOUSE_ICON : BUS_ICON);

        const crestWrap = document.createElement('div');
        crestWrap.className = 'day-cell__crest';
        crestWrap.dataset.initial = match.opponent.charAt(0);
        const img = document.createElement('img');
        img.alt = match.opponent;
        const showLogo = () => crestWrap.classList.add('has-img');
        img.addEventListener('load', showLogo);
        img.addEventListener('error', () => crestWrap.classList.remove('has-img'));
        crestWrap.appendChild(img);
        cell.appendChild(crestWrap);
        img.src = `assets/opponents/${slugifyOpponent(match.opponent)}.png`;
        if (img.complete && img.naturalWidth > 0) showLogo();

        const oppName = document.createElement('div');
        oppName.className = 'day-cell__opponent';
        oppName.textContent = match.opponent;
        cell.appendChild(oppName);
      }

      grid.appendChild(cell);
    }

    block.appendChild(grid);
    return block;
  }

  const seasonCalendarEl = document.getElementById('seasonCalendar');
  if (seasonCalendarEl){
    const months = [
      [2026,8],[2026,9],[2026,10],[2026,11],
      [2027,0],[2027,1],[2027,2],[2027,3],[2027,4],[2027,5]
    ]; // septembre 2026 → juin 2027
    months.forEach(([y,m]) => seasonCalendarEl.appendChild(buildMonthCalendar(y, m, MATCHES)));
  }

  /* ---------- 6. RÉVÉLATION AU DÉFILEMENT ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

});
