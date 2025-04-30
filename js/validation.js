// Accessible form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('review-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
            
            // If form is valid, submit it (in a real app, this would be an AJAX call)
            if (form.checkValidity()) {
                event.preventDefault();
                alert('Thank you for your review! In a real app, this would be submitted to the server.');
                form.reset();
                form.classList.remove('was-validated');
            }
        });
        
        // Custom validation for star ratings
        const ratingInputs = document.querySelectorAll('.rating-input input');
        ratingInputs.forEach(input => {
            input.addEventListener('change', function() {
                const fieldset = this.closest('.rating-input');
                const feedback = fieldset.nextElementSibling;
                
                if (this.checked) {
                    feedback.style.display = 'none';
                    this.setAttribute('aria-invalid', 'false');
                }
            });
        });
    }
    
    // Live error announcements
    const invalidHandler = function(event) {
        const input = event.target;
        if (!input.validity.valid) {
            const errorMessage = input.validationMessage;
            const liveRegion = document.getElementById('live-error') || createLiveRegion();
            liveRegion.textContent = errorMessage;
            
            // For screen readers, we also want to associate the error with the field
            const errorId = input.id + '-error';
            let errorElement = document.getElementById(errorId);
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = errorId;
                errorElement.className = 'invalid-feedback';
                errorElement.textContent = errorMessage;
                input.parentNode.appendChild(errorElement);
            }
            
            input.setAttribute('aria-describedby', errorId);
            input.setAttribute('aria-invalid', 'true');
        }
    };
    
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('invalid', invalidHandler);
        input.addEventListener('blur', function() {
            if (!this.validity.valid) {
                invalidHandler({ target: this });
            }
        });
    });
});

function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-error';
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
    return liveRegion;
}