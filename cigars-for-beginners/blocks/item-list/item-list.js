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

  // Get all the div elements containing the h3 and p elements
  const divs = block.querySelectorAll(':scope > div');

  // Loop through each div to create list items
  divs.forEach((div) => {
    // Create a new list item
    const li = document.createElement('li');

    // Get the picture element, if it exists
    const picture = div.querySelector('picture');
    if (picture) {
      li.appendChild(picture);
    }

    // Get the h3 elements
    const h3 = div.querySelector('h3');
    if (h3) li.appendChild(h3);

    // Get all p elements
    const paragraphs = div.querySelectorAll('p');
    paragraphs.forEach((p) => {
      li.appendChild(p);
    });

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
