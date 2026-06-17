document.addEventListener('DOMContentLoaded', function () {
  var player = document.querySelector('[data-player]');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var overlay = player.querySelector('[data-play-overlay]');
  var button = player.querySelector('[data-play-button]');
  var status = player.querySelector('[data-player-status]');
  var source = player.getAttribute('data-src') || window.MOVIE_VIDEO_URL;
  var hlsInstance = null;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  }

  function playVideo() {
    if (!video || !source) {
      setStatus('播放源暂不可用。');
      return;
    }

    setStatus('正在载入播放源…');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play().then(hideOverlay).catch(function () {
        setStatus('已加载播放源，请点击视频控件继续播放。');
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (hlsInstance) {
        hlsInstance.destroy();
      }

      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().then(function () {
          hideOverlay();
          setStatus('正在播放');
        }).catch(function () {
          hideOverlay();
          setStatus('播放源已就绪，请点击视频控件继续播放。');
        });
      });

      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放加载失败，请刷新页面或稍后重试。');
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
      return;
    }

    video.src = source;
    hideOverlay();
    setStatus('当前浏览器可能需要原生 HLS 支持才能播放。');
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }
});
