// 요소 선택
const regexInput = document.getElementById('regex');
const textArea = document.getElementById('text');
const highlightLayer = document.getElementById('highlightLayer');
const errorDiv = document.getElementById('error');
const flagButtons = document.querySelectorAll('.flag-btn');

// 스크롤 동기화
textArea.addEventListener('scroll', () => {
    highlightLayer.scrollTop = textArea.scrollTop;
});

// 정규표현식 적용 함수
function applyRegex() {
    const regexStr = regexInput.value;
    const text = textArea.value;
    
    // 활성화된 플래그 가져오기
    const flags = Array.from(flagButtons)
        .filter(btn => btn.classList.contains('active'))
        .map(btn => btn.dataset.flag)
        .join('');

    // HTML 이스케이프 함수
    const escapeHtml = (str) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    try {
        if (!regexStr) {
            highlightLayer.innerHTML = escapeHtml(text);
            errorDiv.textContent = '';
            return;
        }

        const regex = new RegExp(regexStr, flags);
        
        // 매칭 결과 하이라이팅
        let result = escapeHtml(text);
        result = result.replace(regex, match => 
            `<span class="highlight">${escapeHtml(match)}</span>`
        );
        
        highlightLayer.innerHTML = result;
        errorDiv.textContent = '';
    } catch (e) {
        errorDiv.textContent = '유효하지 않은 정규표현식입니다';
        highlightLayer.innerHTML = escapeHtml(text);
    }
}

// 이벤트 리스너 등록
regexInput.addEventListener('input', applyRegex);
textArea.addEventListener('input', applyRegex);

// 플래그 버튼 이벤트 리스너
flagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        applyRegex();
    });
});

// textarea 크기 변경 시 하이라이트 레이어도 조정
new ResizeObserver(() => {
    highlightLayer.style.width = `${textArea.clientWidth - 16}px`; // padding 고려
    highlightLayer.style.height = `${textArea.clientHeight - 16}px`; // padding 고려
}).observe(textArea);

// 초기 실행
applyRegex();