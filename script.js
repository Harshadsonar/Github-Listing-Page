let currentPage = 1;
let reposPerPage = 10;
let totalRepos = 0;

function togglePaginationButtons(show) {
    let paginationButtons = document.querySelectorAll(".pagination button");
    paginationButtons.forEach((button) => {
        button.style.display = show ? "inline-block" : "none";
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
        $.get(requestURL).done(function(repos) {
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
        case "first":
            currentPage = 1;
            break;
        case "second":
            currentPage = 2;
            break;
        case "third":
            currentPage = 3;
            break;
        case "fourth":
            currentPage = 4;
            break;
        case "fifth":
            currentPage = 5;
            break;
        case "sixth":
            currentPage = 6;
            break;
        case "seventh":
            currentPage = 7;
            break;
        case "eigth":
            currentPage = 8;
            break;
        case "ninth":
            currentPage = 9;
            break;
        case "tenth":
            currentPage = 10;
            break;
        case "older":
            if (currentPage > 1) {
                currentPage--;
            }
            break;
        case "newer":
            let totalPages = Math.ceil(totalRepos / reposPerPage);
            if (currentPage < totalPages) {
                currentPage++;
            }
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
        let repo_languages = repo.language;

        let user_location = repo.owner.location;
        let user_social_handles = repo.owner.social_handles || {};

        if (repo_description == null) {
            repo_description = "<i>~</i>";
        }
        if (repo_languages == null) {
            repo_languages = ["-"];
        } else if (!Array.isArray(repo_languages)) {
            repo_languages = [repo_languages];
        }

        let languagesHTML = repo_languages
            .map((language) => {
                return `<span class='fa-solid fa-code' style='color: #ffffff;'></span> ${language}`;
            })
            .join(" ");

        let socialHandlesHTML = Object.entries(user_social_handles)
            .map(([platform, handle]) => {
                return `<a href='${handle}' target='_blank'><img src='${getSocialMediaIcon(
          platform
        )}' alt='${platform} icon'></a>`;
            })
            .join(" ");

        $("#repo-box").append(
            "<a href='" +
            repo_url +
            "' target='_blank'><div class='repo-item'><h1 class='title'>" +
            username +
            "/" +
            repo_name +
            "</h1><p class='description'>" +
            repo_description +
            "</p>" +
            "<div class='bottom'><div class='language'>" +
            languagesHTML +
            "</div></div></div>"
        );
    }
}

document.addEventListener("DOMContentLoaded", function() {
    togglePaginationButtons(false);
});