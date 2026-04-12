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

function buildModal(post) {
  const imgHtml = post.img
    ? `<img class="modal-img" src="${post.img}" alt=""/>`
    : '';
  const bodyPad = post.img && typeof post.img === 'string' ? '' : 'style="padding-top:38px"';
  return `
    <div class="modal-overlay" id="modal-${post.id}" onclick="if(event.target===this)closeModal('modal-${post.id}')">
      <div class="modal-box">
        ${imgHtml}
        <div class="modal-body" ${bodyPad}>
          <div class="modal-tag">${post.tag}</div>
          <div class="modal-title">${post.title}</div>
          <div class="modal-meta">${post.date}</div>
          <div class="modal-text">${post.content}</div>
          <button class="modal-close" onclick="closeModal('modal-${post.id}')">Bezárás</button>
        </div>
      </div>
    </div>`;
}

//INDEX
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
    if (diff !== 0) return diff;
    return POSTS.indexOf(b) - POSTS.indexOf(a);
  });
}

function renderIndexNews(newsContainerId, modalContainerId) {
  const container = document.getElementById(newsContainerId);
  const modalWrap = document.getElementById(modalContainerId);
  if (!container || !modalWrap || !POSTS || !POSTS.length) return;

  const sorted = getSortedPosts();
  const featured = sorted[0];
  const hasImg = featured.img && typeof featured.img === 'string';
  const listItems = sorted.slice(1, 5);

  const imgHtml = hasImg
    ? `<div class="nfc-img-wrap"><img src="${featured.img}" alt=""/></div>`
    : '';

  const featuredHtml = `
    <div class="news-featured-card${hasImg ? '' : ' nfc-no-img'}" onclick="openModal('modal-${featured.id}')">
      ${imgHtml}
      <div class="nfc-body">
        <span class="nfc-tag">${featured.tag}</span>
        <h3 class="nfc-title">${featured.title}</h3>
        <p class="nfc-excerpt">${featured.excerpt}</p>
        <div class="nfc-foot">
          <span class="nfc-date">${featured.date}</span>
          <span class="nfc-read">Bővebben →</span>
        </div>
      </div>
    </div>`;

  const listHtml = `
    <div class="news-list">
      ${listItems.map(p => {
        const pHasImg = p.img && typeof p.img === 'string';
        const thumbHtml = pHasImg
          ? `<div class="nl-thumb"><img src="${p.img}" alt=""/></div>`
          : '';
        return `
        <div class="nl-item${pHasImg ? ' nl-has-img' : ''}" onclick="openModal('modal-${p.id}')">
          ${thumbHtml}
          <div class="nl-text">
            <div class="nl-meta">
              <span class="nl-tag">${p.tag}</span>
              <span class="nl-date">${p.date}</span>
            </div>
            <div class="nl-title">${p.title}</div>
            <div class="nl-excerpt">${p.excerpt}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  container.className = hasImg ? 'news-layout' : 'news-layout news-layout-noimg';
  container.innerHTML = featuredHtml + listHtml;

  modalWrap.innerHTML = sorted.map(buildModal).join('');
}

//KÖZLEMÉNYEK
function renderPostsPage(gridId, pagId, modalContainerId, perPage) {
  const grid    = document.getElementById(gridId);
  const pagWrap = document.getElementById(pagId);
  const modalWrap = document.getElementById(modalContainerId);
  if (!grid || !pagWrap || !modalWrap || !POSTS) return;

  const sortedPosts = getSortedPosts();
  modalWrap.innerHTML = sortedPosts.map(buildModal).join('');

  const total = sortedPosts.length;
  const totalPages = Math.ceil(total / perPage);
  let current = 1;

  function postCardHtml(post) {
    const imgSection = post.img
      ? `<div class="post-card-img"><img src="${post.img}" alt=""/></div>`
      : '';
    return `
      <div class="post-card" onclick="openModal('modal-${post.id}')">
        ${imgSection}
        <div class="post-card-body">
          <div class="post-card-meta">
            <span class="post-tag">${post.tag}</span>
            <span class="post-date">${post.date}</span>
          </div>
          <div class="post-title">${post.title}</div>
          <div class="post-excerpt">${post.excerpt}</div>
          <div class="post-footer">
            <span class="post-date">${post.date}</span>
            <span class="post-read">Bővebben →</span>
          </div>
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
        const dots = document.createElement('span');
        dots.className = 'pag-dots';
        dots.textContent = '…';
        pagWrap.appendChild(dots);
      } else {
        pagWrap.appendChild(pagBtn(p, false, p === current, () => { if (p !== current) show(p); }));
      }
    });

    pagWrap.appendChild(pagBtn('→', current === totalPages, false, () => show(current + 1)));
  }

  show(1);
}
//GALÉRIA
function initGalleryPagination(tilesPerPage) {
  const masonry = document.querySelector('.gallery-masonry');
  const pagWrap = document.getElementById('galleryPagination');
  if (!masonry || !pagWrap) return;

  const tiles = Array.from(masonry.querySelectorAll('.gallery-tile'));
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
        const dots = document.createElement('span');
        dots.className = 'pag-dots';
        dots.textContent = '…';
        pagWrap.appendChild(dots);
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
  if (cur <= 4)        return [1, 2, 3, 4, 5, '...', total];
  if (cur >= total-3)  return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', cur-1, cur, cur+1, '...', total];
}