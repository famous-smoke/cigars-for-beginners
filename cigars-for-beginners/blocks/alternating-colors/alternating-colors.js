export default function decorate(block) {
  for (const child of block.children) {
    const firstDiv = child.children[0];
    const h4 = document.createElement('h4');
    //convert the first div to h4
    h4.textContent = firstDiv.textContent;
    firstDiv.replaceWith(h4);
  }
}
