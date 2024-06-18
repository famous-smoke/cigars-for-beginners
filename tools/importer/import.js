/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*
 * AEM Generic Import Script
 * Import Pages as subfolders
 */

export default {
  generateDocumentPath: ({ document, url, html, params }) => {
    let documentPath = document.querySelector("link[rel='canonical']").getAttribute('href');
    documentPath = WebImporter.FileUtils.sanitizePath(documentPath);
    return documentPath;
  },
};
