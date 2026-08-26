
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const itemPage = item.getAttribute('href').split('/').pop();
        if (itemPage === currentPage) {
            item.style.color = 'var(--accent)';
        }
    });

    // Form Submissions intercept
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const inputs = form.querySelectorAll('input, textarea');
            const submitBtn = form.querySelector('button');
            
            let url = '';
            let payload = {};
            
            if (currentPage === 'contact.html') {
                url = '/api/contact';
                payload = {
                    name: inputs[0].value,
                    email: inputs[1].value,
                    message: inputs[2].value
                };
            } else if (currentPage === 'login.html') {
                url = '/api/login';
                payload = {
                    identifier: inputs[0].value,
                    password: inputs[1].value
                };
            } else if (currentPage === 'membership.html') {
                url = '/api/membership';
                payload = {
                    name: inputs[0].value,
                    service_no: inputs[1].value,
                    rank: inputs[2].value,
                    email: inputs[3].value
                };
            }
            
            if (url) {
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Submitting...';
                submitBtn.disabled = true;
                
                // When hosted on GitHub Pages, point to your backend deployed somewhere (e.g. Render, Heroku)
                // For now, it points to a placeholder. Replace 'YOUR_BACKEND_URL_HERE' with your actual deployed backend URL.
                const isGitHub = window.location.hostname.includes('github.io');
                const backendUrl = isGitHub ? 'https://YOUR_BACKEND_URL_HERE.onrender.com' : '';
                const fullUrl = backendUrl + url;
                
                try {
                    const response = await fetch(fullUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (response.ok) {
                        alert('Submitted successfully!');
                        form.reset();
                    } else {
                        alert('Failed to submit. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error submitting form. Make sure the backend server is running.');
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }

});
