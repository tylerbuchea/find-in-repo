(function() {

  /**
   * Search Repo Files
   */
  function searchRepoFiles(searchWord, repoName) {
    return new Promise(
      function(resolve, reject) {
        const url = `https://api.github.com/search/code?q=${searchWord}+in:file+language:js+repo:${repoName}`;
        const request = new XMLHttpRequest();

        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            if (request.status === 200) {
              resolve(JSON.parse(request.responseText));
            } else {
              resolve(`Error: ${request.status}`);
            }
          }
        };
        request.open('GET', url);
        request.send(null);
      }
    );
  }

  /**
   * Render
   */
  function render(props) {
    console.log(props.filesInRepos);
    const content = props.filesInRepos.length === 0 ?
      `<h3>No Results</h3>` :
      props.filesInRepos.map(function(filesInRepo) {
        return (`
          <li class="repo">
            <h2>${filesInRepo[0].repository.full_name}</h2>
            <ul>
            ${filesInRepo.map(function(fileInRepo) {
                return (`<li><a href="${fileInRepo.html_url}" target="_blank">${fileInRepo.path}</a></li>`)
              }).join('\n')
            }
            </ul>
          </li>
        `)
      });

    document.getElementById('app').innerHTML = content;
  }

  /**
   * Load Data
   */
  function loadData(repos) {
    const filesInRepos = [];
    repos.forEach(function(repo, repoIndex) {
      searchRepoFiles(repo.keyword, repo.full_name)
        .then(function(files) {
          if (files.items && files.items.length)
            filesInRepos.push(files.items);
          if (repoIndex === repos.length - 1)
            render({ filesInRepos });
        });
    });
  }

  /**
   * Submit Search
   */
  function submitSearch(input) {
    const reposArray = [{ full_name: input.value.split(';')[0], keyword: input.value.split(';')[1] }];
    loadData(reposArray);
    input.value = '';
  }

  /**
   * Search Handler
   */
  function searchHandler(e) {
    if (loadTimeout) clearTimeout(loadTimeout);
    const repo = e.target.value.split(';')[0].replace(/[' ']/g, '');
    const searchword = e.target.value.split(';')[1];
    e.target.value = searchword !== undefined ? `${repo};${searchword}` : repo;

    if (e.which == 13 || e.keyCode == 13) {
      e.preventDefault();
      e.target.value = e.target.value.replace(/^\s+|\s+$/g, '');

      if (e.target.value.match(/\w+\/\w+\;[\w\W]/)) {
        submitSearch(e.target);
      } else {
        alert('Use correct search format: repo-owner/repo-name;keyword');
        e.target.value = e.target.value.replace(/^\s+|\s+$/g, '');
      }
    } else {
      // if (e.target.value.match(/\w+\/\w+\;[\w\W]/)) {
      //   loadTimeout = setTimeout(function() { submitSearch(e.target) }, 1000);
      // }
    }
  }

  /**
   * Init
   */
  var loadTimeout;
  const searchInput = document.querySelector('[name=search]');

  searchInput.focus();
  searchInput.addEventListener('keyup', searchHandler, false);

  var q = {};
  if (location.href.split('?').length > 1) {
    location.href.split('?')[1].split('&').forEach(function(i){
      q[i.split('=')[0]] = i.split('=')[1];
    });
  }

  if (q.repo && q.keyword) {
    searchInput.value = `${q.repo};${q.keyword}`;
    submitSearch(searchInput);
  }

})();
