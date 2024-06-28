import { createOptimizedPicture } from '../../scripts/aem.js';

// Build block
export default async function decorate(block) {
  const isCheckboxList = block.classList.contains('checkmarks');
  const isImageList = block.querySelectorAll('img').length > 0;
  const animateRight = block.classList.contains('animate-right');
  const centered = block.classList.contains('centered');

  // Create a new unordered list element
  const ul = document.createElement('ul');

  // Add checkmarks or images class when defined in the block
  if (isImageList) {
    ul.classList.add('images');
  } else if (isCheckboxList) {
    ul.classList.add('checkmarks');
  }

  // Apply centered styling if the centered class is present
  if (centered) {
    ul.classList.add('centered');
  }

  // Get all the div elements containing the h and p elements
  const divs = block.querySelectorAll(':scope > div');

  // Loop through each div to create list items
  divs.forEach((div) => {
    // Create a new list item
    const li = document.createElement('li');

    // Get the picture element, if it exists
    const picture = div.querySelector('picture');
    if (picture) {
      li.appendChild(picture);
    } else {
      // Add checkmark picture element
      const checkmarkPicture = createOptimizedPicture('/cigars-for-beginners/icons/icon-green-checkmark.png', 'Checkmark');
      checkmarkPicture.className = 'footer-logo';
      const img = checkmarkPicture.lastElementChild;
      img.width = 92;
      img.height = 72;
      li.appendChild(checkmarkPicture);
    }

    // Create container for h/p
    const contentDiv = document.createElement('div');

    // Get all heading elements within the div
    const headings = div.querySelectorAll('h3, h4, h5, h6');

    // Append each heading to contentDiv if it exists
    headings.forEach((heading) => {
      contentDiv.appendChild(heading);
    });

    // Get all p elements
    const paragraphs = div.querySelectorAll('p');
    paragraphs.forEach((p) => {
      contentDiv.appendChild(p);
    });

    // Append content to list
    li.appendChild(contentDiv);

    // If animate-right class is present, apply the initial hidden state
    if (animateRight) {
      li.style.opacity = '0';
      li.style.transform = 'translateX(-200px)';
    }

    // Append the list item to the unordered list
    ul.appendChild(li);
  });

  // Replace the original block content with the unordered list
  block.innerHTML = '';
  block.append(ul);
}
