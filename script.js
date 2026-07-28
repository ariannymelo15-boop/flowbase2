const FRAME_SETS = {
  desktop: { folder: 'frames', start: 21, end: 177 },
  mobile: { folder: 'frames%20celular', start: 2, end: 204 },
};

const MOBILE_QUERY = window.matchMedia('(max-width: 768px)');

const scrub = document.getElementById('scrub');
const canvas = document.getElementById('scrubCanvas');
const ctx = canvas.getContext('2d');

let activeSet = null;
let images = [];
let frameCount = 0;
let currentFrame = -1;

function frameUrl(set, i) {
  return `${set.folder}/ezgif-frame-${String(i).padStart(3, '0')}.png`;
}

function loadFrameSet(setName) {
  if (activeSet === setName) return;
  activeSet = setName;

  const set = FRAME_SETS[setName];
  frameCount = set.end - set.start + 1;
  currentFrame = -1;

  const newImages = [];
  for (let i = set.start; i <= set.end; i++) {
    const img = new Image();
    img.src = frameUrl(set, i);
    if (img.decode) {
      img.decode().catch(() => {});
    }
    newImages.push(img);
  }
  images = newImages;

  updateScrub();
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawWidth = canvas.width;
    drawHeight = drawWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    drawHeight = canvas.height;
    drawWidth = drawHeight * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function updateScrub() {
  const scrollable = scrub.offsetHeight - window.innerHeight;
  const rect = scrub.getBoundingClientRect();

  let progress = scrollable > 0 ? -rect.top / scrollable : 0;
  progress = Math.min(Math.max(progress, 0), 1);

  const frameIndex = Math.round(progress * (frameCount - 1));
  currentFrame = frameIndex;
  drawFrame(frameIndex);
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateScrub();
    ticking = false;
  });
}

function onBreakpointChange() {
  loadFrameSet(MOBILE_QUERY.matches ? 'mobile' : 'desktop');
}

window.addEventListener('scroll', onScroll, { passive: true });
document.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  resizeCanvas();
  drawFrame(currentFrame === -1 ? 0 : currentFrame);
});

MOBILE_QUERY.addEventListener('change', onBreakpointChange);

resizeCanvas();
loadFrameSet(MOBILE_QUERY.matches ? 'mobile' : 'desktop');

/* =========================================================
   PORTFÓLIO — SEÇÕES 2 A 9 (não interfere no scroll-scrub acima)
   ========================================================= */

// Ano dinâmico no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fade-in ao rolar
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Carrossel horizontal de Serviços controlado pelo scroll vertical
const servicesSection = document.querySelector('.services-scroll');
const servicesTrack = document.getElementById('servicesTrack');

function updateServicesScroll() {
  if (!servicesSection || !servicesTrack) return;

  const scrollable = servicesSection.offsetHeight - window.innerHeight;
  const rect = servicesSection.getBoundingClientRect();

  let progress = scrollable > 0 ? -rect.top / scrollable : 0;
  progress = Math.min(Math.max(progress, 0), 1);

  const maxTranslate = Math.max(servicesTrack.scrollWidth - servicesTrack.clientWidth, 0);
  servicesTrack.style.transform = `translateX(${-maxTranslate * progress}px)`;
}

window.addEventListener('scroll', () => requestAnimationFrame(updateServicesScroll), { passive: true });
window.addEventListener('resize', updateServicesScroll);
updateServicesScroll();

// Filtro de categorias do portfólio
const filterButtons = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('is-active'));
    button.classList.add('is-active');

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category || '';
      const matches = filter === 'todos' || categories.split(' ').includes(filter);
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

// Envio do formulário de contato (sem backend — apenas feedback visual)
const contactForm = document.getElementById('form-contato');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formFeedback.textContent = 'Mensagem recebida! Em breve entrarei em contato.';
    contactForm.reset();
  });
}
