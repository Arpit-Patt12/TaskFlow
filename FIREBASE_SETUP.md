# Firebase Setup Guide

Your Task Manager app has been successfully integrated with Firebase Authentication and Firestore Database!

## What Was Changed

1. **Authentication**: Replaced localStorage demo auth with Firebase Authentication
2. **Database**: Replaced localStorage data storage with Firestore real-time database
3. **User Data**: All user data now syncs in real-time across devices

## Firebase Configuration

The Firebase credentials are already configured in `.env.local`:

```
VITE_FIREBASE_API_KEY=AIzaSyCzmJ-FkSjx7oYiit2SFYWi-hovLn-Y8ho
VITE_FIREBASE_AUTH_DOMAIN=task-management-system-c9a45.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=task-management-system-c9a45
VITE_FIREBASE_STORAGE_BUCKET=task-management-system-c9a45.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1046965938063
VITE_FIREBASE_APP_ID=1:1046965938063:web:bab2e6634e81df18788dfa
```

## Required Firebase Console Setup

### 1. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `task-management-system-c9a45`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### 2. Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in production mode** (we'll add rules next)
4. Select your preferred location
5. Click **Enable**

### 3. Configure Firestore Security Rules

Copy and paste these rules in **Firestore Database** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - readable by all authenticated users for team search
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Team invites - for team collaboration features
    match /teamInvites/{inviteId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (
        resource.data.fromUserId == request.auth.uid ||
        resource.data.toUserId == request.auth.uid
      );
      allow update: if request.auth != null && (
        resource.data.toUserId == request.auth.uid ||
        resource.data.fromUserId == request.auth.uid
      );
      allow delete: if request.auth != null &&
        resource.data.fromUserId == request.auth.uid;
    }

    // Team members - track who is part of which team
    match /teamMembers/{memberId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }

    match /tasks/{taskId} {
      allow read, write: if request.auth != null &&
        (resource == null || resource.data.createdBy == request.auth.uid);
      allow create: if request.auth != null;
    }

    match /projects/{projectId} {
      allow read, write: if request.auth != null &&
        (resource == null || resource.data.createdBy == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

Click **Publish** to apply the rules.

### 1. **users** Collection

- Document ID: Firebase Auth UID
- Fields:
  - `name` (string): User's display name
  - `email` (string): User's email
  - `username` (string): Unique username (lowercase, for team search)
  - `role` (string): User role (member/admin)
  - `createdAt` (string): Account creation date

### 2. **teamInvites** Collection (Team Collaboration)

- Document ID: Auto-generated
- Fields:
  - `fromUserId` (string): User ID of person sending invite
  - `toUserId` (string): User ID of person receiving invite
  - `fromUsername` (string): Username of sender
  - `toUsername` (string): Username of recipient
  - `status` (string): pending | accepted | rejected
  - `createdAt` (string): When invite was sent
  - `respondedAt` (string, optional): When invite was responded to

### 3. **teamMembers** Collection (Team Metadata)

- Document ID: Auto-generated
- Fields:
  - `teamLeaderId` (string): User ID of team leader
  - `memberId` (string): User ID of team member
  - `memberUsername` (string): Username of member
  - `memberName` (string): Display name of member
  - `role` (string): admin | member
  - `joinedAt` (string): When member joined team
  - `isAdmin` (boolean): Whether user is team admin

### 4. **tasks** Collection

- Document ID: Auto-generated
- Fields:
  - `title` (string): Task title
  - `description` (string): Task description
  - `status` (string): pending | in-progress | completed
  - `priority` (string): low | medium | high
  - `assignedTo` (string): User ID of assignee
  - `dueDate` (string): Due date in ISO format
  - `categoryId` (string): Project/category ID
  - `createdBy` (string): User ID of creator
  - `createdAt` (string): Creation timestamp
  - `updatedAt` (string): Last update timestamp
  - `comments` (array): Array of comment objects

### 5. **projects** Collection

- Document ID: Auto-generated
- Fields:
  - `name` (string): Project name
  - `color` (string): Hex color code
  - `createdBy` (string): User ID of creator
  - `createdAt` (string): Creation timestamp

## Running the App

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser to the provided URL (usually http://localhost:5173)

3. Create a new account using the Sign Up page

4. Start creating tasks and projects!

## Testing Checklist

- [ ] Can create a new account with username
- [ ] Can log in with created credentials
- [ ] Can see team members on Team page (initially none)
- [ ] **Can send team invitation by username**
- [ ] Can see sent invitations on Invitations page
- [ ] Can navigate to Invitations from header bell icon
- [ ] Can accept pending team invitation
- [ ] Can see accepted members on Team page
- [ ] Can remove team members (with confirmation modal)
- [ ] Can promote/demote team members (admin role)
- [ ] Can create a new task
- [ ] Task appears in the list immediately
- [ ] Can edit a task
- [ ] Can delete a task
- [ ] Can create a project
- [ ] Can assign tasks to projects
- [ ] Can add comments to tasks
- [ ] Can change task status (drag & drop in Kanban view)
- [ ] Can log out
- [ ] Can log back in and see all data persisted

## Important Notes

1. **Real-time Sync**: All changes sync in real-time across all browser tabs and devices
2. **User Isolation**: Each user only sees their own tasks and projects
3. **No Demo Data**: The app starts empty - you need to create your own data
4. **Security**: All data access is protected by Firestore security rules
5. **Username-based Teams**: Invite users by their unique username (case-insensitive)
6. **Team Acceptance**: Invited users must accept invitations to join your team
7. **Admin Controls**: Team leaders can promote/demote members and remove them from team
8. **Real-time Team Sync**: Team member list updates every 5 seconds automatically

## Troubleshooting

### Authentication Errors

- Ensure Email/Password is enabled in Firebase Console
- Check that your Firebase config in `.env.local` is correct

### Firestore Permission Denied

- Verify security rules are published in Firebase Console
- Make sure you're logged in
- Check browser console for detailed error messages
- **For team features**: Ensure rules include `teamInvites` and `teamMembers` collections (see updated rules above)

### Team Invitations Not Working

- Verify `teamInvites` collection rules are published (see step 3 above)
- Check that invited user's username exists (exact case-insensitive match)
- Verify sender is logged in with correct account
- Check browser console for error messages

### No Data Showing

- Create a new task to test the connection
- Check Firestore Console to see if data is being saved
- Verify you're logged in with the correct account
- For team features, ensure at least one other user account exists with a username

## Support

For Firebase-specific issues, refer to:

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

Enjoy your real-time task management app!
