document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor Glow Effect
    const cursor = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // 3. Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // 4. Resume Parser Engine
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resumeInput = document.getElementById('resumeInput');
    const resultsDisplay = document.getElementById('results-display');
    const jsonOutput = document.getElementById('json-output');

    // Dashboard Elements
    const scoreVal = document.getElementById('score-val');
    const scoreBar = document.getElementById('score-bar');
    const completeVal = document.getElementById('complete-val');
    const completeBar = document.getElementById('complete-bar');
    const confVal = document.getElementById('conf-val');
    const confBadge = document.getElementById('conf-badge');

    // EXPLICIT LOAD SAMPLE FUNCTION
    window.loadSample = function() {
        const input = document.getElementById('resumeInput');
        if (input) {
            input.value = `Abhishek Singh
Email: abhishek_singh25@mru.ac.in
Phone: 9876543210
LinkedIn: https://linkedin.com/in/abhishek-singh
GitHub: https://github.com/abhishek-singh

Skills: HTML, CSS, JavaScript, Python, C, AI & ML basics

Education: B.Tech in Computer Science (AI & ML), 
Manav Rachna University, Faridabad, 2025–2029

Experience: Currently learning full-stack development and AI/ML concepts. Built a Resume Parser web app and a Library Management System project.`;
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Auto-fill on Page Load
    loadSample();

    analyzeBtn.addEventListener('click', () => {
        const text = resumeInput.value.trim();
        if (!text) {
            alert('Please paste some resume text first!');
            return;
        }

        analyzeBtn.innerHTML = 'Analyzing... <i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate processing time
        setTimeout(() => {
            const parsedData = parseResume(text);
            updateUI(parsedData);
            analyzeBtn.innerHTML = 'Analyze Resume <i class="fas fa-wand-magic-sparkles"></i>';
        }, 800);
    });

    clearBtn.addEventListener('click', () => {
        resumeInput.value = '';
        resultsDisplay.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No results yet. Paste a resume and click analyze.</p>
            </div>
        `;
        jsonOutput.textContent = '{ "status": "waiting" }';
        resetDashboard();
    });

    function parseResume(text) {
        const patterns = {
            name: /[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
            phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
            linkedin: /(?:linkedin\.com\/in\/|https?:\/\/(?:www\.)?linkedin\.com\/in\/)[a-zA-Z0-9-]+\/?/,
            github: /(?:github\.com\/|https?:\/\/(?:www\.)?github\.com\/)[a-zA-Z0-9-]+\/?/,
            skills: /(?:Skills|SKILLS|Technical Skills|Competencies):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
            education: /(?:Education|EDUCATION|Academic Profile):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
            experience: /(?:Experience|EXPERIENCE|Work Experience):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i
        };

        const data = {};
        for (let key in patterns) {
            const match = text.match(patterns[key]);
            if (match) {
                if (key === 'skills') {
                    let rawSkills = match[1].split(/[,|\n]/).map(s => s.trim().replace(/^[-•]\s*/, '')).filter(s => s.length > 0);
                    const allowedSkills = ['html', 'css', 'javascript', 'python', 'c language', 'c', 'ai & ml basics', 'git'];
                    const filtered = [];
                    rawSkills.forEach(rs => {
                        const low = rs.toLowerCase();
                        if (allowedSkills.some(as => low.includes(as))) {
                            filtered.push(rs);
                        }
                    });
                    data[key] = filtered.length > 0 ? [...new Set(filtered)] : rawSkills;
                } else if (key === 'education' || key === 'experience') {
                    const lines = match[1].split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(s => s.length > 0);
                    data[key] = lines.join(' ');
                } else {
                    data[key] = match[0].trim();
                }
            } else {
                data[key] = null;
            }
        }

        return data;
    }

    function updateUI(data) {
        let filledFields = 0;
        const totalFields = Object.keys(data).length;
        for (let key in data) if (data[key]) filledFields++;

        const completeness = Math.round((filledFields / totalFields) * 100);
        const score = Math.min(100, (filledFields * 10) + (data.skills?.length || 0) * 2);
        
        scoreVal.innerHTML = `${score}<span>/100</span>`;
        scoreBar.style.width = `${score}%`;
        completeVal.innerHTML = `${completeness}<span>%</span>`;
        completeBar.style.width = `${completeness}%`;

        if (completeness > 80) {
            confVal.innerText = 'High';
            confBadge.innerText = 'Optimized';
            confBadge.className = 'badge high';
        } else if (completeness > 50) {
            confVal.innerText = 'Medium';
            confBadge.innerText = 'Good';
            confBadge.className = 'badge medium';
        } else {
            confVal.innerText = 'Low';
            confBadge.innerText = 'Needs Work';
            confBadge.className = 'badge low';
        }

        resultsDisplay.innerHTML = '';
        
        const cardMap = [
            { key: 'name', label: 'Full Name', icon: 'user' },
            { key: 'email', label: 'Email Address', icon: 'envelope' },
            { key: 'phone', label: 'Phone Number', icon: 'phone' },
            { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin-in' },
            { key: 'github', label: 'GitHub', icon: 'github' },
            { key: 'education', label: 'Education', icon: 'graduation-cap', isList: true },
            { key: 'skills', label: 'Skills Identified', icon: 'toolbox', isList: true },
            { key: 'experience', label: 'Experience Highlights', icon: 'briefcase', isList: true }
        ];

        cardMap.forEach(item => {
            if (data[item.key]) {
                const card = document.createElement('div');
                card.className = 'result-card animated';
                
                let contentHtml = '';
                if (item.isList && Array.isArray(data[item.key])) {
                    contentHtml = `<div class="tag-cloud">${data[item.key].map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
                } else {
                    let val = data[item.key];
                    if (item.key === 'email') {
                        val = `<a href="mailto:${val}" class="result-link">${val}</a>`;
                    } else if (item.key === 'linkedin' || item.key === 'github') {
                        const url = val.startsWith('http') ? val : `https://${val}`;
                        val = `<a href="${url}" target="_blank" class="result-link">${val}</a>`;
                    }
                    contentHtml = `<span class="val">${val}</span>`;
                }

                card.innerHTML = `
                    <h4><i class="fas fa-${item.icon}"></i> ${item.label}</h4>
                    ${contentHtml}
                `;
                resultsDisplay.appendChild(card);
            }
        });

        jsonOutput.textContent = JSON.stringify(data, null, 2);
    }

    function resetDashboard() {
        scoreVal.innerHTML = `0<span>/100</span>`;
        scoreBar.style.width = `0%`;
        completeVal.innerHTML = `0<span>%</span>`;
        completeBar.style.width = `0%`;
        confVal.innerText = 'N/A';
        confBadge.innerText = 'Waiting';
        confBadge.className = 'badge';
    }

    document.getElementById('copy-json').addEventListener('click', () => {
        const text = jsonOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-json');
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => btn.innerText = originalText, 2000);
        });
    });
});
