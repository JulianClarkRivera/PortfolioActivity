/* =========================================================
   Julian Rivera - Portfolio
   Features:
   1. Hamburger menu (mobile navigation)
   2. Dark / light mode toggle (remembers the choice)
   3. Smooth scrolling for anchor links
   4. Highlight the nav link of the section being viewed
   5. Auto-updating footer year
   ========================================================= */

/* ---------- Grab the elements we need from the page ---------- */
const root = document.documentElement;                      // the <html> element
const menuToggle = document.getElementById('menu-toggle');  // hamburger button
const siteNav = document.getElementById('site-nav');        // navigation container
const themeToggle = document.getElementById('theme-toggle'); // dark/light button
const themeIcon = document.getElementById('theme-icon');    // icon inside the button
const anchorLinks = document.querySelectorAll('a[href^="#"]'); // every in-page link
const navLinks = document.querySelectorAll('.nav-link');    // links inside the navbar
const sections = document.querySelectorAll('#about, #projects, #contact'); // sections to track
const yearSpan = document.getElementById('year');           // footer year

/* =========================================================
   1. HAMBURGER MENU
   ========================================================= */

/**
 * Opens or closes the mobile navigation.
 * @param {boolean} open - true to show the menu, false to hide it
 */
function setMenuOpen(open) {
  siteNav.classList.toggle('is-open', open);               // show/hide the nav panel
  menuToggle.classList.toggle('is-open', open);            // animate hamburger into an X
  menuToggle.setAttribute('aria-expanded', String(open));  // tell screen readers the state
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

// Toggle the menu each time the hamburger button is clicked
menuToggle.addEventListener('click', function () {
  const isOpen = siteNav.classList.contains('is-open');
  setMenuOpen(!isOpen);
});

// Close the menu when the Escape key is pressed
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    setMenuOpen(false);
  }
});

// Close the menu automatically if the window grows back to desktop size
window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    setMenuOpen(false);
  }
});

/* =========================================================
   2. DARK / LIGHT MODE TOGGLE
   ========================================================= */

/**
 * Applies a theme to the page and updates the toggle button.
 * @param {string} theme - either 'light' or 'dark'
 */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);                  // CSS reads this attribute
  const isDark = theme === 'dark';
  themeIcon.innerHTML = isDark ? '&#9728;' : '&#9790;';    // sun in dark mode, moon in light mode
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

/**
 * Works out which theme to show first:
 * the saved choice, otherwise the visitor's system preference.
 * @returns {string} 'light' or 'dark'
 */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');           // theme saved from a previous visit
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (error) {
    // localStorage can be blocked in some browsers; ignore and fall through
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// Set the theme as soon as the script loads
applyTheme(getInitialTheme());

// Switch themes each time the toggle button is clicked
themeToggle.addEventListener('click', function () {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);                   // remember the choice
  } catch (error) {
    // Ignore storage errors; the theme still changes for this visit
  }
});

/* =========================================================
   3. SMOOTH SCROLL
   ========================================================= */

// Loop through every link that points to a section on this page
anchorLinks.forEach(function (link) {
  link.addEventListener('click', function (event) {
    const targetId = link.getAttribute('href');            // e.g. "#projects"
    if (targetId.length < 2) {
      return;                                              // ignore bare "#" links
    }

    const target = document.querySelector(targetId);       // find the section
    if (!target) {
      return;                                              // section not found; let the browser handle it
    }

    event.preventDefault();                                // stop the instant jump
    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // glide to the section
    history.pushState(null, '', targetId);                 // keep the URL hash updated
    setMenuOpen(false);                                    // close mobile menu after clicking
  });
});

/* =========================================================
   4. ACTIVE NAV LINK (highlights the section being viewed)
   ========================================================= */

/**
 * Marks the nav link that matches the given section id as active.
 * @param {string} id - the id of the visible section, e.g. "projects"
 */
function setActiveLink(id) {
  navLinks.forEach(function (link) {
    const isMatch = link.getAttribute('href') === '#' + id;
    link.classList.toggle('is-active', isMatch);           // add/remove the highlight class
  });
}

// Watch which section crosses the middle of the screen
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });                 // thin detection band in the middle

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

// The contact banner is short, so highlight it when the page reaches the bottom
window.addEventListener('scroll', function () {
  const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
  if (atBottom) {
    setActiveLink('contact');
  }
});

/* =========================================================
   5. FOOTER YEAR
   ========================================================= */

// Show the current year in the copyright line
yearSpan.textContent = new Date().getFullYear();
