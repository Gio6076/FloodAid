// Login Handler
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
}

// Display welcome message with username
function displayWelcomeMessage() {
    const username = localStorage.getItem('username');
    const welcomeDiv = document.getElementById('welcome-message');
    if (username && welcomeDiv) {
        welcomeDiv.innerHTML = `<p class="lead text-success"><i class="fas fa-user-check"></i> Welcome, ${username}!</p>`;
        welcomeDiv.style.display = 'block';
    }
}

// Call welcome message on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayWelcomeMessage);
} else {
    displayWelcomeMessage();
}

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Checklist Progress Bar Logic
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item');
    const checkedCount = document.querySelectorAll('.checklist-item:checked').length;
    const totalCount = checkboxes.length;
    const progressPercentage = (checkedCount / totalCount) * 100;
    
    document.getElementById('checked-count').textContent = checkedCount;
    document.getElementById('progress-bar').style.width = progressPercentage + '%';
    document.getElementById('progress-bar').setAttribute('aria-valuenow', checkedCount);
}

// Add event listeners to all checkboxes
document.querySelectorAll('.checklist-item').forEach(checkbox => {
    checkbox.addEventListener('change', updateChecklistProgress);
});

// Load saved checklist state from localStorage
function loadChecklistState() {
    document.querySelectorAll('.checklist-item').forEach(checkbox => {
        const saved = localStorage.getItem('checklist-' + checkbox.id);
        if (saved === 'true') {
            checkbox.checked = true;
        }
    });
    updateChecklistProgress();
}

// Save checklist state to localStorage
document.querySelectorAll('.checklist-item').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        localStorage.setItem('checklist-' + this.id, this.checked);
    });
});

// Load checklist on page load
loadChecklistState();

// During the Flood Checklist Progress Bar Logic
function updateDuringChecklistProgress() {
    const checkboxes = document.querySelectorAll('.during-checklist-item');
    const checkedCount = document.querySelectorAll('.during-checklist-item:checked').length;
    const totalCount = checkboxes.length;
    const progressPercentage = (checkedCount / totalCount) * 100;
    
    document.getElementById('during-checked-count').textContent = checkedCount;
    document.getElementById('during-progress-bar').style.width = progressPercentage + '%';
    document.getElementById('during-progress-bar').setAttribute('aria-valuenow', checkedCount);
}

// Add event listeners to all during-checklist checkboxes
document.querySelectorAll('.during-checklist-item').forEach(checkbox => {
    checkbox.addEventListener('change', updateDuringChecklistProgress);
});

// Load saved during-checklist state from localStorage
function loadDuringChecklistState() {
    document.querySelectorAll('.during-checklist-item').forEach(checkbox => {
        const saved = localStorage.getItem('during-checklist-' + checkbox.id);
        if (saved === 'true') {
            checkbox.checked = true;
        }
    });
    updateDuringChecklistProgress();
}

// Save during-checklist state to localStorage
document.querySelectorAll('.during-checklist-item').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        localStorage.setItem('during-checklist-' + this.id, this.checked);
    });
});

// Load during-checklist on page load
loadDuringChecklistState();

// Login/Logout Logic
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
    const loginLink = document.getElementById('login-link');
    const welcomeMessage = document.getElementById('welcome-message');

    if (loggedIn && username) {
        if (loginLink) loginLink.textContent = 'Logout';
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
            welcomeMessage.innerHTML = `<p class="text-success">Welcome back, ${username}!</p>`;
        }
    } else {
        if (loginLink) loginLink.textContent = 'Login';
        if (welcomeMessage) welcomeMessage.style.display = 'none';
    }
}

if (document.getElementById('login-link')) {
    document.getElementById('login-link').addEventListener('click', function(e) {
        if (localStorage.getItem('loggedIn')) {
            // Logout
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            location.reload(); // Refresh to update navbar
        } else {
            // Go to login page (default behavior)
        }
    });
}

if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username && password) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'index.html'; // Redirect to home
        } else {
            alert('Please enter both username and password.');
        }
    });
}

// Call on page load
checkLoginStatus();

// Weather API Integration
const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const city = 'New York'; // Default city; can be made dynamic
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        document.getElementById('weather').innerHTML = `
            <div class="card-body">
                <h5>${city}</h5>
                <p>Temperature: ${temp}°C</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        `;
    })
    .catch(error => {
        document.getElementById('weather').innerHTML = '<div class="card-body"><p>Error loading weather data.</p></div>';
    });

// Quiz Logic
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

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    loadQuestion();
}

function loadQuestion() {
    const q = questions[currentQuestion];
    const questionNumber = currentQuestion + 1;
    const totalQuestions = questions.length;
    
    document.getElementById('question-number').textContent = `Question ${questionNumber}/${totalQuestions}`;
    document.getElementById('question').innerHTML = `<h3 class="mb-4">${q.question}</h3>`;
    
    const optionsHTML = q.options.map((opt, i) => 
        `<button class="btn btn-outline-primary btn-lg w-100 mb-3 text-start" onclick="checkAnswer(${i})" style="padding: 15px; font-size: 1.1rem;">${opt}</button>`
    ).join('');
    
    document.getElementById('options').innerHTML = optionsHTML;
    
    // Update progress bar
    const progressPercentage = (currentQuestion / questions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = progressPercentage + '%';
}

function checkAnswer(selected) {
    if (selected === questions[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    document.getElementById('score').textContent = `${score}/${totalQuestions}`;
    document.getElementById('percentage').textContent = percentage + '%';
    
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
    
    document.getElementById('feedback').textContent = feedback;
    document.getElementById('feedback').className = feedbackClass;
    
    localStorage.setItem('floodQuizScore', score);
}