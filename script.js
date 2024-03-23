document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("container");
    const cards = container.querySelectorAll(".card");

    cards.forEach(function(card) {
        card.addEventListener("click", function(event) {
            event.preventDefault();
            const categoryName = card.getAttribute("data-category");
            window.location.href = `category.html?name=${categoryName}`;
        });
    });
});
