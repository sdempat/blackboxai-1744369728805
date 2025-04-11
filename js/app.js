// App State
const courseData = {
    inProgress: [
        {
            id: 1,
            title: 'Web Development Basics',
            progress: 65,
            image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg'
        },
        {
            id: 2,
            title: 'Data Science Fundamentals',
            progress: 40,
            image: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg'
        },
        {
            id: 3,
            title: 'Mobile App Development',
            progress: 25,
            image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg'
        }
    ],
    recommended: [
        {
            id: 4,
            title: 'Artificial Intelligence',
            description: 'Learn the basics of AI and machine learning',
            image: 'https://images.pexels.com/photos/7376/startup-photos.jpg'
        },
        {
            id: 5,
            title: 'Blockchain Technology',
            description: 'Explore the world of blockchain and cryptocurrencies',
            image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
        },
        {
            id: 6,
            title: 'Cloud Computing',
            description: 'Master cloud platforms and services',
            image: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg'
        }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadUserProgress();
});

// Initialize App
function initializeApp() {
    updateDashboardStats();
    renderCourseProgress();
    renderRecommendedCourses();
}

// Setup Event Listeners
function setupEventListeners() {
    // Course continue buttons
    document.querySelectorAll('.course-continue').forEach(button => {
        button.addEventListener('click', handleContinueCourse);
    });

    // Course start buttons
    document.querySelectorAll('.course-start').forEach(button => {
        button.addEventListener('click', handleStartCourse);
    });

    // Window resize handler for responsive adjustments
    window.addEventListener('resize', handleResize);
}

// Load User Progress
function loadUserProgress() {
    try {
        const savedProgress = localStorage.getItem('courseProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            courseData.inProgress = progress.inProgress || courseData.inProgress;
            updateDashboardStats();
            renderCourseProgress();
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
    }
}

// Save User Progress
function saveUserProgress() {
    try {
        localStorage.setItem('courseProgress', JSON.stringify({
            inProgress: courseData.inProgress,
            lastUpdated: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error saving user progress:', error);
        showNotification('Failed to save progress', 'error');
    }
}

// Update Dashboard Stats
function updateDashboardStats() {
    const stats = calculateUserStats();
    
    // Update completed courses
    const completedElement = document.querySelector('[data-stat="completed"]');
    if (completedElement) {
        completedElement.textContent = stats.completed;
    }

    // Update in progress courses
    const inProgressElement = document.querySelector('[data-stat="inProgress"]');
    if (inProgressElement) {
        inProgressElement.textContent = stats.inProgress;
    }

    // Update hours learned
    const hoursElement = document.querySelector('[data-stat="hours"]');
    if (hoursElement) {
        hoursElement.textContent = stats.hoursLearned;
    }
}

// Calculate User Stats
function calculateUserStats() {
    return {
        completed: courseData.inProgress.filter(course => course.progress === 100).length,
        inProgress: courseData.inProgress.filter(course => course.progress < 100).length,
        hoursLearned: Math.round(courseData.inProgress.reduce((acc, course) => acc + (course.progress / 100 * 10), 0))
    };
}

// Render Course Progress
function renderCourseProgress() {
    const container = document.getElementById('inProgressCourses');
    if (!container) return;

    container.innerHTML = courseData.inProgress.map(course => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${course.title}</h3>
                <div class="flex items-center mb-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${course.progress}%"></div>
                    </div>
                    <span class="text-sm text-gray-600 ml-2">${course.progress}%</span>
                </div>
                <button class="course-continue w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                        data-course-id="${course.id}">
                    Continue
                </button>
            </div>
        </div>
    `).join('');

    // Reattach event listeners
    container.querySelectorAll('.course-continue').forEach(button => {
        button.addEventListener('click', handleContinueCourse);
    });
}

// Render Recommended Courses
function renderRecommendedCourses() {
    const container = document.getElementById('recommendedCourses');
    if (!container) return;

    container.innerHTML = courseData.recommended.map(course => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${course.title}</h3>
                <p class="text-gray-600 mb-4">${course.description}</p>
                <button class="course-start w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition duration-300"
                        data-course-id="${course.id}">
                    Start Learning
                </button>
            </div>
        </div>
    `).join('');

    // Reattach event listeners
    container.querySelectorAll('.course-start').forEach(button => {
        button.addEventListener('click', handleStartCourse);
    });
}

// Handle Continue Course
function handleContinueCourse(event) {
    const courseId = parseInt(event.currentTarget.dataset.courseId);
    const course = courseData.inProgress.find(c => c.id === courseId);
    
    if (course) {
        // Simulate progress update
        course.progress = Math.min(100, course.progress + 10);
        
        // Update UI
        saveUserProgress();
        updateDashboardStats();
        renderCourseProgress();
        
        // Show notification
        showNotification(`Continuing ${course.title}`, 'success');
    }
}

// Handle Start Course
function handleStartCourse(event) {
    const courseId = parseInt(event.currentTarget.dataset.courseId);
    const course = courseData.recommended.find(c => c.id === courseId);
    
    if (course) {
        // Add to in progress courses
        courseData.inProgress.push({
            id: course.id,
            title: course.title,
            progress: 0,
            image: course.image
        });
        
        // Remove from recommended
        courseData.recommended = courseData.recommended.filter(c => c.id !== courseId);
        
        // Update UI
        saveUserProgress();
        updateDashboardStats();
        renderCourseProgress();
        renderRecommendedCourses();
        
        // Show notification
        showNotification(`Started ${course.title}`, 'success');
    }
}

// Handle Resize
function handleResize() {
    // Add any responsive adjustments here
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('is-mobile', isMobile);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 
        'bg-blue-600'
    } transition-opacity duration-300`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for use in other modules
window.app = {
    loadUserProgress,
    saveUserProgress,
    updateDashboardStats,
    showNotification
};
