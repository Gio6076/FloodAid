// Ensure globally accessible handlers for inline events
window.handleLogin = function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    if (!usernameInput) return;
    const username = usernameInput.value.trim();
    if (!username) {
        alert('Please enter a username.');
        return;
    }
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
};

(function () {
    const CHECKLIST_KEY_PREFIX = 'flood-checklist-';
    const STORIES_STORAGE_KEY = 'flood-stories';

    function getAuthInfo() {
        const loggedIn = localStorage.getItem('loggedIn');
        const username = localStorage.getItem('username');
        return {
            loggedIn: Boolean(loggedIn && username),
            username: username || ''
        };
    }

    const questions = [
        {
            question: "What should you do first during a flood?",
            options: ["Move to higher ground", "Call friends", "Turn on lights", "Drive through water"],
            answer: 0
        },
        {
            question: "Which item is essential in an emergency kit?",
            options: ["Extra clothes", "Water and food", "Books", "Candles"],
            answer: 1
        },
        {
            question: "What should you avoid during a flood?",
            options: ["Boiling water", "Using electrical appliances in water", "Elevating valuables", "Preparing a plan"],
            answer: 1
        },
        {
            question: "How can you stay informed about floods?",
            options: ["Ignore news", "Check weather apps", "Sleep", "Go outside"],
            answer: 1
        },
        {
            question: "After a flood, what should you do with contaminated water?",
            options: ["Drink it", "Boil it first", "Throw it away", "Ignore it"],
            answer: 1
        },
        {
            question: "How much water should you store per person per day for emergency preparedness?",
            options: ["1/2 gallon", "1 gallon", "2 gallons", "5 gallons"],
            answer: 1
        },
        {
            question: "What is the safest action if you're caught in floodwaters in a car?",
            options: ["Drive faster through the water", "Abandon the car and swim", "Stay in the car and call for help", "Turn on the headlights"],
            answer: 2
        },
        {
            question: "When preparing your home before a flood, where should you elevate your appliances?",
            options: ["In the attic", "Above ground level", "In the basement", "On the first floor"],
            answer: 1
        },
        {
            question: "What type of documents should you keep in waterproof storage?",
            options: ["Junk mail", "Receipts", "Insurance and property documents", "Newspapers"],
            answer: 2
        },
        {
            question: "What should you do with electrical equipment that has been in contact with flood water?",
            options: ["Dry it immediately and use it", "Do not touch or use it", "Clean it with soap and water", "Store it in a humid place"],
            answer: 1
        },
        {
            question: "How long should non-perishable food last in your emergency kit?",
            options: ["At least 3 days", "At least 1 week", "At least 2 weeks", "At least 1 month"],
            answer: 2
        },
        {
            question: "During a flood evacuation, what is the best escape route?",
            options: ["Any main road", "Pre-planned evacuation routes", "Flooded roads if shorter", "Through water bodies"],
            answer: 1
        },
        {
            question: "What should you do if you discover mold after a flood?",
            options: ["Ignore it", "Use protective gear and clean with bleach solution", "Leave the area immediately", "Paint over it"],
            answer: 1
        },
        {
            question: "Before a flood occurs, what should your family establish?",
            options: ["A vacation plan", "A communication plan and meeting point", "A shopping list", "Nothing is necessary"],
            answer: 1
        },
        {
            question: "What is the safest place to be during a flood?",
            options: ["Basement", "Ground floor", "Higher ground or upper floors", "Outside observing the water"],
            answer: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function displayWelcomeMessage() {
        const welcomeDiv = document.getElementById('welcome-message');
        if (!welcomeDiv) return;
        const username = localStorage.getItem('username');
        if (!username) {
            welcomeDiv.style.display = 'none';
            welcomeDiv.innerHTML = '';
            return;
        }
        welcomeDiv.innerHTML = `<p class="lead text-success"><i class="fas fa-user-check"></i> Welcome, ${username}!</p>`;
        welcomeDiv.style.display = 'block';
    }

    function highlightActiveNav() {
        const page = document.body.dataset.page;
        if (!page) return;
        const activeLink = document.querySelector(`.navbar-nav .nav-link[data-nav="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function initLoginLink() {
        const loginLink = document.getElementById('login-link');
        if (!loginLink) return;

        const loggedIn = localStorage.getItem('loggedIn');
        const username = localStorage.getItem('username');

        loginLink.textContent = loggedIn && username ? 'Logout' : 'Login';

        loginLink.addEventListener('click', (event) => {
            const isLoggedIn = localStorage.getItem('loggedIn');
            if (isLoggedIn) {
                event.preventDefault();
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
                window.location.href = 'index.html';
            }
        });
    }

    function initLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value.trim();

            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'index.html';
        });
    }

    function initChecklist({ itemSelector, countId, barId, storageSuffix }) {
        const items = document.querySelectorAll(itemSelector);
        const countEl = document.getElementById(countId);
        const barEl = document.getElementById(barId);

        if (!items.length || !countEl || !barEl) return;

        function updateProgress() {
            const checkedCount = document.querySelectorAll(`${itemSelector}:checked`).length;
            const totalCount = items.length;
            const progressPercentage = totalCount === 0 ? 0 : (checkedCount / totalCount) * 100;

            countEl.textContent = checkedCount;
            barEl.style.width = `${progressPercentage}%`;
            barEl.setAttribute('aria-valuenow', checkedCount);
        }

        items.forEach(item => {
            const storageKey = `${CHECKLIST_KEY_PREFIX}${storageSuffix}-${item.id}`;
            const savedValue = localStorage.getItem(storageKey);
            if (savedValue === 'true') {
                item.checked = true;
            }

            item.addEventListener('change', () => {
                localStorage.setItem(storageKey, item.checked);
                updateProgress();
            });
        });

        updateProgress();
    }

    function initQuiz() {
        const startScreen = document.getElementById('quiz-start');
        const quizContainer = document.getElementById('quiz-container');
        const resultContainer = document.getElementById('result');
        const startButton = document.getElementById('start-quiz-btn');
        const loginNotice = document.getElementById('quiz-login-notice');

        if (!startScreen || !quizContainer || !resultContainer) return;

        function updateStartState() {
            const auth = getAuthInfo();
            if (startButton) {
                startButton.disabled = !auth.loggedIn;
                startButton.classList.toggle('disabled', !auth.loggedIn);
            }
            if (loginNotice) {
                loginNotice.style.display = auth.loggedIn ? 'none' : 'block';
            }
        }

        function loadQuestion() {
            const q = questions[currentQuestion];
            const questionNumber = currentQuestion + 1;
            const totalQuestions = questions.length;

            const questionNumberEl = document.getElementById('question-number');
            const questionEl = document.getElementById('question');
            const optionsEl = document.getElementById('options');
            const progressBar = document.getElementById('quiz-progress-bar');
            const scoreDisplay = document.getElementById('score-display');

            if (!questionNumberEl || !questionEl || !optionsEl || !progressBar) {
                return;
            }

            questionNumberEl.textContent = `Question ${questionNumber}/${totalQuestions}`;
            questionEl.innerHTML = `<h3 class="mb-4">${q.question}</h3>`;

            optionsEl.innerHTML = q.options.map((opt, i) =>
                `<button class="btn btn-outline-primary btn-lg w-100 mb-3 text-start quiz-option" data-answer="${i}" style="padding: 15px; font-size: 1.1rem;">${opt}</button>`
            ).join('');

            const progressPercentage = (currentQuestion / totalQuestions) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            if (scoreDisplay) {
                scoreDisplay.textContent = `Score: ${score}`;
            }

            document.querySelectorAll('.quiz-option').forEach(button => {
                button.addEventListener('click', () => {
                    const selected = Number(button.getAttribute('data-answer'));
                    if (selected === questions[currentQuestion].answer) {
                        score++;
                    }
                    currentQuestion++;
                    if (currentQuestion < questions.length) {
                        loadQuestion();
                    } else {
                        showResult();
                    }
                });
            });
        }

        function showResult() {
            quizContainer.style.display = 'none';
            resultContainer.style.display = 'block';

            const totalQuestions = questions.length;
            const percentage = Math.round((score / totalQuestions) * 100);

            const scoreEl = document.getElementById('score');
            const percentageEl = document.getElementById('percentage');
            const feedbackEl = document.getElementById('feedback');

            if (scoreEl) scoreEl.textContent = `${score}/${totalQuestions}`;
            if (percentageEl) percentageEl.textContent = `${percentage}%`;

            let feedback = '';
            let feedbackClass = '';

            if (percentage === 100) {
                feedback = "Perfect! You're a flood safety expert!";
                feedbackClass = 'text-success';
            } else if (percentage >= 80) {
                feedback = "Excellent! You're very well-prepared for flood safety.";
                feedbackClass = 'text-success';
            } else if (percentage >= 60) {
                feedback = "Good! You have solid flood safety knowledge. Review the tips to improve.";
                feedbackClass = 'text-info';
            } else if (percentage >= 40) {
                feedback = "You're on the right track. Review the before, during, and after sections to strengthen your knowledge.";
                feedbackClass = 'text-warning';
            } else {
                feedback = "Keep learning! Review all the flood safety sections on this website to better prepare yourself.";
                feedbackClass = 'text-danger';
            }

            if (feedbackEl) {
                feedbackEl.textContent = feedback;
                feedbackEl.className = feedbackClass;
            }

            localStorage.setItem('floodQuizScore', score);
        }

        window.startQuiz = function startQuiz() {
            const auth = getAuthInfo();
            if (!auth.loggedIn) {
                alert('Please log in to take the quiz.');
                updateStartState();
                return;
            }
            currentQuestion = 0;
            score = 0;
            startScreen.style.display = 'none';
            quizContainer.style.display = 'block';
            resultContainer.style.display = 'none';
            loadQuestion();
        };

        window.retryQuiz = function retryQuiz() {
            window.startQuiz();
        };

        updateStartState();
        window.addEventListener('storage', updateStartState);
    }

    function initStories() {
        const storyForm = document.getElementById('story-form');
        const storiesList = document.getElementById('stories-list');
        const usernameDisplay = document.getElementById('story-username-display');
        const loginNotice = document.getElementById('story-login-notice');

        if (!storyForm || !storiesList) return;

        function renderStories(stories) {
            if (!stories.length) {
                storiesList.innerHTML = '<p class="text-muted text-center">No stories shared yet. Be the first to share your experience.</p>';
                return;
            }

            storiesList.innerHTML = stories.map(story => `
                <div class="story-card">
                    <h5>${story.name || 'Community Member'}</h5>
                    <small><i class="fas fa-map-marker-alt"></i> ${story.location}</small>
                    <p class="mt-3 mb-0">${story.story}</p>
                </div>
            `).join('');
        }

        function toggleFormState(loggedIn, username) {
            if (usernameDisplay) {
                usernameDisplay.textContent = loggedIn && username ? username : 'Guest';
            }

            const controls = storyForm.querySelectorAll('input, textarea, button');
            controls.forEach(control => {
                control.disabled = !loggedIn || !username;
            });

            if (loginNotice) {
                loginNotice.style.display = (!loggedIn || !username) ? 'block' : 'none';
            }
        }

        const authInfo = getAuthInfo();
        toggleFormState(authInfo.loggedIn, authInfo.username);

        function loadStories() {
            try {
                const storedStories = localStorage.getItem(STORIES_STORAGE_KEY);
                const stories = storedStories ? JSON.parse(storedStories) : [];
                renderStories(stories);
            } catch (error) {
                console.error('Failed to parse stories from storage', error);
                renderStories([]);
            }
        }

        storyForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const { loggedIn, username } = getAuthInfo();
            if (!loggedIn || !username) {
                alert('Please log in to share your story.');
                toggleFormState(false, '');
                return;
            }
            const location = document.getElementById('story-location')?.value.trim();
            const storyText = document.getElementById('story-text')?.value.trim();

            if (!location || !storyText) {
                alert('Please complete all fields before submitting your story.');
                return;
            }

            const newStory = {
                name: username,
                location,
                story: storyText,
                submittedAt: new Date().toISOString()
            };

            const storedStories = localStorage.getItem(STORIES_STORAGE_KEY);
            const stories = storedStories ? JSON.parse(storedStories) : [];
            stories.unshift(newStory);

            localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
            renderStories(stories);
            storyForm.reset();
        });

        window.addEventListener('storage', () => {
            const updatedAuth = getAuthInfo();
            toggleFormState(updatedAuth.loggedIn, updatedAuth.username);
        });

        loadStories();
    }

    function initWeather() {
        const weatherCard = document.getElementById('weather');
        if (!weatherCard) return;

        const apiKey = 'YOUR_API_KEY';
        const city = weatherCard.dataset.city || 'New York';
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (!data || !data.main) throw new Error('Invalid weather response');
                const temp = data.main.temp;
                const humidity = data.main.humidity;
                weatherCard.innerHTML = `
                    <div class="card-body">
                        <h5>${city}</h5>
                        <p>Temperature: ${temp}°C</p>
                        <p>Humidity: ${humidity}%</p>
                    </div>
                `;
            })
            .catch(() => {
                weatherCard.innerHTML = '<div class="card-body"><p>Error loading weather data.</p></div>';
            });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initSmoothScroll();
        displayWelcomeMessage();
        highlightActiveNav();
        initLoginLink();
        initLoginForm();
        initChecklist({
            itemSelector: '.checklist-item',
            countId: 'checked-count',
            barId: 'progress-bar',
            storageSuffix: 'before'
        });
        initChecklist({
            itemSelector: '.during-checklist-item',
            countId: 'during-checked-count',
            barId: 'during-progress-bar',
            storageSuffix: 'during'
        });
        initQuiz();
        initStories();
        initWeather();
    });

})();
