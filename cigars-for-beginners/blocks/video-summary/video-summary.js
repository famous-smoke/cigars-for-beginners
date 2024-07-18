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
  btn.addEventListener('click', e => {
    btn.nextElementSibling.classList.toggle('show');
    btn.firstElementChild.classList.toggle('show');
  });
  return btn;
}

export default async function decorate(block) {
  const url = block.querySelector('a');
  const embed = getEmbed(url);
  url.parentElement.replaceWith(embed);

  const description = block.querySelector('div > div:last-child p');
  description.parentElement.prepend(getShowHide());
}
