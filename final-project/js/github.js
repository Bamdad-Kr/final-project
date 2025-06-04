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

        resultsDiv.innerHTML = '';
        noResultsMessage.style.display = 'none';
        errorFetchingMessage.style.display = 'none';

        try {
            const response = await fetch(`https://api.github.com/search/users?q=${username}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
            errorFetchingMessage.style.display = 'block';
        }
    }
});