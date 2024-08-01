/**
 * generate embed
 * @param url
 * @return {HTMLIFrameElement}
 */
function getEmbed(url) {
  const frame = document.createElement('iframe');
  frame.className = 'video-summary-embed';
  frame.src = url;
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  frame.autoplay = 1;

  return frame;
}

/**
 * get show/hide button
 */
function getShowHide() {
  const btn = document.createElement('button');
  btn.className = 'video-summary-btn';
  btn.textContent = 'Read the video summary';

  const btnStatus = document.createElement('span');
  btnStatus.className = 'video-summary-btn-status';

  btn.prepend(btnStatus);
  btn.addEventListener('click', () => {
    btn.nextElementSibling.classList.toggle('show');
    btn.firstElementChild.classList.toggle('show');
  });
  return btn;
}

export default async function decorate(block) {
  const url = block.querySelector('a');

  const title = block.querySelector('h3');
  title.className = 'video-summary-embed-title';

  const img = block.querySelector('img');
  img.className = 'video-summary-embed';

  const facadeWrap = title.parentElement;
  facadeWrap.className = 'video-summary-embed-facade';
  facadeWrap.addEventListener('click', () => {
    const embed = getEmbed(url.innerText);
    facadeWrap.replaceWith(embed);
    title.remove();
  });

  url.remove();

  const description = block.querySelector(':scope > div > div:last-child p');
  description.parentElement.prepend(getShowHide());
}
