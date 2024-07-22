// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function hasWrapper(el) {
  return !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block';
}

async function loadTerms(letter) {

  if (!letter) {
    return null;
  }

  const url = `/cigars-for-beginners/fragments/terms/${letter}`;

  let path = url;
  if (!(path.charAt(0) === '/')) {
    path = new URL(url).pathname;
  }

  const fragment = await loadFragment(path);
  const tabcontent = document.createElement('p');
  tabcontent.appendChild(fragment);
  return tabcontent ? tabcontent.querySelector('main > .section .block') : null;
}

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);

  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const terms = loadTerms(id);

    if (!hasWrapper(tabpanel.lastElementChild)) {
      terms.then((content) => {
        if (content) tabpanel.lastElementChild.replaceWith(content);
      });
    }

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.textContent;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
