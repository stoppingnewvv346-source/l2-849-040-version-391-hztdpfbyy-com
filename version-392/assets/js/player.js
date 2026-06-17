(function () {
  function bindPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var stream = player.getAttribute('data-stream');
    var hlsInstance = null;
    if (!video || !stream) {
      return;
    }

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function start() {
      if (button) {
        button.classList.add('is-hidden');
      }
      video.setAttribute('controls', 'controls');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.getAttribute('src')) {
          video.setAttribute('src', stream);
        }
        playVideo();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
        } else {
          playVideo();
        }
        return;
      }
      if (!video.getAttribute('src')) {
        video.setAttribute('src', stream);
      }
      playVideo();
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }
    player.addEventListener('click', function (event) {
      if (event.target === video && video.getAttribute('src')) {
        return;
      }
      start();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(bindPlayer);
  });
})();
