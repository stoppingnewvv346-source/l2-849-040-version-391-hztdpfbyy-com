document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var sortSelect = document.querySelector('[data-sort-select]');
  var grid = document.querySelector('[data-filter-grid]');
  var empty = document.querySelector('[data-empty-message]');

  function applyFilterAndSort() {
    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var haystack = card.getAttribute('data-search') || card.textContent.toLowerCase();
      var visible = !keyword || haystack.indexOf(keyword) !== -1;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (sortSelect) {
      var mode = sortSelect.value;
      cards.sort(function (a, b) {
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }
        if (mode === 'year') {
          return parseInt(b.getAttribute('data-year'), 10) - parseInt(a.getAttribute('data-year'), 10);
        }
        return parseInt(a.getAttribute('data-order'), 10) - parseInt(b.getAttribute('data-order'), 10);
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0);
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilterAndSort);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilterAndSort);
  }

  applyFilterAndSort();
});
