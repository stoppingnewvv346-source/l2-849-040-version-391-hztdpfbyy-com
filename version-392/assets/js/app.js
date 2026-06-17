(function () {
  function queryAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initMobileNav() {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = '×';
      } else {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = queryAll('[data-hero-slide]', hero);
    var dots = queryAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    queryAll('[data-filter-panel]').forEach(function (panel) {
      var scope = panel.parentElement || document;
      var cards = queryAll('[data-movie-list] .movie-card', scope);
      var keyword = panel.querySelector('[data-filter-keyword]');
      var category = panel.querySelector('[data-filter-category]');
      var year = panel.querySelector('[data-filter-year]');
      var region = panel.querySelector('[data-filter-region]');

      function apply() {
        var key = normalize(keyword && keyword.value);
        var cat = normalize(category && category.value);
        var y = normalize(year && year.value);
        var reg = normalize(region && region.value);
        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-category'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-keywords')
          ].join(' '));
          var ok = true;
          if (key && text.indexOf(key) === -1) {
            ok = false;
          }
          if (cat && normalize(card.getAttribute('data-category')) !== cat) {
            ok = false;
          }
          if (y && normalize(card.getAttribute('data-year')).indexOf(y) === -1) {
            ok = false;
          }
          if (reg && normalize(card.getAttribute('data-region')).indexOf(reg) === -1) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }

      [keyword, category, year, region].forEach(function (item) {
        if (item) {
          item.addEventListener('input', apply);
          item.addEventListener('change', apply);
        }
      });
    });
  }

  function cardTemplate(item) {
    return [
      '<article class="movie-card poster-card" data-title="', escapeHtml(item.title), '" data-category="', escapeHtml(item.category), '" data-year="', escapeHtml(item.year), '" data-region="', escapeHtml(item.region), '" data-keywords="', escapeHtml((item.genre || '') + ' ' + (item.tags || '')), '">',
      '<a href="', escapeHtml(item.url), '">',
      '<div class="poster-cover">',
      '<img src="', escapeHtml(item.cover), '" alt="', escapeHtml(item.title), '" loading="lazy">',
      '<div class="poster-shade"><p>', escapeHtml(item.oneLine), '</p></div>',
      '<span class="year-chip">', escapeHtml(item.year), '</span>',
      '<span class="score-chip">', escapeHtml(item.score), '</span>',
      '</div>',
      '<h3>', escapeHtml(item.title), '</h3>',
      '<p>', escapeHtml(item.category), '</p>',
      '</a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function initSearchPage() {
    var box = document.querySelector('[data-search-results]');
    if (!box || !window.SEARCH_DATA) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var input = document.querySelector('[data-search-input]');
    if (input) {
      input.value = q;
    }
    var term = normalize(q);
    var data = window.SEARCH_DATA;
    var result = term ? data.filter(function (item) {
      return normalize([
        item.title,
        item.category,
        item.year,
        item.region,
        item.genre,
        item.tags,
        item.oneLine
      ].join(' ')).indexOf(term) !== -1;
    }) : data.slice(0, 60);
    box.innerHTML = result.map(cardTemplate).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHero();
    initFilters();
    initSearchPage();
  });
})();
