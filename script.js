document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('is-active');
            
            // 접근성 속성 토글
            const isExpanded = mobileToggle.classList.contains('is-active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            mobileToggle.setAttribute('aria-label', isExpanded ? '메뉴 닫기' : '메뉴 열기');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('is-active');
                mobileToggle.setAttribute('aria-expanded', false);
                mobileToggle.setAttribute('aria-label', '메뉴 열기');
            });
        });
    }

    // 1.5 Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = 'hero';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // 맨 위면 무조건 hero
        if (scrollY < 50) current = 'hero';

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // 2. Toast Notification System
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    window.showToast = showToast; // Global access

    // 3. Scroll Reveal & Skill Progress Bars
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // (Skills animation removed as section was replaced by instructor section)
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Hero Visual Interaction (Code Editor & Typewriter)
    const codeEditor = document.querySelector('.code-editor');
    const heroSection = document.getElementById('hero');
    
    if (codeEditor && heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            codeEditor.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        heroSection.addEventListener('mouseleave', () => {
            codeEditor.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }

    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        typewriterEl.classList.add('typing-cursor');
        const codeText = `const idea = "Make it Real";\nfunction buildFuture() {\n  console.log("Hello, World!");\n  return execute(idea);\n}\nbuildFuture();`;
        
        let i = 0;
        function typeWriter() {
            if (i < codeText.length) {
                typewriterEl.textContent += codeText.charAt(i);
                i++;
                setTimeout(typeWriter, 40 + Math.random() * 60);
            }
        }
        setTimeout(typeWriter, 800);
    }

    // Hero Title Typewriter & Parallax Effect
    const mainTitle = document.getElementById('main-title');
    const heroSectionForParallax = document.getElementById('hero');
    
    if (mainTitle && heroSectionForParallax) {
        const text1 = "당신의 아이디어를 ";
        const text2 = "코드로 현실화하세요";
        
        mainTitle.innerHTML = '<span id="line1"></span><br><span id="line2" class="accent"></span>';
        const line1El = mainTitle.querySelector('#line1');
        const line2El = mainTitle.querySelector('#line2');
        
        line1El.classList.add('typing-cursor');
        
        let charIndex1 = 0;
        let charIndex2 = 0;
        
        function typeTitle1() {
            if (charIndex1 < text1.length) {
                line1El.textContent += text1.charAt(charIndex1);
                charIndex1++;
                setTimeout(typeTitle1, 120 + Math.random() * 80);
            } else {
                line1El.classList.remove('typing-cursor');
                line2El.classList.add('typing-cursor');
                setTimeout(typeTitle2, 500);
            }
        }
        
        function typeTitle2() {
            if (charIndex2 < text2.length) {
                line2El.textContent += text2.charAt(charIndex2);
                charIndex2++;
                setTimeout(typeTitle2, 120 + Math.random() * 80);
            } else {
                // Typing finished, enable parallax
                enableParallax();
            }
        }
        
        function enableParallax() {
            heroSectionForParallax.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
                
                const clampX = Math.max(-10, Math.min(10, xAxis));
                const clampY = Math.max(-10, Math.min(10, yAxis));
                
                mainTitle.style.transform = `rotateY(${clampX}deg) rotateX(${clampY}deg)`;
            });
            
            heroSectionForParallax.addEventListener('mouseleave', () => {
                mainTitle.style.transform = `rotateY(0deg) rotateX(0deg)`;
            });
        }
        
        // Start title typing quickly
        setTimeout(typeTitle1, 300);
    }

    // 5. Community Logic with Custom UI
    const db = firebase.firestore();
    const postsList = document.getElementById('posts-list');
    const modal = document.getElementById('post-modal');
    const pwdModal = document.getElementById('pwd-modal-overlay');
    
    let pendingDeleteId = null;
    let pendingCorrectPassword = null;

    let latestSnapshot = null;
    let currentCategoryFilter = 'all';

    function renderPosts(snapshot) {
        if (snapshot) latestSnapshot = snapshot;
        const snapToRender = snapshot || latestSnapshot;
        if (!snapToRender) return;
        
        postsList.innerHTML = '';
        if (snapToRender.empty) {
            postsList.innerHTML = '<div style="padding: 3rem; text-align: center; color: #8E8E93;">💬 아직 등록된 글이 없습니다. 첫 게시글을 작성해 보세요!</div>';
            return;
        }
        
        let postCount = 0;
        snapToRender.forEach(doc => {
            const p = doc.data();
            if (currentCategoryFilter !== 'all' && p.category !== currentCategoryFilter) return;
            
            postCount++;
            const id = doc.id;
            const item = document.createElement('div');
            item.className = 'forum-item';
            let displayCategory = p.category;
            let tagClass = `tag-${p.category}`;
            if (p.category === 'news') { displayCategory = '뉴스 📢'; tagClass = 'tag-news'; }
            else if (p.category === 'question') { displayCategory = '질문 ❓'; tagClass = 'tag-question'; }
            else if (p.category === 'sharing') { displayCategory = '코드리뷰 💻'; tagClass = 'tag-sharing'; }
            
            item.innerHTML = `
                <div class="forum-item-header">
                    <span class="tag ${tagClass}">${displayCategory}</span>
                    <button class="btn-delete" onclick="window.initDelete('${id}', '${p.password}')" aria-label="게시글 삭제">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
                <h3 class="forum-title">${p.title}</h3>
                <div class="forum-meta">
                    <span class="forum-author">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        ${p.author}
                    </span>
                    <span class="forum-date">${p.date}</span>
                </div>
            `;
            postsList.appendChild(item);
        });
        
        if (postCount === 0) {
            postsList.innerHTML = '<div style="padding: 3rem; text-align: center; color: #8E8E93;">💬 아직 등록된 글이 없습니다. 첫 게시글을 작성해 보세요!</div>';
        }
    }

    db.collection("posts").orderBy("createdAt", "desc").onSnapshot(renderPosts);

    // Filter Logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategoryFilter = e.target.getAttribute('data-filter');
            renderPosts(latestSnapshot);
        });
    });

    // Custom UI Deletion Logic
    window.initDelete = (id, correctPassword) => {
        pendingDeleteId = id;
        pendingCorrectPassword = correctPassword;
        pwdModal.style.display = 'flex';
        document.getElementById('input-confirm-password').focus();
    };

    document.getElementById('btn-close-pwd-modal').onclick = () => {
        pwdModal.style.display = 'none';
        document.getElementById('input-confirm-password').value = '';
    };

    document.getElementById('btn-confirm-pwd').onclick = async () => {
        const inputPw = document.getElementById('input-confirm-password').value;
        if (inputPw === pendingCorrectPassword) {
            await db.collection("posts").doc(pendingDeleteId).delete();
            showToast("게시글이 성공적으로 삭제되었습니다.");
            pwdModal.style.display = 'none';
        } else {
            showToast("비밀번호가 일치하지 않습니다.", "error");
        }
        document.getElementById('input-confirm-password').value = '';
    };

    // Post Submission
    document.getElementById('btn-open-modal').onclick = () => modal.style.display = 'flex';
    document.getElementById('btn-close-modal').onclick = () => modal.style.display = 'none';
    document.getElementById('btn-submit-post').onclick = async () => {
        const title = document.getElementById('input-title').value;
        const author = document.getElementById('input-author').value;
        const password = document.getElementById('input-password').value;
        const category = document.getElementById('input-category').value;
        
        if (!title || !author || !password) {
            showToast("모든 필드를 입력해주세요.", "error");
            return;
        }

        try {
            await db.collection("posts").add({
                title, author, password, category,
                date: new Date().toISOString().split('T')[0],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showToast("게시글이 등록되었습니다.");
            modal.style.display = 'none';
            // Reset inputs
            document.getElementById('input-title').value = '';
            document.getElementById('input-author').value = '';
            document.getElementById('input-password').value = '';
        } catch (e) {
            showToast("등록 중 오류가 발생했습니다.", "error");
        }
    };

    // Course Enrollment Logic
    const enrollModal = document.getElementById('enroll-modal');
    const courseInput = document.getElementById('enroll-course-name');
    
    document.querySelectorAll('.btn-enroll').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseName = e.target.getAttribute('data-course');
            courseInput.value = courseName;
            enrollModal.style.display = 'flex';
        });
    });

    document.getElementById('btn-close-enroll-modal').onclick = () => {
        enrollModal.style.display = 'none';
        courseInput.value = '';
    };

    document.getElementById('btn-submit-enroll').onclick = () => {
        const name = document.getElementById('enroll-name').value;
        const email = document.getElementById('enroll-email').value;
        if (!name || !email) {
            showToast("이름과 이메일을 모두 입력해주세요.", "error");
            return;
        }
        
        // Simulating submission
        enrollModal.style.display = 'none';
        
        const successModal = document.getElementById('success-modal');
        if (successModal) successModal.style.display = 'flex';
        
        // Reset form
        document.getElementById('enroll-name').value = '';
        document.getElementById('enroll-email').value = '';
        document.getElementById('enroll-goal').value = '';
        
        const charCounter = document.getElementById('char-counter');
        if (charCounter) charCounter.textContent = '(0/500)';
    };

    const btnCloseSuccess = document.getElementById('btn-close-success');
    if (btnCloseSuccess) {
        btnCloseSuccess.onclick = () => {
            document.getElementById('success-modal').style.display = 'none';
        };
    }

    // FAQ Accordion Logic
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const faqAnswer = button.nextElementSibling;
            const isActive = faqItem.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
            }
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Enroll Form Validation & Counter
    const enrollGoal = document.getElementById('enroll-goal');
    const charCounter = document.getElementById('char-counter');
    if (enrollGoal && charCounter) {
        enrollGoal.addEventListener('input', () => {
            const length = enrollGoal.value.length;
            charCounter.textContent = `(${length}/500)`;
        });
    }

    const enrollEmail = document.getElementById('enroll-email');
    if (enrollEmail) {
        enrollEmail.addEventListener('blur', () => {
            const emailVal = enrollEmail.value;
            if (emailVal && !emailVal.includes('@')) {
                enrollEmail.style.setProperty('border-color', '#FF3B30', 'important');
                showToast("유효한 이메일 형식을 입력해주세요.", "error");
            } else {
                enrollEmail.style.removeProperty('border-color');
            }
        });
    }

    // Curriculum Tabs Logic
    document.querySelectorAll('.curriculum-tabs').forEach(tabsContainer => {
        const btns = tabsContainer.querySelectorAll('.curriculum-tab-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from buttons
                btns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get target tab content id
                const targetId = btn.getAttribute('data-tab');
                
                // Find all tab contents within the same instructor-curriculum-tabs container
                const parent = btn.closest('.instructor-curriculum-tabs');
                if (parent) {
                    const contents = parent.querySelectorAll('.curriculum-tab-content');
                    contents.forEach(content => {
                        if (content.id === targetId) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                }
            });
        });
    });


    // Curriculum Modal Logic
    const curriculumModal = document.getElementById('curriculum-modal');
    if (curriculumModal) {
        const btnCloseCurriculum = document.querySelector('.modal-close-btn') || document.getElementById('btn-close-curriculum');
        const instructorBlocks = document.querySelectorAll('.curriculum-instructor-block');
        const curriculumBtns = document.querySelectorAll('.btn-curriculum');

        curriculumBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const instructor = btn.getAttribute('data-instructor');
                
                // Hide all blocks
                instructorBlocks.forEach(block => {
                    block.style.display = 'none';
                });
                
                // Show the target block
                const targetBlock = document.getElementById(`curriculum-content-${instructor}`);
                if (targetBlock) {
                    targetBlock.style.display = 'block';
                }
                
                curriculumModal.style.display = 'flex';
            });
        });

        if (btnCloseCurriculum) {
            btnCloseCurriculum.addEventListener('click', () => {
                curriculumModal.style.display = 'none';
            });
        }
        
        curriculumModal.addEventListener('click', (e) => {
            if (e.target === curriculumModal) {
                curriculumModal.style.display = 'none';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && curriculumModal.style.display === 'flex') {
                curriculumModal.style.display = 'none';
            }
        });
    }

    // Scroll to Top Logic
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Sticky Banner Countdown Logic
    const stickyBanner = document.getElementById('sticky-banner');
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (stickyBanner && cdDays) {
        // Show banner after short delay
        setTimeout(() => {
            stickyBanner.style.transform = 'translateY(0)';
        }, 1000);

        function updateCountdown() {
            const now = new Date();
            const target = new Date();
            // 오늘 밤 23시 59분 59초 마감
            target.setHours(23, 59, 59, 999);
            
            let diff = target - now;
            if (diff < 0) {
                target.setDate(target.getDate() + 1);
                diff = target - now;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / 1000 / 60) % 60);
            const s = Math.floor((diff / 1000) % 60);

            cdDays.textContent = String(d).padStart(2, '0');
            cdHours.textContent = String(h).padStart(2, '0');
            cdMins.textContent = String(m).padStart(2, '0');
            cdSecs.textContent = String(s).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
