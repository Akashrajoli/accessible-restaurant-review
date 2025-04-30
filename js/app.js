// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Load restaurant data
    loadRestaurants();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize accessibility controls
    initAccessibility();
});

function loadRestaurants() {
    // In a real app, this would come from an API
    const restaurants = [
        {
            id: 1,
            name: "The Accessible Bistro",
            rating: 4.5,
            reviewCount: 42,
            type: "French",
            image: "images/restaurant1.jpg",
            accessibilityFeatures: ["Wheelchair access", "Braille menu", "Quiet area"]
        },
        {
            id: 2,
            name: "Inclusive Eats",
            rating: 4.2,
            reviewCount: 28,
            type: "International",
            image: "images/restaurant2.jpg",
            accessibilityFeatures: ["Sign language staff", "Audio menu", "Wheelchair access"]
        },
        {
            id: 3,
            name: "Universal Grill",
            rating: 3.9,
            reviewCount: 35,
            type: "American",
            image: "images/restaurant3.jpg",
            accessibilityFeatures: ["Wheelchair access", "Allergy-friendly"]
        }
    ];
    
    const restaurantList = document.getElementById('restaurant-list');
    
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'col';
        card.innerHTML = `
            <div class="card h-100 restaurant-card">
                <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h3 class="card-title h5">${restaurant.name}</h3>
                    <p class="card-text">${restaurant.type}</p>
                    <div class="rating-container" role="img" aria-label="Rating: ${restaurant.rating} out of 5 stars">
                        <div class="rating-stars" aria-hidden="true">
                            ${renderStars(restaurant.rating)}
                        </div>
                        <span class="ms-2">(${restaurant.reviewCount} reviews)</span>
                    </div>
                    <ul class="list-unstyled mt-2">
                        ${restaurant.accessibilityFeatures.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="restaurant.html?id=${restaurant.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `;
        restaurantList.appendChild(card);
    });
}

function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<span class="star filled">★</span>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<span class="star half">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    
    return stars;
}

function setupEventListeners() {
    // Write review button
    const writeReviewBtn = document.getElementById('write-review');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
            window.location.href = 'review.html';
        });
    }
    
    // Play audio buttons
    document.querySelectorAll('.play-audio').forEach(button => {
        button.addEventListener('click', function() {
            const reviewText = this.parentElement.querySelector('p').textContent;
            speakReview(reviewText);
        });
    });
}

function initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
    
    // Accessibility controls
    const accessibilityControls = document.createElement('div');
    accessibilityControls.className = 'accessibility-controls';
    accessibilityControls.innerHTML = `
        <div class="btn-group" role="group" aria-label="Accessibility controls">
            <button type="button" class="btn btn-sm btn-outline-secondary" id="text-increase">A+</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="text-reset">A</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="text-decrease">A-</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="contrast-toggle">High Contrast</button>
        </div>
    `;
    document.body.appendChild(accessibilityControls);
    
    // Text size controls
    document.getElementById('text-increase').addEventListener('click', increaseTextSize);
    document.getElementById('text-reset').addEventListener('click', resetTextSize);
    document.getElementById('text-decrease').addEventListener('click', decreaseTextSize);
    document.getElementById('contrast-toggle').addEventListener('click', toggleContrast);
}

function increaseTextSize() {
    document.documentElement.style.fontSize = '1.25rem';
}

function decreaseTextSize() {
    document.documentElement.style.fontSize = '0.875rem';
}

function resetTextSize() {
    document.documentElement.style.fontSize = '1rem';
}

function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const button = document.getElementById('contrast-toggle');
    if (document.body.classList.contains('high-contrast')) {
        button.textContent = 'Default Contrast';
    } else {
        button.textContent = 'High Contrast';
    }
}

function speakReview(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser');
    }
}