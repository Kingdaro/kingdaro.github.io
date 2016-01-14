(function() {
  var links;

  links = [['GitHub', 'github', 'https://github.com/Kingdaro'], ['Twitter', 'twitter', 'https://twitter.com/KingdaroBL'], ['SoundCloud', 'soundcloud', 'https://soundcloud.com/kingdaro'], ['YouTube', 'youtube', 'https://youtube.com/Kingdaro557'], ['Tumblr', 'tumblr', 'https://kingmod-kun.tumblr.com']];

  window.addEventListener('load', function() {
    var element, hoverTitle, i, icon, iconClass, len, link, ref, results, title, url;
    element = document.querySelector('.social');
    results = [];
    for (i = 0, len = links.length; i < len; i++) {
      ref = links[i], title = ref[0], iconClass = ref[1], url = ref[2];
      link = element.appendChild(document.createElement('a'));
      icon = link.appendChild(document.createElement('i'));
      hoverTitle = link.appendChild(document.createElement('div'));
      link.title = title;
      link.href = url;
      link.target = '_blank';
      icon.className = "fa fa-lg fa-" + iconClass;
      hoverTitle.className = 'hover-title';
      results.push(hoverTitle.textContent = title);
    }
    return results;
  });

}).call(this);

//# sourceMappingURL=social.js.map