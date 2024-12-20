import { buildBlock, loadHeader, loadFooter, decorateButtons, decorateIcons, decorateSections, decorateBlocks, decorateTemplateAndTheme, waitForFirstImage, loadSection, loadSections, loadCSS } from './aem.js';

const ARTICLE_INDEX_PATH = '/cigars-for-beginners/index/query-index.json';

let articleIndexData;

/**
 * Fetches article list.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of article path objects.
 */
export async function fetchArticleList() {
  if (!articleIndexData) {
    try {
      const resp = await fetch(ARTICLE_INDEX_PATH);
      if (resp.ok) {
        const jsonData = await resp.json();
        articleIndexData = jsonData.data.map((item) => ({
          path: item.path,
          title: item.title,
          lastModified: item.lastModified,
          publishedDate: item.published,
          image: item.image,
        }));
      } else {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch article list:', resp.status);
        return [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error article list:', error);
      return [];
    }
  }
  return articleIndexData;
}

/**
 * Fetches article information.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of article path objects.
 */
export async function fetchArticleInfo() {
  // Fetch article list
  if (!articleIndexData) {
    articleIndexData = await fetchArticleList();
  }

  // Get the current URL path
  const currentPath = window.location.pathname;

  // Find the article that matches the current URL path
  const matchingArticle = articleIndexData.find((article) => article.path === currentPath);

  return matchingArticle || null;
}

// Function to check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  // eslint-disable-next-line max-len
  return rect.top + 100 < viewportHeight && rect.bottom > 0 && rect.left < viewportWidth && rect.right > 0;
}

// Function to add the 'visible' class to list items when they scroll into view
function handleScroll() {
  const items = document.querySelectorAll('.animate-right ul li');
  items.forEach((item) => {
    if (isInViewport(item)) {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }
  });

  const zoomInImages = document.querySelectorAll('.images.zoom-in img');
  zoomInImages.forEach((img) => {
    if (isInViewport(img)) {
      img.classList.add('in-view');
    }
  });
}

// Check for elements with onScroll animations
const animateRight = document.querySelector('.item-list.animate-right');
const zoomInImages = document.querySelectorAll('.images.zoom-in img');

// Add event listener for scroll if animation classes are present
if (animateRight || zoomInImages) {
  window.addEventListener('scroll', handleScroll);
  // Initial check in case some items are already in view
  handleScroll();
} else {
  // If animate-right class is not present, ensure all items are visible
  const items = document.querySelectorAll('.item-list ul li');
  items.forEach((item) => {
    item.style.opacity = '1';
    item.style.transform = 'translateX(0)';
  });
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * used by modals block
 */
function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');
    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  autolinkModals(main);
}

/**
 * Checks if the given path is an external URL.
 * @param {string} path - The path to be checked.
 * @returns {boolean} - Returns true if the path is an external URL, false otherwise.
 */
export function isInternal(path) {
  try {
    const url = new URL(path);
    return window.location.hostname === url.hostname && url.pathname.startsWith('/cigars-for-beginners');
  } catch (error) {
    return true;
  }
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
