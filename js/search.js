// search.js
let searchPosts = [];
let activeTag = null;

// Initialize search functionality
function initSearch(posts) {
    searchPosts = posts;
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterAndRenderPosts(e.target.value, activeTag);
        });
    }
}

// Set active tag and filter
function setActiveTag(tag) {
    activeTag = activeTag === tag ? null : tag; // Toggle tag
    
    // Update UI
    const tagElements = document.querySelectorAll('.filter-container .tag');
    tagElements.forEach(el => {
        if (el.textContent === tag && activeTag === tag) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value : '';
    
    filterAndRenderPosts(query, activeTag);
}

// Filter posts based on search query and active tag
function filterAndRenderPosts(query, tag) {
    const lowercaseQuery = query.toLowerCase();
    
    const filtered = searchPosts.filter(post => {
        const matchesQuery = !query || 
                             post.title.toLowerCase().includes(lowercaseQuery) || 
                             post.excerpt.toLowerCase().includes(lowercaseQuery);
                             
        const matchesTag = !tag || (post.tags && post.tags.includes(tag));
        
        return matchesQuery && matchesTag;
    });
    
    // This function must be defined in app.js
    if (typeof renderPostsList === 'function') {
        renderPostsList(filtered);
    }
}
