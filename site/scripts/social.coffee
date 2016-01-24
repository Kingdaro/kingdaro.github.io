# out: social.js

links = [
  # [ name, fa icon, url ]
  ['GitHub', 'github', 'https://github.com/Kingdaro']
  ['Twitter', 'twitter', 'https://twitter.com/KingdaroBL']
  ['SoundCloud', 'soundcloud', 'https://soundcloud.com/kingdaro']
  ['YouTube', 'youtube', 'https://youtube.com/Kingdaro557']
  ['Tumblr', 'tumblr', 'https://kingmod-kun.tumblr.com']
]

window.addEventListener 'load', ->
  element = document.querySelector '.social'

  for [title, iconClass, url] in links
    link = element.appendChild document.createElement 'a'
    icon = link.appendChild document.createElement 'i'
    hoverTitle = link.appendChild document.createElement 'div'

    link.title = title
    link.href = url
    link.target = '_blank'

    icon.className = "fa fa-lg fa-#{iconClass}"

    hoverTitle.className = 'hover-title'
    hoverTitle.textContent = title
