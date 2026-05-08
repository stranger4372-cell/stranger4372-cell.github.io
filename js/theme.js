// theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // If there's a saved theme, apply it
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        // Check OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Toggle icons
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        
        // Update Giscus theme if on post page
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
            iframe.contentWindow.postMessage({
                giscus: {
                    setConfig: {
                        theme: newTheme === 'dark' ? 'dark' : 'light'
                    }
                }
            }, 'https://giscus.app');
        }
    });
});
