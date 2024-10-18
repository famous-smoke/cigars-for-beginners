/**
 * generate embed
 * @param url
 * @return {HTMLIFrameElement}
 */
function getEmbed(url) {
  const frame = document.createElement('iframe');

  const frameUrl = new URL(url);
  frameUrl.searchParams.append('autoplay', 1);

  frame.className = 'video-summary-embed';
  frame.src = frameUrl.toString();
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
  btn.addEventListener('click', () => {
    btn.nextElementSibling.classList.toggle('show');
    btn.firstElementChild.classList.toggle('show');
  });
  return btn;
}

export default async function decorate(block) {
  const url = block.querySelector('a');

  const img = block.querySelector('img');
  img.className = 'video-summary-embed';

  const facadeWrap = img.parentElement;
  facadeWrap.className = 'video-summary-embed-facade';
  facadeWrap.addEventListener('click', () => {
    const embed = getEmbed(url.innerText);
    facadeWrap.replaceWith(embed);
  });

  url.remove();

  const description = block.querySelector(':scope > div > div:last-child p');
  description.parentElement.prepend(getShowHide());
}
