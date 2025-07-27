document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('github-username-input');
    const searchButton = document.getElementById('search-github-btn');
    const resultsDiv = document.getElementById('github-users-results');
    const noResultsMessage = document.getElementById('no-results-message');
    const errorFetchingMessage = document.getElementById('error-fetching-message');

    searchButton.addEventListener('click', searchGithubUsers);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchGithubUsers();
        }
    });

    async function searchGithubUsers() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a username.');
            return;
        }

        // Show loading state
        searchButton.textContent = 'Loading...';
        searchButton.disabled = true;
        resultsDiv.innerHTML = '';
        noResultsMessage.style.display = 'none';
        errorFetchingMessage.style.display = 'none';

        try {
            const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(username)}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GitHub-Search-App'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('GitHub API authentication required. Please try again later.');
                } else if (response.status === 403) {
                    throw new Error('Rate limit exceeded. Please try again in a few minutes.');
                } else if (response.status === 404) {
                    throw new Error('GitHub API endpoint not found.');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            
            const data = await response.json();

            if (data.items.length === 0) {
                noResultsMessage.style.display = 'block';
                return;
            }

            data.items.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login} Avatar">
                    <div class="user-info">
                        <h3>${user.login}</h3>
                        <p>ID: ${user.id}</p>
                        <a href="${user.html_url}" target="_blank">View on GitHub</a>
                    </div>
                    <div class="user-actions">
                        <button class="more-info-btn" data-username="${user.login}">More</button>
                    </div>
                `;
                resultsDiv.appendChild(userCard);
            });

            document.querySelectorAll('.more-info-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const selectedUsername = e.target.dataset.username;
                    window.location.href = `single-user.html?username=${selectedUsername}`;
                });
            });

        } catch (error) {
            console.error('Error fetching GitHub users:', error);
            errorFetchingMessage.textContent = error.message || 'Error fetching GitHub users. Please try again.';
            errorFetchingMessage.style.display = 'block';
        } finally {
            // Reset button state
            searchButton.textContent = 'Submit';
            searchButton.disabled = false;
        }
    }
});