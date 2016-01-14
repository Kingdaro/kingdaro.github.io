(function() {
  var generateProjects, projects, selector;

  selector = function(str) {
    return document.body.querySelector(str);
  };

  projects = [
    {
      name: 'crescent',
      description: 'a cli for moonscript'
    }
  ];

  generateProjects = function() {
    var description, div, i, len, name, ref, results;
    div = selector('.projects');
    results = [];
    for (i = 0, len = projects.length; i < len; i++) {
      ref = projects[i], name = ref.name, description = ref.description;
      results.push(div.innerHTML += "<a class='project' href='#'> <div class='project-info'> <h3>" + name + "</h3><p>" + description + "</p> </div> </a>");
    }
    return results;
  };

  window.addEventListener('load', function() {
    return generateProjects();
  });

}).call(this);

//# sourceMappingURL=projects.js.map