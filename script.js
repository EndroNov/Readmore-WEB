/* =====================================================
   GLOBAL UTIL
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
  setActiveNav();
  restartTypingAnimation();
  lazyLoadImages();
  createScrollToTop();
  saveLastVisit();
});

/* =====================================================
   SEARCH BAR SCROLL EFFECT (HOME ONLY)
===================================================== */
const searchContainer = document.querySelector('.search-container');
const header = document.querySelector('header');
const heroSection = document.querySelector('.hero');

function handleSearchScroll() {
  if (!searchContainer || !heroSection || !header) return;

  const scrollPosition = window.scrollY;
  const triggerPoint = heroSection.offsetHeight * 0.8;

  if (scrollPosition > triggerPoint) {
    searchContainer.classList.add('search-fixed');
  } else {
    searchContainer.classList.remove('search-fixed');
  }
}

window.addEventListener('scroll', handleSearchScroll);

/* =====================================================
   HORIZONTAL DRAG SCROLL
===================================================== */
document.querySelectorAll('.scroll-horizontal').forEach(container => {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });

  container.addEventListener('mouseleave', () => isDown = false);
  container.addEventListener('mouseup', () => isDown = false);

  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    container.scrollLeft = scrollLeft - (x - startX) * 2;
  });
});

/* =====================================================
   SEARCH SYSTEM (SINGLE SOURCE OF TRUTH)
===================================================== */
function initializeSearch() {
  if (!window.BOOKS_DATA) {
    console.error('BOOKS_DATA tidak ditemukan');
    return;
  }

  const inputs = document.querySelectorAll(
    '.search-container input, .search-container-library input, .search-container-m input, .search-container-library-m input'
  );

  inputs.forEach(input => {
    const parent = input.parentElement;
    parent.style.position = 'relative';

    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    dropdown.style.cssText = `
      position:absolute;
      top:100%;
      left:0;
      right:0;
      background:#fff;
      border-radius:0 0 8px 8px;
      box-shadow:0 4px 12px rgba(0,0,0,.15);
      max-height:300px;
      overflow-y:auto;
      display:none;
      z-index:1000;
    `;
    parent.appendChild(dropdown);

    input.addEventListener('input', e => {
      const keyword = e.target.value.toLowerCase().trim();
      dropdown.innerHTML = '';

      if (keyword.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      const results = BOOKS_DATA.filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
      );

      dropdown.style.display = 'block';

      if (results.length === 0) {
        dropdown.innerHTML = `
          <div style="padding:16px;text-align:center;color:#999">
            Tidak ada buku ditemukan
          </div>
        `;
        return;
      }

      results.slice(0, 5).forEach(book => {
        const item = document.createElement('a');
        item.href = `halaman-3.html?id=${book.id}&from=search`;
        item.style.cssText = `
          display:flex;
          gap:12px;
          padding:12px 16px;
          text-decoration:none;
          color:#333;
        `;

        item.innerHTML = `
          <img src="${book.image}" style="width:40px;height:60px;object-fit:cover">
          <div>
            <div style="font-weight:600">${book.title}</div>
            <div style="font-size:12px;color:#777">${book.category}</div>
          </div>
        `;

        dropdown.appendChild(item);
      });
    });

    document.addEventListener('click', e => {
      if (!parent.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  });
}

/* =====================================================
   NAVBAR ACTIVE STATE
===================================================== */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .navbar-library a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(page)) {
      link.classList.add('active');
    }
  });
}

/* =====================================================
   TYPING ANIMATION
===================================================== */
function restartTypingAnimation() {
  const el = document.querySelector('.typing');
  if (!el) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        el.style.animation = 'typing 3s steps(30) forwards, blink .7s infinite';

        observer.unobserve(el); // stop observer setelah 1x
      }
    });
  }, { threshold: 0.5 });

  observer.observe(el);
}


/* =====================================================
   LAZY LOAD IMAGES
===================================================== */
function lazyLoadImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        obs.unobserve(e.target);
      }
    });
  });
  imgs.forEach(img => obs.observe(img));
}

/* =====================================================
   SCROLL TO TOP
===================================================== */
function createScrollToTop() {
  const btn = document.createElement('button');
  btn.textContent = '↑';
  btn.className = 'scroll-to-top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* =====================================================
   LOCAL STORAGE
===================================================== */
function saveLastVisit() {
  localStorage.setItem('lastVisit', JSON.stringify({
    page: location.pathname,
    time: new Date().toISOString()
  }));
}


/* =====================================================
   LOADER
===================================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hide');
});

/* =====================================================
   CONSOLE
===================================================== */
console.log('%cReadMore ready 📚', 'color:#F29B30;font-size:18px;font-weight:bold');
