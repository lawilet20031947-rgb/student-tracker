# Firestore Security Rules Deployment Guide

## Overview

The security rules file (`firestore.rules.example`) defines role-based access control for your Firestore collections:

- **Admin**: Full read/write access to all collections
- **Teacher**: Read all, create new records, edit/delete own records
- **Student**: Read-only access to own records only

## Deployment Steps

### Step 1: Locate the Rules File

Find `firestore.rules.example` in the root of your repository.

### Step 2: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. In the left sidebar, click **"Firestore Database"**

### Step 3: Navigate to Rules Tab

1. Click the **"Rules"** tab (next to "Data" tab)
2. You should see the current default rules

### Step 4: Edit Rules

1. Click the **"Edit rules"** button
2. A code editor will open with the current Firestore rules

### Step 5: Replace with New Rules

1. Select all content (Ctrl+A or Cmd+A)
2. Delete it
3. Copy the entire content from `firestore.rules.example` and paste it

**Rules Content:**
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isTeacher() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }

    function isStudent() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }

    // Users collection: only read own doc, admins can read all
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
    }

    // Attendance collection
    match /attendance/{attendanceId} {
      // Admin: full access
      // Teacher: can read all, create new, edit/delete own
      // Student: can read own, cannot write
      
      allow read: if isAuthenticated() && 
                     (isAdmin() || isTeacher() || 
                      (isStudent() && resource.data.studentId == request.auth.uid));
      
      allow create: if isAuthenticated() && (isAdmin() || isTeacher());
      
      allow update: if isAdmin() || 
                       (isTeacher() && resource.data.createdBy == request.auth.uid);
      
      allow delete: if isAdmin() || 
                       (isTeacher() && resource.data.createdBy == request.auth.uid);
    }

    // Performance collection
    match /performance/{performanceId} {
      // Admin: full access
      // Teacher: can read all, create new, edit/delete own
      // Student: can read own, cannot write
      
      allow read: if isAuthenticated() && 
                     (isAdmin() || isTeacher() || 
                      (isStudent() && resource.data.studentId == request.auth.uid));
      
      allow create: if isAuthenticated() && (isAdmin() || isTeacher());
      
      allow update: if isAdmin() || 
                       (isTeacher() && resource.data.createdBy == request.auth.uid);
      
      allow delete: if isAdmin() || 
                       (isTeacher() && resource.data.createdBy == request.auth.uid);
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 6: Publish Rules

1. Click the **"Publish"** button in the bottom right
2. A confirmation dialog will appear
3. Click **"Publish"** to confirm
4. Wait for the rules to be published (usually a few seconds)
5. You should see a success notification

## Verification

### Test Admin Access

1. Log in as an Admin user
2. Navigate to Firestore Database → Data tab
3. Verify you can see all `users`, `attendance`, and `performance` collections
4. Try creating, editing, and deleting records - all should work

### Test Teacher Access

1. Log in as a Teacher user
2. Go to Teacher Dashboard
3. Create a performance record
4. Verify you can see and edit it
5. Try to read other teachers' records (should fail if rules are strict, or succeed if rules allow teachers to read all)
6. Try to delete another teacher's record (should fail)

### Test Student Access

1. Log in as a Student user
2. Go to Student Dashboard
3. Try to create a new record (should fail with permission denied error)
4. Try to access another student's record via Firestore console (should fail)
5. Verify you can only see your own records

## Rollback (if needed)

If you need to revert to previous rules:

1. In Firebase Console → Firestore → Rules
2. Click the **"Rollback"** button (top right)
3. Select a previous version
4. Click **"Restore"**
5. Click **"Publish"**

## Security Rules Syntax

Key concepts in the rules file:

- `match /path/{wildcard}`: Matches documents at the specified path
- `allow read`: Permits reading documents
- `allow write`: Permits both creating and deleting documents
- `allow create`, `allow update`, `allow delete`: Fine-grained control
- `request.auth.uid`: Current user's ID
- `resource.data`: Data in the document being accessed
- `isAuthenticated()`: Returns true if user is logged in
- Helper functions: Custom functions to reduce code duplication

## Best Practices

✅ Always test rules before deploying to production
✅ Use helper functions to keep rules DRY
✅ Default deny all at the end (catch-all rule)
✅ Use `request.auth.uid` to enforce user ownership
✅ Review rules regularly as app requirements change
✅ Use Firestore Rules Simulator to test complex scenarios

## Need Help?

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Common Security Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-patterns)
- Firebase Console shows syntax errors in red - review those carefully
