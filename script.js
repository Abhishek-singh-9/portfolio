document.addEventListener('DOMContentLoaded', () => {
    // ---------------- State & Constants ----------------
    const state = {
        isDarkMode: true,
        isMenuOpen: false
    };

    // ---------------- Core UI Elements ----------------
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollTopBtn = document.getElementById('scroll-top');
    const cursorGlow = document.getElementById('cursor-glow');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-progress-fill');

    // ---------------- 1. Custom Cursor Glow ----------------
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // ---------------- 1.1 Toast System ----------------
    const createToastContainer = () => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; pointer-events: none;';
            document.body.appendChild(container);
        }
        return container;
    };

    window.showToast = (msg, type = 'info') => {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: rgba(17, 25, 40, 0.9);
            backdrop-filter: blur(8px);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            margin-top: 10px;
            border: 1px solid var(--border-glass);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateY(100px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
        `;
        
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            info: '#6366f1'
        };
        toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
        
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle');
        toast.innerHTML = `<i class="fas fa-${icon}" style="color: ${colors[type]}"></i> ${msg}`;
        
        container.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateY(0)', 10);
        
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };

    // ---------------- 1.2 Drag & Drop Support ----------------
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
        });

        dropZone.addEventListener('drop', e => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        resumeInput.value = event.target.result;
                        showToast('File loaded successfully!', 'success');
                    };
                    reader.readAsText(file);
                } else {
                    showToast('Only .txt files supported for now.', 'error');
                }
            }
        });
    }

    // ---------------- 2. Navigation Logic ----------------
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            state.isMenuOpen = !state.isMenuOpen;
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = state.isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            state.isMenuOpen = false;
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Navbar Scroll Effect & Active Link Highlight
    const handleScroll = () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Top Button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Active Link Highlight
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ---------------- 3. Theme Toggle ----------------
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.isDarkMode = !state.isDarkMode;
            body.classList.toggle('light-mode');
            themeToggle.innerHTML = state.isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            
            // Update Cursor Color if needed
            if (cursorGlow) {
                cursorGlow.style.background = state.isDarkMode 
                    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)'
                    : 'radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%)';
            }
        });
    }

    // ---------------- 4. Typing Effect ----------------
    const typingText = document.getElementById('typing-text');
    const phrases = ['AI/ML Student', 'Developer', 'Problem Solver'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    if (typingText) setTimeout(type, 1000);

    // ---------------- 5. Scroll Reveals ----------------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a progress bar, animate it
                const progBar = entry.target.querySelector('.skill-progress-fill');
                if (progBar) {
                    progBar.style.width = progBar.getAttribute('data-progress');
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Special observer for skill bars inside the cards
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.getAttribute('data-progress');
            }
        });
    }, { threshold: 1.0 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ---------------- 6. Resume Parser Pro ----------------
    const analyzeBtn = document.getElementById('analyze-btn');
    const resumeInput = document.getElementById('resumeInput');
    const resultsDisplay = document.getElementById('results-display');
    const jsonOutput = document.getElementById('json-output');
    
    // Dashboard elements
    const scoreVal = document.getElementById('score-val');
    const scoreBar = document.getElementById('score-bar');
    const completeVal = document.getElementById('complete-val');
    const completeBar = document.getElementById('complete-bar');
    const confVal = document.getElementById('conf-val');
    const confMessage = document.getElementById('conf-message');

    // Tab Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });

    // Analysis Logic
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            const text = resumeInput.value.trim();
            if (!text) {
                showToast('Please insert resume content!', 'error');
                return;
            }

            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = 'Analyzing Neural Patterns... <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                const data = parseResumeExtended(text);
                updateParserUI(data);
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = 'Analyze Intelligence <i class="fas fa-microchip"></i>';
                showToast('Analysis Complete!', 'success');
            }, 1200);
        });
    }

    // Extended Parsing Logic
    function parseResumeExtended(text) {
        const patterns = {
            name: /[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/,
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
            phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
            skills: /(?:Skills|SKILLS|Technical Skills|Competencies):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
            experience: /(?:Experience|EXPERIENCE|Work Experience):\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i
        };

        const result = {};
        for (let key in patterns) {
            const match = text.match(patterns[key]);
            result[key] = match ? match[1] || match[0] : null;
        }
        
        // Secondary processing for items
        if (result.skills) {
            result.skills = result.skills.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 2);
        }

        return result;
    }

    function updateParserUI(data) {
        let score = 0;
        let filled = 0;
        const total = 5;

        if (data.name) filled++, score += 15;
        if (data.email) filled++, score += 15;
        if (data.phone) filled++, score += 15;
        if (data.skills?.length > 0) filled++, score += Math.min(35, data.skills.length * 5);
        if (data.experience) filled++, score += 20;

        const completeness = Math.round((filled / total) * 100);
        
        // Animate Dashboard
        animateValue(scoreVal, 0, score, 800);
        animateValue(completeVal, 0, completeness, 800);
        scoreBar.style.width = `${score}%`;
        completeBar.style.width = `${completeness}%`;

        // ATS Feedback
        if (score > 80) {
            confVal.innerText = 'Exceptional';
            confVal.style.color = 'var(--accent)';
            confMessage.innerText = 'Optimized for high-tier ATS.';
        } else if (score > 50) {
            confVal.innerText = 'Moderate';
            confVal.style.color = 'var(--primary-light)';
            confMessage.innerText = 'Good, but could use more keywords.';
        } else {
            confVal.innerText = 'Needs Help';
            confVal.style.color = '#ef4444';
            confMessage.innerText = 'Missing key professional detail.';
        }

        // Display Results
        resultsDisplay.innerHTML = '';
        const items = [
            { label: 'Identified Name', val: data.name, icon: 'user' },
            { label: 'Contact Path', val: data.email, icon: 'envelope' },
            { label: 'Skill Vectors', val: data.skills?.join(', ') || 'None', icon: 'bolt' },
            { label: 'Experience Depth', val: data.experience ? 'Found Content' : 'None', icon: 'briefcase' }
        ];

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'result-item';
            el.innerHTML = `
                <div class="result-item-label"><i class="fas fa-${item.icon}"></i> ${item.label}</div>
                <div class="result-item-value">${item.val || 'Undetected'}</div>
            `;
            resultsDisplay.appendChild(el);
        });

        jsonOutput.textContent = JSON.stringify(data, null, 2);
    }

    // Helper: Animate Counter
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ---------------- Global Helpers (Exposed) ----------------
    window.loadSample = () => {
        resumeInput.value = `Abhishek Singh
Email: abhishek_singh25@mru.ac.in
Phone: 9876543210
Skills: Python, JavaScript, CSS, HTML5, AI, ML, Deep Learning, Git, React
Experience: Developed an AI Resume Parser Pro with modern analytics and glassmorphism design. Built Library systems using Python and structured data.`;
        showToast('Sample Loaded', 'info');
    };

    window.clearParser = () => {
        resumeInput.value = '';
        scoreVal.innerText = '0';
        completeVal.innerText = '0';
        scoreBar.style.width = '0%';
        completeBar.style.width = '0%';
        confVal.innerText = 'N/A';
        confVal.style.color = 'inherit';
        confMessage.innerText = 'System ready';
        resultsDisplay.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);"><i class="fas fa-wand-magic-sparkles" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i><p>Parsed data will appear here.</p></div>';
        jsonOutput.textContent = '{ "status": "idle" }';
    };

    window.copyJSON = () => {
        navigator.clipboard.writeText(jsonOutput.textContent);
        showToast('JSON Copied!', 'success');
    };

    function showToast(msg, type) {
        // Simple log for now, could be a real toast component
        console.log(`[${type}] ${msg}`);
        // Optionally implement a toast element in HTML
    }
});
