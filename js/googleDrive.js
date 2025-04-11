// Google Drive API Configuration
const GOOGLE_API_CONFIG = {
    apiKey: 'YOUR_API_KEY',
    clientId: 'YOUR_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/drive.file',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
};

// Drive State
let isAuthenticated = false;
let currentUser = null;

// Initialize Google Drive API
document.addEventListener('DOMContentLoaded', () => {
    initGoogleDrive();
    setupDriveListeners();
});

// Initialize Google Drive
async function initGoogleDrive() {
    try {
        // Load the Google API client library
        await loadGoogleAPI();
        
        // Initialize the Google API client
        await initClient();
        
        // Update sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    } catch (error) {
        console.error('Error initializing Google Drive:', error);
        showDriveError('Failed to initialize Google Drive integration.');
    }
}

// Load the Google API client library
function loadGoogleAPI() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            gapi.load('client:auth2', () => {
                resolve();
            });
        };
        script.onerror = () => {
            reject(new Error('Failed to load Google API client.'));
        };
        document.body.appendChild(script);
    });
}

// Initialize the Google API client
async function initClient() {
    try {
        await gapi.client.init({
            apiKey: GOOGLE_API_CONFIG.apiKey,
            clientId: GOOGLE_API_CONFIG.clientId,
            scope: GOOGLE_API_CONFIG.scope,
            discoveryDocs: GOOGLE_API_CONFIG.discoveryDocs
        });
    } catch (error) {
        throw new Error('Error initializing Google API client: ' + error.message);
    }
}

// Setup Drive Event Listeners
function setupDriveListeners() {
    const syncDriveBtn = document.getElementById('syncDrive');
    if (syncDriveBtn) {
        syncDriveBtn.addEventListener('click', handleDriveSync);
    }
}

// Update Sign-in Status
function updateSigninStatus(isSignedIn) {
    isAuthenticated = isSignedIn;
    const syncDriveBtn = document.getElementById('syncDrive');
    
    if (syncDriveBtn) {
        if (isSignedIn) {
            syncDriveBtn.classList.remove('text-gray-600');
            syncDriveBtn.classList.add('text-blue-600');
        } else {
            syncDriveBtn.classList.remove('text-blue-600');
            syncDriveBtn.classList.add('text-gray-600');
        }
    }
}

// Handle Drive Sync
async function handleDriveSync() {
    try {
        if (!isAuthenticated) {
            await authenticateWithDrive();
        }
        
        // Show sync in progress
        showSyncProgress();
        
        // Get user data to sync
        const userData = getUserData();
        
        // Upload to Drive
        await uploadToDrive(userData);
        
        // Show success message
        showSyncSuccess();
    } catch (error) {
        console.error('Drive sync failed:', error);
        showDriveError('Failed to sync with Google Drive. Please try again.');
    }
}

// Authenticate with Google Drive
async function authenticateWithDrive() {
    try {
        const googleUser = await gapi.auth2.getAuthInstance().signIn();
        currentUser = googleUser.getBasicProfile();
        return googleUser;
    } catch (error) {
        throw new Error('Google Drive authentication failed: ' + error.message);
    }
}

// Get User Data for Sync
function getUserData() {
    // Get all user data that needs to be synced
    const userData = {
        progress: getProgress(),
        settings: getSettings(),
        timestamp: new Date().toISOString()
    };
    return userData;
}

// Get User Progress
function getProgress() {
    // Get progress data from localStorage or other storage
    const progress = localStorage.getItem('userProgress');
    return progress ? JSON.parse(progress) : {};
}

// Get User Settings
function getSettings() {
    // Get user settings from localStorage or other storage
    const settings = localStorage.getItem('userSettings');
    return settings ? JSON.parse(settings) : {};
}

// Upload Data to Drive
async function uploadToDrive(data) {
    try {
        // Create file metadata
        const filename = `edulearn_backup_${new Date().toISOString()}.json`;
        const metadata = {
            name: filename,
            mimeType: 'application/json'
        };

        // Convert data to Blob
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        
        // Upload file
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        // Execute upload
        await gapi.client.drive.files.create({
            resource: metadata,
            media: {
                mimeType: 'application/json',
                body: blob
            }
        });
    } catch (error) {
        throw new Error('Failed to upload to Drive: ' + error.message);
    }
}

// Download Data from Drive
async function downloadFromDrive() {
    try {
        // List files
        const response = await gapi.client.drive.files.list({
            q: "name contains 'edulearn_backup_'",
            orderBy: 'createdTime desc',
            pageSize: 1
        });

        const files = response.result.files;
        if (files && files.length > 0) {
            // Get latest backup
            const file = files[0];
            
            // Download file content
            const result = await gapi.client.drive.files.get({
                fileId: file.id,
                alt: 'media'
            });
            
            return JSON.parse(result.body);
        }
        return null;
    } catch (error) {
        throw new Error('Failed to download from Drive: ' + error.message);
    }
}

// Show Sync Progress
function showSyncProgress() {
    const syncBtn = document.getElementById('syncDrive');
    if (syncBtn) {
        syncBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin mr-2"></i>Syncing...';
    }
}

// Show Sync Success
function showSyncSuccess() {
    const syncBtn = document.getElementById('syncDrive');
    if (syncBtn) {
        syncBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Synced';
        setTimeout(() => {
            syncBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Sync Drive';
        }, 2000);
    }
}

// Show Drive Error
function showDriveError(message) {
    // You could implement a toast notification here
    alert(message);
}
