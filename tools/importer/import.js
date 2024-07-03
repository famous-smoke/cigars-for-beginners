/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*
 * AEM Generic Import Script
 * Import Pages as subfolders
 */

// Create the Cigar Terms
const createTermsBlock = (post, document) => {
  const termsSection = document.getElementById('cigar-terminology');
  const termsDiv= termsSection.firstElementChild;
  const terms = document.getElementById('cigar-terms');
  const termWords = terms.getElementsByTagName('h4');

  if (!termsSection || termsSection.length === 0) {
    // no terms to add
    return;
  }

  const cell = [['Terms']];

  for (const word of termWords) {
    let definition = word.nextElementSibling;
    cell.push([[word.textContent], [definition.textContent]]);
  }

  const block = WebImporter.DOMUtils.createTable(cell, document);
  //post.append(block);

  console.log(termsDiv);

  termsDiv.insertBefore(block, terms);

  // remove letters navigation, we will rebuild it
  const letterNav = termsSection.getElementsByClassName('letter-navigation');
  letterNav[0].remove();

  if (document.getElementById('cigar-terms')) {
    document.getElementById('cigar-terms').remove();
  }
}

export default {
  transformDOM: ({ document }) => {
    const post = document.getElementById('main');
    createTermsBlock(post, document);
    return post;
  },

  generateDocumentPath: ({ document, url, html, params }) => {
    let documentPath = document.querySelector("link[rel='canonical']").getAttribute('href');
    documentPath = WebImporter.FileUtils.sanitizePath(documentPath);
    return documentPath;
  },
};
