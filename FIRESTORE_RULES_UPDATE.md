# Firestore Rules Update - REQUIRED FOR TEAM FEATURES

## ⚠️ CRITICAL: Update These Rules Now

Your app has new team collaboration features that require Firestore security rules to be updated. **Without this update, team invitations will not work.**

## Quick Setup (2 minutes)

### Step 1: Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `task-management-system-c9a45`

### Step 2: Navigate to Firestore Rules

1. Click **Firestore Database** (left sidebar)
2. Click **Rules** tab (top of page)

### Step 3: Copy & Paste New Rules

**Delete the existing rules completely** and paste this:

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

### Step 4: Publish Rules

1. Click **Publish** button (bottom right)
2. Wait for the status to show "Rules updated" (usually 5-10 seconds)
3. Done! ✅

## What Changed?

These new rules enable:

- **Team Invitations**: Send and receive team member invitations by username
- **Team Members**: Track team membership and roles (admin/member)
- **User Search**: All users can search other users by username to send invites
- **Invitation Management**: Accept/reject/delete invitations

## How Team Features Work

1. **Sign up** → Create account with username
2. **Go to Team page** → Click "Recruit Team Members"
3. **Enter username** → Search for other users
4. **Send invite** → User receives notification
5. **User accepts** → They appear on your team
6. **Manage team** → Remove members, promote/demote (admin only)

## Verification

After publishing rules, test the team features:

- [ ] Open app and navigate to Team page
- [ ] Enter another user's username in recruit form
- [ ] Click "Send Invite" (should work without errors)
- [ ] Go to Invitations page → Sent Invitations should show new invite
- [ ] Log in as the other user
- [ ] See invitation in Invitations page
- [ ] Accept invitation
- [ ] Go back to Team page as original user
- [ ] See the new member appear in team list

## Troubleshooting

### "User not found" error

- Make sure the username exists (check it in another user's team page)
- Usernames are case-insensitive but must match exactly

### Invitation won't send

- Check browser console (F12) for detailed error
- Verify rules are published (check timestamp in Rules tab)
- Wait 5 seconds after publishing and try again

### "Missing or insufficient permissions" error

- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page
- Verify rules are fully published

## Rules Explanation

The new rules allow:

**teamInvites collection:**

- Anyone can create an invite (no restrictions)
- Users can only read their own invites (sent or received)
- Users can only update/delete their own invites
- Prevents unauthorized access to other users' invitations

**teamMembers collection:**

- Authenticated users can read/write team member data
- Allows teams to manage their members

**users collection:**

- All authenticated users can read all user profiles
- Users can only modify their own profile
- Enables username search for invitations

## Need Help?

If something goes wrong:

1. Check Firebase Console → Firestore → Data tab to verify collections exist
2. Look for error messages in browser console (F12)
3. Ensure you're publishing the rules (not just drafting)
4. Try refreshing the app after rules are published

---

**Done!** Your app now has full team collaboration features. 🎉
