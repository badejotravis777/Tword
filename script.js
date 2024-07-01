let users = {};
let currentUser;
let randomNumber;
let attempts;
let pastMatches = {};

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem("users");
    if (userData) {
        users = JSON.parse(userData);
    }

    const pastMatchesData = localStorage.getItem("pastMatches");
    if (pastMatchesData) {
        pastMatches = JSON.parse(pastMatchesData);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("pastMatches", JSON.stringify(pastMatches));
}

// Initialize the game
function initializeGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById("input").value = "";
    document.getElementById("message").innerText = "";
    document.getElementById("submit-button").disabled = false;
    document.getElementById("reset-button").style.display = "none";
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("welcome-screen").classList.add("hidden");
}

// Check the user's guess
function checkGuess() {
    let guess = parseInt(document.getElementById("input").value);
    let message = "";

    if (isNaN(guess)) {
        message = "Please enter a valid number!";
    } else {
        attempts++;
        if (guess === randomNumber) {
            message = `Congratulations! You guessed the correct number in ${attempts} attempts.`;
            document.getElementById("submit-button").disabled = true;
            document.getElementById("reset-button").style.display = "block";
            saveMatch(currentUser, attempts);
        } else if (guess < randomNumber) {
            message = "Too low! Try again.";
        } else {
            message = "Too high! Try again.";
        }
    }

    document.getElementById("message").innerText = message;
}

// Save the match result
function saveMatch(username, attempts) {
    const timestamp = new Date().toISOString();
    if (!pastMatches[username]) {
        pastMatches[username] = [];
    }
    pastMatches[username].push({ timestamp, attempts });
    cleanUpOldMatches(username);
    saveUserData();
}

// Clean up matches older than 30 days
function cleanUpOldMatches(username) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    pastMatches[username] = pastMatches[username].filter(match => {
        return new Date(match.timestamp) > thirtyDaysAgo;
    });
}

// Display past matches
function showPastMatches() {
    const list = document.getElementById("past-matches-list");
    list.innerHTML = "";
    if (pastMatches[currentUser]) {
        pastMatches[currentUser].forEach(match => {
            const li = document.createElement("li");
            li.innerText = `Attempts: ${match.attempts} (Date: ${new Date(match.timestamp).toLocaleDateString()})`;
            list.appendChild(li);
        });
    }
    document.getElementById("past-matches").classList.remove("hidden");
}

// Handle user login
function login() {
    let input = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;
    let loginError = document.getElementById("login-error");
    
    // Retrieve user by username or email
    let user = Object.values(users).find(user => user.email === input || user.username === input);

    if (user && user.password === password) {
        currentUser = Object.keys(users).find(key => users[key] === user);
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("welcome-screen").classList.remove("hidden");
        loginError.innerText = "";
    } else {
        loginError.innerText = "Login failed: incorrect username/email or password.";
    }
}

// Handle user signup
function signup() {
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    let email = document.getElementById("signup-email").value;
    let signupError = document.getElementById("signup-error");

    if (!username.match(/^\w+ \w+$/) || !password.match(/^\d+$/) || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        signupError.innerText = "Sign up failed: invalid username, email, or password.";
        return;
    }

    if (users[username]) {
        signupError.innerText = "Sign up failed: username already exists.";
        return;
    }

    users[username] = { username, password, email };
    sendWelcomeEmail(email); // Send welcome email
    saveUserData(); // Save users to localStorage
    currentUser = username;
    document.getElementById("signup-screen").classList.add("hidden");
    document.getElementById("welcome-screen").classList.remove("hidden");
    signupError.innerText = "";
}

// Send welcome email (placeholder)
function sendWelcomeEmail(email) {
    console.log(`Sending welcome email to ${email}`); // Placeholder for actual email sending logic
    alert(`Welcome email sent to ${email}`); // Simulate email sending
}

// Initialize user data and set total users count
window.onload = function() {
    loadUserData();
    document.getElementById("total-users").innerText = Object.keys(users).length;
};

// Event Listeners
document.getElementById("submit-button").addEventListener("click", checkGuess);
document.getElementById("reset-button").addEventListener("click", initializeGame);
document.getElementById("start-button").addEventListener("click", initializeGame);
document.getElementById("quit-button").addEventListener("click", () => {
    currentUser = null;
    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
});
document.getElementById("login-button").addEventListener("click", login);
document.getElementById("signup-button").addEventListener("click", signup);
document.getElementById("show-records-button").addEventListener("click", showPastMatches);
document.getElementById("go-to-signup").addEventListener("click", () => {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("signup-screen").classList.remove("hidden");
});
document.getElementById("go-to-login").addEventListener("click", () => {
    document.getElementById("signup-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
});