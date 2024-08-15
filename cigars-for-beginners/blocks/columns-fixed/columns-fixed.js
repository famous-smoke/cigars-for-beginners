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
      rows[i].children[j].style.width = colWidths[j];
    }
  }
}
