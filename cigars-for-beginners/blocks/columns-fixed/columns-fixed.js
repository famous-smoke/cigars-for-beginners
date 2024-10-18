export default function decorate(block) {
  const rows = block.children;
  const colWidths = [];

  // set column width, title from header row
  if (rows[0]) {
    rows[0].classList.add('header');

    Array.from(rows[0].children).forEach((cell) => {
      const [title, width] = cell.innerText.split('|').map((text) => text.trim());
      if (width) {
        cell.style.width = width;
        colWidths.push(width);
      }

      cell.innerText = title;
    });
  }

  // set the widths on every other row
  // eslint-disable-next-line no-plusplus
  for (let i = 1; rows.length > 0; i++) {
    if (!(i in rows)) {
      break;
    }

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < rows[i].children.length; j++) {
      const cell = rows[i].children[j];
      cell.style.width = colWidths[j];

      // Detect and remove the button-container p tag, and make the picture a link
      const buttonContainer = cell.querySelector('p.button-container');

      if (buttonContainer) {
        // Get the href from the a tag inside buttonContainer
        const link = buttonContainer.querySelector('a');
        const href = link.getAttribute('href');

        // Remove the button-container p tag
        buttonContainer.remove();

        // Find the picture
        const picture = cell.querySelector('picture');
        if (picture) {
          // Create a new a element
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', href);

          // Replace the picture with the linkElement, and append the picture to it
          picture.parentNode.replaceChild(linkElement, picture);
          linkElement.appendChild(picture);
        }
      }

      // Set picture widths for columns containing only a picture and a width
      const children = cell.firstElementChild.childNodes;
      let img = null;
      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < children.length; k++) {
        if (children[k].tagName === 'PICTURE') {
          img = children[k].lastElementChild;
        } else if (img && children[k].textContent.startsWith('|')) {
          // eslint-disable-next-line max-len
          img.style.width = children[k].textContent.substring(1, children[k].textContent.length).trim();
          children[k].textContent = '';
          break;
        }
      }
    }
  }
}
