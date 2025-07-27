document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    const userDetailsDiv = document.getElementById('user-details');
    const reposListDiv = document.getElementById('repos-list');
    const noReposMessage = document.getElementById('no-repos-message');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const noUserDataMessage = document.getElementById('no-user-data-message');

    if (username) {
        fetchUserDetails(username);
        fetchUserRepos(username);
    } else {
        errorMessage.textContent = 'Username not found in URL.';
        errorMessage.style.display = 'block';
        noUserDataMessage.style.display = 'block';
    }

    async function fetchUserDetails(username) {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noUserDataMessage.style.display = 'none';

        try {
            const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Search-App'
                }
            });
            
            if (response.status === 404) {
                throw new Error('User not found.');
            }
            if (response.status === 401) {
                throw new Error('GitHub API authentication required. Please try again later.');
            }
            if (response.status === 403) {
                throw new Error('Rate limit exceeded. Please try again in a few minutes.');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const user = await response.json();

            if (!user.name && !user.bio && user.public_repos === 0 && user.followers === 0 && user.following === 0) {
                noUserDataMessage.style.display = 'block';
                userDetailsDiv.innerHTML = '';
                reposListDiv.innerHTML = '';
                noReposMessage.style.display = 'none';
                loadingMessage.style.display = 'none';
                return;
            }

            userDetailsDiv.innerHTML = `
                <div class="user-details-card">
                    <img src="${user.avatar_url}" alt="${user.login} Avatar">
                    <h2>${user.name || user.login}</h2>
                    <p>${user.bio || 'Bio not available.'}</p>
                    <p class="stats">
                        <span>Followers: ${user.followers}</span>
                        <span>Following: ${user.following}</span>
                        <span>Public Repos: ${user.public_repos}</span>
                    </p>
                    <p><a href="${user.html_url}" target="_blank">View Profile on GitHub</a></p>
                </div>
            `;
            loadingMessage.style.display = 'none';

        } catch (error) {
            console.error('Error fetching user details:', error);
            errorMessage.textContent = error.message || 'Error fetching user details.';
            errorMessage.style.display = 'block';
            loadingMessage.style.display = 'none';
            noUserDataMessage.style.display = 'block';
        }
    }

    async function fetchUserRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&direction=desc&per_page=5`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Search-App'
                }
            });
            
            if (response.status === 401) {
                throw new Error('GitHub API authentication required. Please try again later.');
            }
            if (response.status === 403) {
                throw new Error('Rate limit exceeded. Please try again in a few minutes.');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const repos = await response.json();

            if (repos.length === 0) {
                noReposMessage.style.display = 'block';
                return;
            }

            repos.forEach(repo => {
                const repoItem = document.createElement('div');
                repoItem.className = 'repo-item';
                repoItem.innerHTML = `
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <span>${repo.description || 'No description available.'}</span>
                `;
                reposListDiv.appendChild(repoItem);
            });

        } catch (error) {
            console.error('Error fetching user repositories:', error);
            noReposMessage.style.display = 'block';
        }
    }
});