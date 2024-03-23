let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start-button").addEventListener("click", startQuiz);
});

async function startQuiz() {
    const category = document.getElementById("category").value;
    await getQuestions(category);
    displayQuestion(currentQuestionIndex);
    document.getElementById("category-selection").style.display = "none";
    document.getElementById("quiz").style.display = "block";
}

async function getQuestions(category) {
    try {
        let url;
        if (category === "Random") {
            // Fetch questions from a random category
            url = 'random_questions.json';
        } else {
            url = category.toLowerCase() + '_questions.json';
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        questions = data.questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function displayQuestion(index) {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const currentQuestion = questions[index];
    questionElement.textContent = currentQuestion.question;

    // Clear previous options
    optionsElement.innerHTML = "";

    // Display options
    currentQuestion.options.forEach((option, i) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.textContent = option;
        optionElement.addEventListener("click", () => {
            checkAnswer(option, currentQuestion);
        });
        optionsElement.appendChild(optionElement);
    });
}

function checkAnswer(selectedOption, question) {
    if (selectedOption === question.answer) {
        correctAnswers++;
    }
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    } else {
        showResult();
    }
}

function showResult() {
    const resultElement = document.getElementById("result");
    resultElement.textContent = `You got ${correctAnswers} out of ${questions.length} questions correct!`;
}
