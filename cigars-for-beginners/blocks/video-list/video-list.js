import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * check if link is a video or gif
 * @param href
 * @return {boolean}
 */
function isVideo(href) {
  return !href.endsWith('.gif');
}

/**
 * remove modal from page
 * @param e
 */
function closeModal() {
  const dialog = document.querySelector('body > dialog');
  if (dialog) {
    dialog.remove();
  }

  document.body.classList.remove('modal-open');
}

/**
 * add modal to the page
 * @param e
 */
function openModal(e) {
  e.preventDefault();

  const dialog = document.createElement('dialog');
  dialog.className = 'video-modal';

  dialog.addEventListener('click', () => {
    if (e.target.classList.contains('video-modal')) {
      closeModal();
    }
  });

  const contentWrap = document.createElement('div');
  contentWrap.className = 'video-modal-content';

  let href = e.target.getAttribute('data-modal');
  if (e.target.tagName === 'IMG') {
    href = e.target.closest('a').getAttribute('data-modal');
  }

  if (isVideo(href)) {
    const frame = document.createElement('iframe');
    frame.src = href;
    contentWrap.appendChild(frame);
  } else {
    const img = document.createElement('img');
    img.src = href;
    contentWrap.appendChild(img);
  }

  const closeButton = document.createElement('button');
  closeButton.addEventListener('click', closeModal);
  closeButton.title = 'Close modal';
  closeButton.textContent = 'X';
  closeButton.className = 'close-button';

  contentWrap.appendChild(closeButton);
  dialog.appendChild(contentWrap);
  document.body.appendChild(dialog);
  document.body.classList.add('modal-open');
}

export default function decorate(block) {
  // Add video list
  /* change to ul, li */
  const ul = document.createElement('ul');
  // loop over each row of import file
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    // For each row child, a new <li> is created.
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Find the last div and extract the href from its link
    const lastDiv = li.querySelector('div:last-child');
    const link = lastDiv ? lastDiv.querySelector('a') : null;
    const href = link ? link.href.replace(/\/$/, '') : '#'; // Strip trailing slash and default to '#' if no link is found

    // The second div contains the title for links and buttons
    const secondDiv = li.children[1]; // direct access to the second child assuming it's a div
    const title = secondDiv ? secondDiv.textContent.trim() : ''; // Get the text content as title

    // loop over each li
    [...li.children].forEach((div) => {
      // first div is for the video thumbnail image
      if (div.querySelector('picture')) {
        div.className = 'video-list-card-image';
        const picture = div.querySelector('picture');
        if (picture) {
          const anchor = document.createElement('a');
          anchor.href = href;
          anchor.setAttribute('data-modal', href);
          anchor.title = title;
          anchor.addEventListener('click', openModal);
          picture.parentNode.insertBefore(anchor, picture);
          anchor.appendChild(picture);
        }

        if (isVideo(href)) {
          div.classList.add('video');
        } else {
          div.classList.add('gif');
        }
      } else if (!div.querySelector('picture') && li.querySelector('.video-list-card-body') === null) {
        // second div is for the video description
        div.className = 'video-list-card-body';
      } else {
        // remaining divs are appended to prior video body div
        div.previousSibling.append(div.firstElementChild);
        // Set class names for the first and second paragraphs within the video-list-card-body
        const paragraphs = div.previousSibling.querySelectorAll('p');
        if (paragraphs.length > 0) {
          // change video title to an h3
          const h4 = document.createElement('h4');
          h4.className = 'video-title';

          const newLink = document.createElement('a');
          newLink.href = href;
          newLink.textContent = paragraphs[0].textContent;
          newLink.setAttribute('data-modal', href);
          newLink.addEventListener('click', openModal);
          h4.appendChild(newLink);

          div.previousSibling.replaceChild(h4, paragraphs[0]);
        }
        if (paragraphs.length > 1) {
          paragraphs[1].className = 'video-description';
        }
      }

      ul.append(li);
    });

    // Remove the last div that contained the original link
    const linkDiv = li.children[2];
    if (linkDiv && linkDiv.parentNode) {
      linkDiv.parentNode.removeChild(linkDiv);
    }
  });

  // format images
  ul.querySelectorAll('img').forEach((img) => {
    // optimize image
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  // Remove any empty div tags
  [...ul.querySelectorAll('div')].forEach((div) => {
    if (div.children.length === 0 && div.textContent.trim() === '') {
      div.parentNode.removeChild(div);
    }
  });

  block.textContent = '';
  block.append(ul);
}
