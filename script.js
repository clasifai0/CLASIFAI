// CLASIFAI: menú, animaciones y demostración ilustrativa.
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  menuToggle.textContent = '☰';
}
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  menuToggle.textContent = isOpen ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08});
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('visible'));
}

const pieces = {
  perno: {label: 'PERNO', symbol: '🔩', bin: 'CONTENEDOR 01'},
  tuerca: {label: 'TUERCA', symbol: '⬡', bin: 'CONTENEDOR 02'},
  arandela: {label: 'ARANDELA', symbol: '◎', bin: 'CONTENEDOR 03'}
};
const buttons = document.querySelectorAll('.piece-btn');
const startButton = document.getElementById('startDemo');
const resetButton = document.getElementById('resetDemo');
const pieceDisplay = document.getElementById('pieceDisplay');
const detectedPiece = document.getElementById('detectedPiece');
const detectedBin = document.getElementById('detectedBin');
const detectedStatus = document.getElementById('detectedStatus');
const demoStatus = document.getElementById('demoStatus');
const scanArea = document.getElementById('scanArea');
let selected = null;
let running = false;
let timer = null;

buttons.forEach(button => button.addEventListener('click', () => {
  if (running) return;
  selected = button.dataset.piece;
  buttons.forEach(b => {
    const active = b === button;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  pieceDisplay.textContent = pieces[selected].symbol;
  detectedPiece.textContent = '---';
  detectedBin.textContent = '---';
  detectedStatus.textContent = 'Lista para analizar';
  demoStatus.textContent = 'PREPARADO';
  startButton.disabled = false;
}));

startButton.addEventListener('click', () => {
  if (!selected || running) return;
  running = true;
  const currentPiece = selected;
  startButton.disabled = true;
  buttons.forEach(button => button.disabled = true);
  demoStatus.textContent = 'ANALIZANDO';
  detectedPiece.textContent = '...';
  detectedBin.textContent = '...';
  detectedStatus.textContent = 'Simulando identificación';
  scanArea.classList.add('scanning');
  timer = setTimeout(() => {
    detectedPiece.textContent = pieces[currentPiece].label;
    detectedBin.textContent = pieces[currentPiece].bin;
    detectedStatus.textContent = 'Clasificación simulada';
    demoStatus.textContent = 'COMPLETADO';
    scanArea.classList.remove('scanning');
    running = false;
    startButton.disabled = false;
    buttons.forEach(button => button.disabled = false);
    timer = null;
  }, 2500);
});

resetButton.addEventListener('click', () => {
  if (timer !== null) clearTimeout(timer);
  timer = null;
  running = false;
  selected = null;
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
  pieceDisplay.textContent = '?';
  detectedPiece.textContent = '---';
  detectedBin.textContent = '---';
  detectedStatus.textContent = 'Sin iniciar';
  demoStatus.textContent = 'EN ESPERA';
  scanArea.classList.remove('scanning');
  startButton.disabled = true;
});
