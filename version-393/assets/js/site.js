(function () {
    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                stop();
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
        forms.forEach(function (form) {
            var input = form.querySelector("[data-filter-input]");
            var scope = form.parentElement || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".js-card"));
            if (!input || !cards.length) {
                return;
            }
            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                    card.classList.toggle("is-hidden", value && text.indexOf(value) === -1);
                });
            });
        });
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (shell) {
            var video = shell.querySelector("video");
            var source = shell.querySelector("source");
            var playButton = shell.querySelector("[data-play-button]");
            if (!video || !source) {
                return;
            }
            var src = source.getAttribute("src");
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        shell.classList.add("has-error");
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else {
                video.src = src;
            }

            function playOrPause() {
                if (video.paused) {
                    var promise = video.play();
                    if (promise && promise.catch) {
                        promise.catch(function () {
                            shell.classList.add("has-error");
                        });
                    }
                } else {
                    video.pause();
                }
            }

            if (playButton) {
                playButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    playOrPause();
                });
            }

            video.addEventListener("play", function () {
                shell.classList.add("is-playing");
                shell.classList.remove("has-error");
            });
            video.addEventListener("pause", function () {
                shell.classList.remove("is-playing");
            });
            video.addEventListener("error", function () {
                shell.classList.add("has-error");
            });
        });
    }

    onReady(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
}());
