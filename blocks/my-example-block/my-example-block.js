/*
 * My Example Block
 * Combines hero-style title with embedded video
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Video embedding functions (adapted from video block)
function getVideoSource(link) {
  if (link.includes('youtube') || link.includes('youtu.be')) return 'youtube';
  if (link.includes('vimeo')) return 'vimeo';
  return 'video';
}

function embedYoutube(url, autoplay, background) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      mute: background ? '1' : '0',
      controls: background ? '0' : '1',
      disablekb: background ? '1' : '0',
      loop: background ? '1' : '0',
      playsinline: background ? '1' : '0',
    };
    suffix = `&${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function embedVimeo(url, autoplay, background) {
  const [, video] = url.pathname.split('/');
  let suffix = '';
  if (background || autoplay) {
    const suffixParams = {
      autoplay: autoplay ? '1' : '0',
      background: background ? '1' : '0',
    };
    suffix = `?${Object.entries(suffixParams).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  }
  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

function getVideoElement(source, autoplay, background) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  if (autoplay) video.setAttribute('autoplay', '');
  if (background) {
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    video.addEventListener('canplay', () => {
      video.muted = true;
      if (autoplay) video.play();
    });
  }

  const sourceEl = document.createElement('source');
  sourceEl.setAttribute('src', source);
  sourceEl.setAttribute('type', `video/${source.split('.').pop()}`);
  video.append(sourceEl);

  return video;
}

function loadVideoEmbed(container, link, autoplay, background) {
  if (container.dataset.embedLoaded === 'true') return;

  const url = new URL(link);
  const source = getVideoSource(link);

  if (source === 'youtube') {
    const embedWrapper = embedYoutube(url, autoplay, background);
    container.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      container.dataset.embedLoaded = true;
    });
  } else if (source === 'vimeo') {
    const embedWrapper = embedVimeo(url, autoplay, background);
    container.append(embedWrapper);
    embedWrapper.querySelector('iframe').addEventListener('load', () => {
      container.dataset.embedLoaded = true;
    });
  } else {
    const videoEl = getVideoElement(link, autoplay, background);
    container.append(videoEl);
    videoEl.addEventListener('canplay', () => {
      container.dataset.embedLoaded = true;
    });
  }
}

export default async function decorate(block) {
  // Parse authored content: assume rows with "Label: Value"
  const rows = [...block.children];
  let title = '';
  let videoLink = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const label = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (label.startsWith('title')) {
        title = value;
      } else if (label.startsWith('video')) {
        videoLink = value;
      }
    }
  });

  // Clear block and build hero structure
  block.textContent = '';
  block.classList.add('hero-video');

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-video-content';

  if (title) {
    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    heroContent.append(titleEl);
  }

  const videoContainer = document.createElement('div');
  videoContainer.className = 'hero-video-player';
  videoContainer.dataset.embedLoaded = 'false';

  heroContent.append(videoContainer);
  block.append(heroContent);

  // Lazy load video
  if (videoLink) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = !prefersReducedMotion.matches; // Autoplay if motion allowed
        loadVideoEmbed(videoContainer, videoLink, playOnLoad, false);
      }
    });
    observer.observe(block);
  }
}
