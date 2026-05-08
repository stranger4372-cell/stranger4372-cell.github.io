// app.js
let appPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    // Only run on the index page
    if (!document.getElementById('posts-container')) return;
    
    fetchPosts();
});

async function fetchPosts() {
    try {
        // 배포 환경과 로컬 환경 모두에서 작동하도록 루트 기준 경로 사용
        const response = await fetch('./posts.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        appPosts = await response.json();
        
        // Initialize search functionality from search.js
        if (typeof initSearch === 'function') {
            initSearch(appPosts);
        }
        
        renderTags(appPosts);
        renderPostsList(appPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        document.getElementById('posts-container').innerHTML = 
            `<p>게시글을 불러오는데 실패했습니다. 빌드가 완료되었는지 확인해주세요. (${error.message})</p>`;
    }
}

function renderTags(posts) {
    const tagsContainer = document.getElementById('tags-container');
    if (!tagsContainer) return;
    
    // Extract unique tags and count them
    const tagCounts = {};
    posts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    // Sort tags by count
    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
    
    tagsContainer.innerHTML = '';
    
    sortedTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => {
            if (typeof setActiveTag === 'function') {
                setActiveTag(tag);
            }
        });
        tagsContainer.appendChild(tagElement);
    });
}

// Global function to be called by search.js
window.renderPostsList = function(postsToRender) {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (postsToRender.length === 0) {
        container.innerHTML = '<p>조건에 맞는 게시글이 없습니다.</p>';
        return;
    }
    
    postsToRender.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post-card';
        
        const tagsHtml = post.tags && post.tags.length > 0
            ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
            : '';
            
        article.innerHTML = `
            <h2 class="post-card-title"><a href="post.html?file=${post.file}">${post.title}</a></h2>
            <div class="post-card-meta">
                <span class="date">${post.date}</span>
                ${post.category ? `<span class="category">${post.category}</span>` : ''}
            </div>
            <p class="post-card-excerpt">${post.excerpt}</p>
            ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
        `;
        
        container.appendChild(article);
    });
};
