(function() {
  var generateProjects, projects, selector;

  selector = function(str) {
    return document.body.querySelector(str);
  };

  projects = [
    {
      name: 'crescent',
      description: 'a cli for moonscript',
      image: 'crescent.png',
      url: 'https://github.com/Kingdaro/crescent'
    }
  ];

  generateProjects = function() {
    var description, div, i, image, len, name, ref, results, url;
    div = selector('.projects');
    results = [];
    for (i = 0, len = projects.length; i < len; i++) {
      ref = projects[i], name = ref.name, description = ref.description, image = ref.image, url = ref.url;
      results.push(div.innerHTML += "<a class='project' href='" + url + "' style='background-image: url(site/images/" + image + ")' target='_blank'> <div class='project-info'> <h3>" + name + "</h3><p>" + description + "</p> </div> <div class='hover'></div> </a>");
    }
    return results;
  };

  window.addEventListener('load', function() {
    return generateProjects();
  });

}).call(this);
