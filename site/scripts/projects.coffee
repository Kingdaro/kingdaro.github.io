# out: projects.js

selector = (str) -> document.body.querySelector str

projects = [
  {
    name: 'crescent'
    description: 'a cli for moonscript'
    image: 'crescent.png'
    url: 'https://github.com/Kingdaro/crescent'
  }
]

generateProjects = ->
  div = selector '.projects'
  for {name, description, image, url} in projects
    div.innerHTML += "<a class='project' href='#{url}' style='background-image: url(site/images/#{image})' target='_blank'>
      <div class='project-info'>
        <h3>#{name}</h3><p>#{description}</p>
      </div>
      <div class='hover'></div>
    </a>"

window.addEventListener 'load', ->
  generateProjects()
