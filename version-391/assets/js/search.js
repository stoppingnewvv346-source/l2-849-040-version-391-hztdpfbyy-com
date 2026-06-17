document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var results = document.querySelector('[data-search-results]');
  var meta = document.querySelector('[data-search-meta]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  if (input) {
    input.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function createCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + tag + '</span>';
    }).join('');

    return [
      '<a class="wide-card" href="' + movie.url + '">',
      '  <div class="wide-cover">',
      '    <img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy" />',
      '    <span class="year-badge">' + movie.year + '</span>',
      '  </div>',
      '  <div class="wide-content">',
      '    <div class="wide-meta"><span>' + movie.category + '</span><span>' + movie.region + '</span></div>',
      '    <h3>' + movie.title + '</h3>',
      '    <p>' + movie.oneLine + '</p>',
      '    <div class="tag-list">' + tags + '</div>',
      '  </div>',
      '</a>'
    ].join('');
  }

  function render(query) {
    if (!results || !meta) {
      return;
    }

    var keyword = normalize(query);
    var source = window.SEARCH_INDEX || [];
    var matched = source.filter(function (movie) {
      if (!keyword) {
        return true;
      }
      return normalize(movie.searchText).indexOf(keyword) !== -1;
    });

    meta.textContent = keyword ? '找到 ' + matched.length + ' 条与“' + query + '”相关的影片。' : '展示全部 ' + matched.length + ' 条影片，可输入关键词进一步筛选。';

    if (!matched.length) {
      results.innerHTML = '<div class="empty-message is-visible">暂无匹配结果，请尝试其他关键词。</div>';
      return;
    }

    results.innerHTML = matched.slice(0, 240).map(createCard).join('');

    if (matched.length > 240) {
      results.insertAdjacentHTML('beforeend', '<div class="empty-message is-visible">结果较多，已显示前 240 条。请继续输入更具体的关键词。</div>');
    }
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input ? input.value.trim() : '';
      var nextUrl = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
      window.history.replaceState({}, '', nextUrl);
      render(query);
    });
  }

  render(initialQuery);
});
