let currentPage = 1;
let reposPerPage = 10;
let totalRepos = 0;

function togglePaginationButtons(show) {
    let paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => {
        button.style.display = show ? 'inline-block' : 'none';
    });
}

function genRepo(user, page) {
    const testuser = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

    if (testuser.test(user) == "false" || user == "" || user == null) {
        window.location.href = "index.html";
        alert("Sorry, the GitHub username appears to be invalid.");
    } else {
        let userUrl = `https://api.github.com/users/${user}`;
        $.get(userUrl)
            .done(function(userData) {
                totalRepos = userData.public_repos;
                updatePageInfo();
                togglePaginationButtons(true);
            })
            .fail(function() {
                window.location.href = "index.html";
                alert("Sorry, the GitHub username appears to be invalid.");
            });

        let requestURL = `https://api.github.com/users/${user}/repos?page=${page}&per_page=${reposPerPage}`;
        $.get(requestURL)
            .done(function(repos) {
                if (!Array.isArray(repos) || !repos.length) {
                    window.location.href = "index.html";
                    alert("Sorry, the GitHub username appears to be invalid.");
                } else {
                    displayRepos(repos);
                }
            });
    }
}

function updatePageInfo() {
    let totalPages = Math.ceil(totalRepos / reposPerPage);
    $("#page-info").text(`${currentPage}/${totalPages}`);
}

function paginate(direction) {
    switch (direction) {
        case 'first':
            currentPage = 1;
            break;
        case 'prev':
            if (currentPage > 1) {
                currentPage--;
            }
            break;
        case 'next':
            let totalPages = Math.ceil(totalRepos / reposPerPage);
            if (currentPage < totalPages) {
                currentPage++;
            }
            break;
        case 'last':
            totalPages = Math.ceil(totalRepos / reposPerPage);
            currentPage = totalPages;
            break;
        default:
            break;
    }

    let user = document.getElementById("user").value;
    genRepo(user, currentPage);
}


function displayRepos(repos) {
    $("#repo-box").empty();

    for (const repo of repos) {
        let repo_url = repo.html_url;
        let username = repo.owner.login;
        let repo_name = repo.name;
        let repo_description = repo.description;
        let repo_language = repo.language;
        let repo_stars = repo.stargazers_count;
        let repo_forks = repo.forks;

        if (repo_description == null) {
            repo_description = "<i>~</i>";
        }
        if (repo_language == null) {
            repo_language = "-";
        }

        $("#repo-box").append("<a href='" + repo_url + "' target='_blank'><div class='repo-item'><h1 class='title'>" +
            username + "/" +
            repo_name + "</h1><p class='description'>" +
            repo_description + "</p>" +
            "<div class='bottom'><div class='language'><span class='fa-solid fa-code' style='color: #ffffff;'></span>" + " " + repo_language +
            "</div> <div class='star'><span class='fa-regular fa-star' style='color: #ffffff;'></span>" + " " + repo_stars +
            "</div> <div class='fork'><span class='fa-solid fa-code-fork' style='color: #ffffff;'></span>" + " " + repo_forks +
            "</div></div></div>");
    }
}
document.addEventListener('DOMContentLoaded', function() {
    togglePaginationButtons(false);
});