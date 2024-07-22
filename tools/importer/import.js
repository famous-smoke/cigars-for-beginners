/* eslint-disable */

import videoRedirects from './video-redirects.js';

/*
  create the video list blocks
 */
const createVideoListBlock = (page, document) => {
  // check if there are any videos on this page
  const videos = document.querySelectorAll('.video-block');
  const videoItems = [];
  videoItems.push([['Video-list']]);
  if (!videos || videos.length === 0) {
    return;
  }

  const redirects = videoRedirects();
  videos.forEach((video) => {
    const icon = video.querySelector('a img:last-child');
    const title = video.querySelector('h4').innerText.trim();
    const description = video.querySelector('p').innerText.trim();
    const videoModal = document.getElementById(video.querySelector('a').href.split('#')[1]);
    let link = videoModal.querySelector('iframe');
    if (link) {
      link = link.src;

      // check if this is a YouTube URL that should be changed to Vimeo
      if (link in redirects) {
        link = redirects[link];
      }
    } else {
      link = videoModal.querySelector('img');
    }

    const row = [[icon], [title], [description], [link]];

    videoItems.push(row);
  });

  const videoList = WebImporter.DOMUtils.createTable(videoItems, document);

  const videoRows = document.querySelector('.video-rows');
  videoRows.replaceWith(videoList);

  // remove .video-rows from page because we just added it manually
  WebImporter.DOMUtils.remove(page, ['.video-rows']);
};

export default {
  transformDOM: ({ document }) => {
    const page = document.getElementById('content');
    createVideoListBlock(page, document);
    return page;
  },

  generateDocumentPath: ({ document, url, html, params }) => {
    let documentPath = document.querySelector("link[rel='canonical']").getAttribute('href');
    documentPath = WebImporter.FileUtils.sanitizePath(documentPath);
    return documentPath;
  },
};
