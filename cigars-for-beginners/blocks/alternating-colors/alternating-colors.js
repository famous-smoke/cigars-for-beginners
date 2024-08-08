export default function decorate(block) {
  [...block.children].forEach((row) => {
    const firstDiv = row.children[0];
    const h4 = document.createElement('h4');
    // convert the first div to h4
    h4.textContent = firstDiv.textContent;
    firstDiv.replaceWith(h4);
  });
}
