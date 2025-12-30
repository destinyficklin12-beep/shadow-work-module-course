let isSignUp = false;

// Check if user is already signed in
auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'dashboard.html';
    }
});

// Get elements
const authBtn = document.getElementById('authBtn');
const toggleLink = document.getElementById('toggleLink');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');
const signupFields = document.querySelectorAll('.signup-fields');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');

// Toggle between sign in and sign up
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    
    if (isSignUp) {
        authTitle.textContent = 'Create Your Account';
        authSubtitle.textContent = 'Begin your shadow work journey';
        authBtn.textContent = 'Sign Up';
        document.getElementById('toggleText').innerHTML = 
            'Already have an account? <a href="#" id="toggleLink">Sign In</a>';
        signupFields.forEach(field => field.classList.add('active'));
    } else {
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to continue your journey';
        authBtn.textContent = 'Sign In';
        document.getElementById('toggleText').innerHTML = 
            'Don\'t have an account? <a href="#" id="toggleLink">Sign Up</a>';
        signupFields.forEach(field => field.classList.remove('active'));
    }
    
    // Re-attach event listener
    document.getElementById('toggleLink').addEventListener('click', arguments.callee);
});

// Handle authentication
authBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();
    
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    // Validation
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    if (isSignUp && !name) {
        showError('Please enter your name');
        return;
    }
    
    authBtn.disabled = true;
    authBtn.textContent = 'Please wait...';
    
    try {
        if (isSignUp) {
            // Sign up
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile with name
            await user.updateProfile({
                displayName: name
            });
            
            // Save user profile to Firestore
            await db.collection('userProfiles').doc(user.uid).set({
                name: name,
                email: email,
                experience: document.getElementById('experience').value,
                expectations: document.getElementById('expectations').value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Initialize empty progress
            await db.collection('userProgress').doc(user.uid).set({
                completedModules: [],
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showSuccess('Account created! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            // Sign in
            await auth.signInWithEmailAndPassword(email, password);
            showSuccess('Signed in! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
        
    } catch (error) {
        console.error('Auth error:', error);
        authBtn.disabled = false;
        authBtn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
        
        // User-friendly error messages
        let message = error.message;
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already registered. Please sign in instead.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Please enter a valid email address.';
        } else if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password.';
        }
        showError(message);
    }
});

// Allow Enter key to submit
document.getElementById('password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        authBtn.click();
    }
});

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function showSuccess(message) {
    successMsg.textContent = message;
    successMsg.style.display = 'block';
}
