const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mainNav.contains(e.target))
      mainNav.classList.remove('open');
  });
}

const scrollBtn = document.getElementById('scrollTop');
if (scrollBtn) {
  window.addEventListener('scroll', () =>
    scrollBtn.classList.toggle('visible', window.scrollY > 500));
  scrollBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    m.classList.remove('open');
    document.body.style.overflow = '';
  });
  closeLightbox();
});

function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  if (!lb || !img) return;
  img.src = src; img.alt = alt || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── helpers ────────────────────────────────────────────────
function getImgs(post) {
  if (!post.img) return [];
  return Array.isArray(post.img) ? post.img.filter(Boolean) : [post.img];
}
function firstImg(post) { return getImgs(post)[0] || ''; }
function isPdf(post)     { return !!post.pdf; }
function isPhotoOnly(post) { return !!post.photoOnly; }

// ─── badge (card overlay) ────────────────────────────────────
function cardBadge(post) {
  const imgs = getImgs(post);
  if (isPdf(post)) return `<span class="card-badge card-badge-pdf">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF</span>`;
  if (imgs.length > 1) return `<span class="card-badge card-badge-img">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${imgs.length} kép</span>`;
  return '';
}

// ─── modal builder ──────────────────────────────────────────
function buildModal(post) {
  const imgs      = getImgs(post);
  const hasPdf    = isPdf(post);
  const photoOnly = isPhotoOnly(post);

  // image / slider
  let mediaHtml = '';
  if (imgs.length === 1) {
    mediaHtml = `<div class="modal-img-wrap"><img src="${imgs[0]}" alt=""/></div>`;
  } else if (imgs.length > 1) {
    const slides = imgs.map((src, i) =>
      `<div class="ms-slide${i === 0 ? ' active' : ''}" data-index="${i}"><img src="${src}" alt=""/></div>`
    ).join('');
    const dots = imgs.map((_, i) =>
      `<button class="ms-dot${i === 0 ? ' active' : ''}" onclick="msGoTo('modal-${post.id}',${i})" aria-label="${i+1}. kép"></button>`
    ).join('');
    mediaHtml = `
      <div class="modal-slider" id="ms-${post.id}">
        <div class="ms-track">${slides}</div>
        <button class="ms-arrow ms-prev" onclick="msStep('modal-${post.id}',-1)" aria-label="Előző">&#8249;</button>
        <button class="ms-arrow ms-next" onclick="msStep('modal-${post.id}',1)" aria-label="Következő">&#8250;</button>
        <div class="ms-dots">${dots}</div>
        <div class="ms-counter"><span class="ms-cur">1</span>&thinsp;/&thinsp;${imgs.length}</div>
      </div>`;
  }

  // PDF embed – PDF.js, all pages rendered below each other
  let pdfHtml = '';
  if (hasPdf) {
    pdfHtml = `
      <div class="modal-pdf-wrap">
        <div class="modal-pdf-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          PDF dokumentum
          <a href="${post.pdf}" target="_blank" class="modal-pdf-open">Letöltés ↗</a>
        </div>
        <div class="modal-pdf-pages" id="pdf-pages-${post.id}">
          <div class="pdf-loading" id="pdf-loading-${post.id}">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="pdf-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Betöltés…
          </div>
        </div>
      </div>`;
  }

  // photo-only modal (no text body)
  if (photoOnly) {
    return `
      <div class="modal-overlay modal-photo-only" id="modal-${post.id}" onclick="if(event.target===this)closeModal('modal-${post.id}')">
        <div class="modal-box modal-box-photo">
          <button class="modal-x-close" onclick="closeModal('modal-${post.id}')" aria-label="Bezárás">×</button>
          <div class="modal-photo-meta">
            <span class="modal-tag">${post.tag}</span>
            <span class="modal-photo-title">${post.title}</span>
            <span class="modal-photo-date">${post.date}</span>
          </div>
          ${mediaHtml}
        </div>
      </div>`;
  }

  // normal modal
  const noMedia = imgs.length === 0 && !hasPdf;
  return `
    <div class="modal-overlay" id="modal-${post.id}" onclick="if(event.target===this)closeModal('modal-${post.id}')">
      <div class="modal-box">
        ${mediaHtml}
        ${pdfHtml}
        <div class="modal-body"${noMedia ? ' style="padding-top:28px"' : ''}>
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-tag">${post.tag}</div>
              <div class="modal-title">${post.title}</div>
              <div class="modal-meta">${post.date}</div>
            </div>
            <button class="modal-close" onclick="closeModal('modal-${post.id}')">Bezárás</button>
          </div>
          <div class="modal-text">${post.content || ''}</div>
        </div>
      </div>
    </div>`;
}

// ─── slider logic ────────────────────────────────────────────
function msGoTo(modalId, index) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  const slides = overlay.querySelectorAll('.ms-slide');
  const dots   = overlay.querySelectorAll('.ms-dot');
  const cur    = overlay.querySelector('.ms-cur');
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i)   => d.classList.toggle('active', i === index));
  if (cur) cur.textContent = index + 1;
}
function msStep(modalId, dir) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  const slides = overlay.querySelectorAll('.ms-slide');
  let active = 0;
  slides.forEach((s, i) => { if (s.classList.contains('active')) active = i; });
  msGoTo(modalId, (active + dir + slides.length) % slides.length);
}

// ─── date parse ──────────────────────────────────────────────
function parseDateHu(str) {
  const months = ['január','február','március','április','május','június','július','augusztus','szeptember','október','november','december'];
  const m = str.match(/(\d{4})\. (\w+) (\d+)\./);
  if (!m) return new Date(0);
  const mon = months.indexOf(m[2]);
  return new Date(parseInt(m[1]), mon < 0 ? 0 : mon, parseInt(m[3]));
}
function getSortedPosts() {
  return [...POSTS].sort((a, b) => {
    const diff = parseDateHu(b.date) - parseDateHu(a.date);
    return diff !== 0 ? diff : POSTS.indexOf(b) - POSTS.indexOf(a);
  });
}

// ─── INDEX ──────────────────────────────────────────────────
function renderIndexNews(newsContainerId, modalContainerId) {
  const container = document.getElementById(newsContainerId);
  const modalWrap = document.getElementById(modalContainerId);
  if (!container || !modalWrap || !POSTS || !POSTS.length) return;

  const sorted    = getSortedPosts();
  const featured  = sorted[0];
  const listItems = sorted.slice(1, 5);

  const featImgSrc = firstImg(featured);
  const hasMedia   = !!featImgSrc || isPdf(featured);

  let featMediaHtml = '';
  if (featImgSrc) {
    featMediaHtml = `<div class="nfc-img-wrap"><img src="${featImgSrc}" alt=""/>${cardBadge(featured)}</div>`;
  } else if (isPdf(featured)) {
    featMediaHtml = `<div class="nfc-img-wrap nfc-pdf-thumb">
      <div class="pdf-thumb-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span>PDF</span>
      </div>${cardBadge(featured)}</div>`;
  }

  const featuredHtml = `
    <div class="news-featured-card${hasMedia ? '' : ' nfc-no-img'}" onclick="openModal('modal-${featured.id}')">
      ${featMediaHtml}
      <div class="nfc-body">
        <span class="nfc-tag">${featured.tag}</span>
        <h3 class="nfc-title">${featured.title}</h3>
        <p class="nfc-excerpt">${featured.excerpt || ''}</p>
        <div class="nfc-foot">
          <span class="nfc-date">${featured.date}</span>
          <span class="nfc-read">Bővebben →</span>
        </div>
      </div>
    </div>`;

  const listHtml = `
    <div class="news-list">
      ${listItems.map(p => {
        const pImgSrc = firstImg(p);
        let thumbHtml = '';
        if (pImgSrc) {
          thumbHtml = `<div class="nl-thumb"><img src="${pImgSrc}" alt=""/>${cardBadge(p)}</div>`;
        } else if (isPdf(p)) {
          thumbHtml = `<div class="nl-thumb nl-pdf-thumb">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>`;
        }
        const hasThumb = !!pImgSrc || isPdf(p);
        return `
        <div class="nl-item${hasThumb ? ' nl-has-img' : ''}" onclick="openModal('modal-${p.id}')">
          ${thumbHtml}
          <div class="nl-text">
            <div class="nl-meta"><span class="nl-tag">${p.tag}</span><span class="nl-date">${p.date}</span></div>
            <div class="nl-title">${p.title}</div>
            <div class="nl-excerpt">${p.excerpt || ''}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  container.className = hasMedia ? 'news-layout' : 'news-layout news-layout-noimg';
  container.innerHTML = featuredHtml + listHtml;
  modalWrap.innerHTML = sorted.map(buildModal).join('');
}

// ─── KÖZLEMÉNYEK ─────────────────────────────────────────────
function renderPostsPage(gridId, pagId, modalContainerId, perPage) {
  const grid      = document.getElementById(gridId);
  const pagWrap   = document.getElementById(pagId);
  const modalWrap = document.getElementById(modalContainerId);
  if (!grid || !pagWrap || !modalWrap || !POSTS) return;

  const sortedPosts = getSortedPosts();
  modalWrap.innerHTML = sortedPosts.map(buildModal).join('');

  const totalPages = Math.ceil(sortedPosts.length / perPage);
  let current = 1;

  function postCardHtml(post) {
    const imgSrc    = firstImg(post);
    const hasPdf    = isPdf(post);
    const photoOnly = isPhotoOnly(post);

    let cardMedia = '';
    if (imgSrc) {
      cardMedia = `<div class="post-card-img"><img src="${imgSrc}" alt=""/>${cardBadge(post)}</div>`;
    } else if (hasPdf) {
      cardMedia = `<div class="post-card-img post-card-pdf-thumb">
        <div class="pdf-thumb-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>PDF</span>
        </div>${cardBadge(post)}</div>`;
    }

    const readLabel = photoOnly ? 'Megtekintés →' : 'Bővebben →';
    return `
      <div class="post-card${photoOnly ? ' post-card-photo' : ''}" onclick="openModal('modal-${post.id}')">
        ${cardMedia}
        <div class="post-card-body">
          <div class="post-card-meta">
            <span class="post-tag">${post.tag}</span>
            <span class="post-date">${post.date}</span>
          </div>
          <div class="post-title">${post.title}</div>
          ${!photoOnly ? `<div class="post-excerpt">${post.excerpt || ''}</div>` : ''}
          <div class="post-footer"><span class="post-read">${readLabel}</span></div>
        </div>
      </div>`;
  }

  function show(page) {
    current = page;
    const slice = sortedPosts.slice((page - 1) * perPage, page * perPage);
    grid.innerHTML = slice.map(postCardHtml).join('');
    renderPag();
    window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
  }

  function renderPag() {
    pagWrap.innerHTML = '';
    if (totalPages <= 1) return;
    pagWrap.appendChild(pagBtn('←', current === 1, false, () => show(current - 1)));
    pageNumbers(current, totalPages).forEach(p => {
      if (p === '...') {
        const el = document.createElement('span');
        el.className = 'pag-dots'; el.textContent = '…';
        pagWrap.appendChild(el);
      } else {
        pagWrap.appendChild(pagBtn(p, false, p === current, () => { if (p !== current) show(p); }));
      }
    });
    pagWrap.appendChild(pagBtn('→', current === totalPages, false, () => show(current + 1)));
  }

  show(1);
}

// ─── GALÉRIA ─────────────────────────────────────────────────
function initGalleryPagination(tilesPerPage) {
  const masonry = document.querySelector('.gallery-masonry');
  const pagWrap = document.getElementById('galleryPagination');
  if (!masonry || !pagWrap) return;

  const tiles      = Array.from(masonry.querySelectorAll('.gallery-tile'));
  const totalPages = Math.ceil(tiles.length / tilesPerPage);
  let current = 1;

  function show(page) {
    current = page;
    tiles.forEach((t, i) => {
      t.style.display = (i >= (page-1)*tilesPerPage && i < page*tilesPerPage) ? '' : 'none';
    });
    renderPag();
    window.scrollTo({ top: masonry.offsetTop - 100, behavior: 'smooth' });
  }

  function renderPag() {
    pagWrap.innerHTML = '';
    if (totalPages <= 1) return;
    pagWrap.appendChild(pagBtn('←', current === 1, false, () => show(current - 1)));
    pageNumbers(current, totalPages).forEach(p => {
      if (p === '...') {
        const el = document.createElement('span');
        el.className = 'pag-dots'; el.textContent = '…';
        pagWrap.appendChild(el);
      } else {
        pagWrap.appendChild(pagBtn(p, false, p === current, () => { if (p !== current) show(p); }));
      }
    });
    pagWrap.appendChild(pagBtn('→', current === totalPages, false, () => show(current + 1)));
  }

  show(1);
}

function pagBtn(label, disabled, active, onClick) {
  const el = document.createElement('button');
  el.className = 'pag-btn' + (active ? ' active' : '') + (disabled ? ' disabled' : '');
  el.textContent = label;
  el.disabled = disabled;
  if (!disabled && onClick) el.addEventListener('click', onClick);
  return el;
}

function pageNumbers(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)       return [1, 2, 3, 4, 5, '...', total];
  if (cur >= total-3) return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', cur-1, cur, cur+1, '...', total];
}

// ─── PDF.js renderer – all pages stacked ─────────────────────
const _pdfLoaded = new Set();

async function _ensurePdfJs() {
  if (window.pdfjsLib) return;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function pdfLoad(postId, url) {
  if (_pdfLoaded.has(postId)) return;
  _pdfLoaded.add(postId);

  const wrap    = document.getElementById('pdf-pages-' + postId);
  const loading = document.getElementById('pdf-loading-' + postId);
  if (!wrap) return;

  try {
    await _ensurePdfJs();
    const doc = await pdfjsLib.getDocument(url).promise;
    if (loading) loading.remove();

    const containerWidth = wrap.clientWidth || 680;
    const dpr = window.devicePixelRatio || 1;

    for (let i = 1; i <= doc.numPages; i++) {
      const page  = await doc.getPage(i);
      const vp0   = page.getViewport({ scale: 1 });
      const scale = Math.min(containerWidth / vp0.width, 3);
      const vp    = page.getViewport({ scale });

      const canvas     = document.createElement('canvas');
      canvas.className = 'pdf-canvas';
      canvas.width     = Math.floor(vp.width  * dpr);
      canvas.height    = Math.floor(vp.height * dpr);
      canvas.style.width  = vp.width  + 'px';
      canvas.style.height = vp.height + 'px';
      wrap.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
    }
  } catch(e) {
    if (loading) loading.innerHTML = '<span style="color:#c00;font-size:.8rem">Nem sikerült betölteni a PDF-et.</span>';
  }
}

// Hook into openModal to trigger PDF load
const _origOpenModal = openModal;
window.openModal = function(id) {
  _origOpenModal(id);
  const overlay = document.getElementById(id);
  if (!overlay) return;
  const pagesDiv = overlay.querySelector('.modal-pdf-pages');
  if (!pagesDiv) return;
  const postId = id.replace('modal-', '');
  const post = (typeof POSTS !== 'undefined') && POSTS.find(p => p.id === postId);
  if (post && post.pdf) pdfLoad(postId, post.pdf);
};