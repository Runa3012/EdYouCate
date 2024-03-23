document.addEventListener("DOMContentLoaded", function () {
    getCategoryData()
        .then(categoryData => {
            if (categoryData) {
                let words = [];
                const addWordsFromObject = (obj) => {
                    if (obj && obj.words) {
                        words = words.concat(obj.words);
                    }
                    if (obj && obj.categories) {
                        obj.categories.forEach(subCategory => addWordsFromObject(subCategory));
                    }
                    if (obj && obj.subcategories) {
                        obj.subcategories.forEach(subCategory => addWordsFromObject(subCategory));
                    }
                };
                addWordsFromObject(categoryData);

                const categoryNameElement = document.getElementById("category-name");
                const categoryImageElement = document.getElementById("category-image");
                const speakButton = document.getElementById("speak-button");
                const prevButton = document.getElementById("prev-button");
                const nextButton = document.getElementById("next-button");
                const wordDisplay = document.getElementById("word-display");

                let currentIndex = 0;

                categoryNameElement.textContent = categoryData.name;
                categoryImageElement.src = `pics_for_learning_english/${categoryData.image}`;
                wordDisplay.textContent = words[currentIndex];

                speakButton.addEventListener("click", function () {
                    speakText(words[currentIndex]);
                });

                prevButton.addEventListener("click", function () {
                    currentIndex = (currentIndex - 1 + words.length) % words.length;
                    wordDisplay.textContent = words[currentIndex];
                });

                nextButton.addEventListener("click", function () {
                    currentIndex = (currentIndex + 1) % words.length;
                    wordDisplay.textContent = words[currentIndex];
                });
            } else {
                console.error("Category data not found");
            }
        })
        .catch(error => {
            console.error("Error fetching category data:", error);
        });
});

async function getCategoryData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryNameParam = urlParams.get('category');
        
        if (!categoryNameParam) {
            console.error("Category name not found in URL");
            return null;
        }

        const categoryName = categoryNameParam.replace('.html', '');
        
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const category = data.categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) {
            console.error(`Category "${categoryName}" not found in data.json`);
        }
        return category;
    } catch (error) {
        console.error("Error fetching category data:", error);
        throw new Error("Failed to fetch category data");
    }
}

function speakText(text) {
    // Check if the SpeechSynthesis API is available in the browser
    if ('speechSynthesis' in window) {
        // Create a new SpeechSynthesisUtterance object with the text
        const utterance = new SpeechSynthesisUtterance(text);

        // Optionally, you can configure speech synthesis settings here
        // For example, setting the voice
        // utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');

        // Speak the text
        speechSynthesis.speak(utterance);
    } else {
        // Speech synthesis not supported
        alert('Speech synthesis not supported in this browser.');
    }
}
