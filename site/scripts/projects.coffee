selector = (str) -> document.body.querySelector str

projects = [
  { name: 'project title' }
  { name: 'project title' }
  { name: 'project title' }
  { name: 'project title' }
  { name: 'project title' }
  { name: 'project title' }
  { name: 'project title' }
]

generateProjects = ->
  div = selector '.projects'
  for {name} in projects
    div.innerHTML += "<div><h3>#{name}</h3></div>"

window.addEventListener 'load', ->
  generateProjects()
