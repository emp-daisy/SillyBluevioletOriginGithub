const user = "emp-daisy";
const token = "enter-token"
const query = `
  query {
    user(login: "${user}") {
      bio
      avatarUrl
      name
      login
      status {
        emojiHTML
        message
      }
      starredRepositories {
        totalCount
      }
      repositories(ownerAffiliations: [OWNER], privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}, first: 20) {
        totalCount
        nodes {
          name
          description
          pushedAt
          primaryLanguage {
            color
            name
          }
          stargazerCount
          licenseInfo {
            name
          }
          forkCount
          isFork
        }
      }
    }
  }
`;

const options = {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ query }),
};

fetch("https://api.github.com/graphql", options)
  .then(res => res.json())
  .then(res => {
    if(res.data){
      setRepoData(res.data.user.repositories)
      setProfileData(res.data.user)
      document.querySelector('.main-container').style.visibility = "visible";
    } else {
      setErrorPage()
    }
  })
  .catch((err) => { console.log(err) });

function setProfileData(info) {
  const {
    login: username,
    name: fullname,
    bio: description,
    avatarUrl: avatar = `https://github.com/identicons/${user}.png`,
    status
  } = info;

  document.querySelectorAll(".login-username").forEach((el) => {
    el.innerText = username;
  });

  document.querySelectorAll(".login-avatar").forEach((el) => {
    el.src = avatar;
  });

  document.querySelector(".login-fullname").innerText = fullname;

  document.querySelector(".login-description").innerText = description;

  document.querySelectorAll(".login-status").forEach((el) => {
    el.innerHTML = `
      <div class="">
        ${status?.emojiHTML || ''}
              <span>${status?.message ? status.message : "Edit status"}</span>
          </div>
      </div>
  `;
  })
}

function setRepoData(info) {
  const {
    totalCount: repoCount,
    nodes: repos
  } = info;

  document.querySelectorAll(".user-repo-count").forEach((el) => {
    el.innerText = repoCount;
  });
  const repoContainer = document.querySelector(".all_repos");
  const repoListElms = repos.map(({
    name, description, stargazerCount, forkCount, licenseInfo, pushedAt, primaryLanguage
  }) => (
      `
        <div class="repository">
            <div class="content">
                <div class="repository_name"><a href="#">${name}</a></div>
                <div class="repository_description">
                    <h5>${description || ''}</h5>
                </div>
                <div class="repository_details">
                ${primaryLanguage ? `
                    <div class="languages_used">
                        <div class="language_name">
                            <div style="background: ${primaryLanguage?.color};"></div>
                            <h5>${primaryLanguage?.name}</h5>
                        </div>
                    </div>
                      ` : ''
                }

                    ${stargazerCount ? `
                      <div class="star_count">
                        <svg viewBox="0 0 16 16" version="1.1" width="16" height="16">
                            <path fill-rule="evenodd"
                                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                            </path>
                        </svg>
                        <span class="user-repo-count">${stargazerCount}</span>
                    </div>
                      ` : ''
                    }

                    ${forkCount? `
                      <div class="members_count">
                        <svg aria-label="fork" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                            <path fill-rule="evenodd"
                                d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
                            </path>
                        </svg>
                        <span>${forkCount}</span>
                    </div>
                      ` : ''
                    }

                    ${ licenseInfo ?.name ? `
                      <div class="mit_license">
                        <svg viewBox="0 0 16 16" version="1.1" width="16" height="16"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
                          <span>${licenseInfo ?.name} </span>
                    </div>
                      ` : ''
                    }

                    <div class="updated_date">
                        Updated ${getTimeDiff(pushedAt)}
                    </div>
                </div>
            </div>
            <div class="starred">
                <button>
                    <svg viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd"
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                        </path>
                    </svg>
                    <span>Star</span></button>
            </div>
        </div>
      `
    ));

  repoContainer.innerHTML = repoListElms.join('');
}

function getTimeDiff(date) {
  const difference = new Date().getTime() - new Date(date).getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24));
  if (days < 31) return `${days} day${days > 1 ? 's' : ''} ago`;

  return `${new Date(date).toLocaleDateString("en-US", { day: 'numeric' })} ${new Date(date).toLocaleDateString("en-US", { month: 'short' })} ${days>365?new Date(date).toLocaleDateString("en-US", { year: 'numeric' }):''}`;
}

function setErrorPage() {

}