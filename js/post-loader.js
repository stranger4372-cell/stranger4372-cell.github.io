// post-loader.js
document.addEventListener('DOMContentLoaded', () => {
    // Only run on the post page
    if (!document.getElementById('post-body')) return;
    
    // URL에서 파일명 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');
    
    if (!fileName) {
        document.getElementById('post-body').innerHTML = '<p>잘못된 접근입니다. 게시글이 지정되지 않았습니다.</p>';
        document.title = 'Error - My Tech Blog';
        return;
    }
    
    loadPost(fileName);
});

async function loadPost(fileName) {
    try {
        const response = await fetch(`./pages/${fileName}`);
        
        if (!response.ok) {
            throw new Error(`게시글을 찾을 수 없습니다. (${response.status})`);
        }
        
        let content = await response.text();
        
        // UTF-8 BOM 제거
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        
        // Front Matter 파싱
        const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        let metadata = {};
        let postContent = content;
        
        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            postContent = frontMatterMatch[2];
            
            // 간단한 Front Matter 파서
            const lines = frontMatter.split(/\r?\n/);
            lines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    // 따옴표 제거
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    
                    // 배열 파싱 (간단한 형태만 지원)
                    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                        try {
                            value = JSON.parse(value);
                        } catch {
                            value = value.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
                        }
                    }
                    
                    metadata[key] = value;
                }
            });
        }
        
        // 메타데이터 렌더링
        const title = metadata.title || fileName.replace('.md', '');
        document.getElementById('post-title').textContent = title;
        document.title = `${title} - My Tech Blog`;
        
        if (metadata.date) {
            document.getElementById('post-date').textContent = metadata.date;
        }
        
        if (metadata.tags && Array.isArray(metadata.tags)) {
            const tagsContainer = document.getElementById('post-tags');
            tagsContainer.innerHTML = metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }
        
        // 마크다운을 HTML로 변환
        if (typeof marked !== 'undefined') {
            document.getElementById('post-body').innerHTML = marked.parse(postContent);
            
            // 코드 하이라이팅 적용
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
        } else {
            // marked.js가 로드되지 않은 경우 fallback
            document.getElementById('post-body').innerHTML = `<pre>${postContent}</pre>`;
        }
        
        // Giscus 댓글 로드
        loadGiscus();
        
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-body').innerHTML = `<p>게시글을 불러오는데 실패했습니다: ${error.message}</p>`;
    }
}

function loadGiscus() {
    const giscusContainer = document.querySelector('.giscus');
    if (!giscusContainer) return;
    
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    
    // Giscus 설정 - 사용자 정보로 업데이트 필요
    script.setAttribute('data-repo', 'stranger4372-cell/stranger4372-cell.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    
    // 현재 테마에 맞게 Giscus 테마 설정
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    script.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : 'light');
    
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    giscusContainer.appendChild(script);
}
