// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const scrollIndicator = document.querySelector('.scroll-indicator');
const navLinks = document.querySelectorAll('.nav-link');

// Media Elements
const podcastAudio = document.getElementById('podcast-audio');
const mainVideo = document.getElementById('main-video');
const playPauseAudio = document.getElementById('play-pause-audio');
const audioProgress = document.getElementById('audio-progress');
const audioTime = document.getElementById('audio-time');
const videoPlayBtn = document.getElementById('video-play-btn');
const videoOverlay = document.querySelector('.video-overlay');

// Duration displays
const podcastDuration = document.getElementById('podcast-duration');
const videoDuration = document.getElementById('video-duration');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeMediaPlayers();
    initializeScrollEffects();
    initializeAnimations();
});

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation Management
function initializeNavigation() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Scroll indicator click
    scrollIndicator.addEventListener('click', () => {
        document.getElementById('podcast').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;
    
    header.style.background = scrolled 
        ? 'rgba(255, 255, 255, 0.98)' 
        : 'rgba(255, 255, 255, 0.95)';
        
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        header.style.background = scrolled 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(15, 23, 42, 0.95)';
    }
}

// Media Players Management
function initializeMediaPlayers() {
    initializeAudioPlayer();
    initializeVideoPlayer();
    loadMediaDurations();
}

function initializeAudioPlayer() {
    if (!podcastAudio) return;
    
    // Custom play/pause button
    playPauseAudio.addEventListener('click', toggleAudioPlayback);
    
    // Progress bar click
    document.querySelector('.progress-bar').addEventListener('click', seekAudio);
    
    // Audio event listeners
    podcastAudio.addEventListener('loadedmetadata', updateAudioDuration);
    podcastAudio.addEventListener('timeupdate', updateAudioProgress);
    podcastAudio.addEventListener('play', () => updatePlayButton(true));
    podcastAudio.addEventListener('pause', () => updatePlayButton(false));
    podcastAudio.addEventListener('ended', () => updatePlayButton(false));
}

function toggleAudioPlayback() {
    if (podcastAudio.paused) {
        podcastAudio.play();
    } else {
        podcastAudio.pause();
    }
}

function updatePlayButton(isPlaying) {
    const icon = playPauseAudio.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function seekAudio(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * podcastAudio.duration;
    podcastAudio.currentTime = seekTime;
}

function updateAudioProgress() {
    if (podcastAudio.duration) {
        const percent = (podcastAudio.currentTime / podcastAudio.duration) * 100;
        audioProgress.style.width = percent + '%';
        
        const currentTime = formatTime(podcastAudio.currentTime);
        const totalTime = formatTime(podcastAudio.duration);
        audioTime.textContent = `${currentTime} / ${totalTime}`;
    }
}

function updateAudioDuration() {
    if (podcastDuration && podcastAudio.duration) {
        podcastDuration.textContent = formatTime(podcastAudio.duration);
    }
}

function initializeVideoPlayer() {
    if (!mainVideo) return;
    
    // Custom play button overlay
    videoPlayBtn.addEventListener('click', toggleVideoPlayback);
    
    // Hide overlay when video is playing
    mainVideo.addEventListener('play', () => {
        videoOverlay.style.opacity = '0';
    });
    
    mainVideo.addEventListener('pause', () => {
        videoOverlay.style.opacity = '1';
    });
    
    mainVideo.addEventListener('ended', () => {
        videoOverlay.style.opacity = '1';
    });
    
    // Load video duration
    mainVideo.addEventListener('loadedmetadata', updateVideoDuration);
}

function toggleVideoPlayback() {
    if (mainVideo.paused) {
        mainVideo.play();
    } else {
        mainVideo.pause();
    }
}

function updateVideoDuration() {
    if (videoDuration && mainVideo.duration) {
        videoDuration.textContent = formatTime(mainVideo.duration);
    }
}

function loadMediaDurations() {
    // Set default durations while media loads
    if (podcastDuration) podcastDuration.textContent = 'Loading...';
    if (videoDuration) videoDuration.textContent = 'Loading...';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.content-section, .media-card, .feature').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', handleParallax);
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-icons');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// Animation and Interaction Effects
function initializeAnimations() {
    // Add hover effects to media cards
    const mediaCards = document.querySelectorAll('.media-card');
    mediaCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

function handleCardHover(e) {
    e.currentTarget.style.transform = 'translateY(-10px)';
}

function handleCardLeave(e) {
    e.currentTarget.style.transform = 'translateY(-5px)';
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard Navigation
document.addEventListener('keydown', handleKeyNavigation);

function handleKeyNavigation(e) {
    // Space bar to play/pause audio
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (podcastAudio && !podcastAudio.paused) {
            podcastAudio.pause();
        } else if (podcastAudio) {
            podcastAudio.play();
        }
    }
    
    // Arrow keys for audio seeking
    if (podcastAudio && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
        e.preventDefault();
        const skipTime = e.code === 'ArrowRight' ? 10 : -10;
        podcastAudio.currentTime = Math.max(0, 
            Math.min(podcastAudio.duration, podcastAudio.currentTime + skipTime)
        );
    }
}

// Error Handling for Media
function initializeErrorHandling() {
    if (podcastAudio) {
        podcastAudio.addEventListener('error', handleMediaError);
    }
    
    if (mainVideo) {
        mainVideo.addEventListener('error', handleMediaError);
    }
}

function handleMediaError(e) {
    const mediaType = e.target.tagName.toLowerCase();
    showNotification(`Error loading ${mediaType}. Please try again later.`, 'error');
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(handleHeaderScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);

// Initialize error handling
initializeErrorHandling();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
    });
}

// Analytics and Tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track media interactions
if (podcastAudio) {
    podcastAudio.addEventListener('play', () => trackEvent('audio_play', { media: 'podcast' }));
}

if (mainVideo) {
    mainVideo.addEventListener('play', () => trackEvent('video_play', { media: 'main_video' }));
}

// PDF Download Tracking
document.addEventListener('DOMContentLoaded', function() {
    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pdfName = this.getAttribute('href');
            const action = this.hasAttribute('download') ? 'download' : 'view';
            trackEvent('pdf_interaction', { pdf: pdfName, action: action });
        });
    });
});