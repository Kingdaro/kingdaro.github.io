# out: projects.js, sourcemap: true

selector = (str) -> document.body.querySelector str

projects = [
  {
    name: 'crescent'
    description: 'a cli for moonscript'
  }
]

generateProjects = ->
  div = selector '.projects'
  for {name, description} in projects
    div.innerHTML += "<a class='project' href='#'>
      <div class='project-info'>
        <h3>#{name}</h3><p>#{description}</p>
      </div>
    </a>"

window.addEventListener 'load', ->
  generateProjects()
