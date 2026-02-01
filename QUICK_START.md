# ⚡ Quick Start - 5 Minute Setup

## Step 1️⃣: Update Firestore Rules (2 minutes)

### Your Task:

Go to Firebase Console and publish new security rules.

### How:

1. Open: https://console.firebase.google.com/
2. Select: `task-management-system-c9a45`
3. Click: **Firestore Database** (left sidebar)
4. Click: **Rules** tab
5. **Delete** everything in the rules editor
6. **Paste** this code:

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

7. Click: **Publish** button (bottom right)
8. Wait: For "Rules updated" confirmation (5-10 seconds)

✅ **Done!**

---

## Step 2️⃣: Start Development Server (1 minute)

```bash
npm run dev
```

Your app will open at: `http://localhost:5173`

---

## Step 3️⃣: Test Team Features (2 minutes)

### Create First Account

1. Click **Sign Up**
2. Fill in:
   - Email: `user1@test.com`
   - Password: `test1234`
   - Name: `User One`
   - Username: `user1` (← this is new!)
3. Click **Sign Up**

### Create Second Account

1. Open new browser tab/window
2. Go to `http://localhost:5173`
3. Click **Sign Up**
4. Fill in:
   - Email: `user2@test.com`
   - Password: `test1234`
   - Name: `User Two`
   - Username: `user2`
5. Click **Sign Up**

### Send Team Invitation

1. Go back to **User One** tab
2. Click **Team** (in sidebar)
3. Scroll to "Recruit Team Members"
4. Enter: `user2`
5. Click **Send Invite**
6. See green toast: "Invite sent to user2"

### Accept Invitation

1. Go to **User Two** tab
2. Click bell 🔔 icon (top right) - should show red badge
3. Click **Invitations** (or bell icon)
4. Find invitation from "User One"
5. Click **Accept**
6. See green toast: "Invitation accepted"

### Verify Team Member Appears

1. Go back to **User One** tab
2. Refresh page (Ctrl+R)
3. Go to **Team**
4. Should see "User Two" in team members list

🎉 **Success! Team features are working!**

---

## Common Issues & Fixes

| Issue                     | Fix                                                    |
| ------------------------- | ------------------------------------------------------ |
| "Permission denied" error | Rules not published - go back to Step 1                |
| "User not found"          | Username must be exactly "user2" (case doesn't matter) |
| Team member not appearing | Wait 5 seconds and refresh page                        |
| No badge on bell icon     | Check browser console for errors                       |

---

## What's New in This App?

✨ **New Features:**

- ✅ Username field during signup
- ✅ Invite team members by username
- ✅ Accept/reject invitations
- ✅ View team members
- ✅ Remove members from team
- ✅ Promote/demote team members
- ✅ Notification bell with badge
- ✅ Dedicated invitations page
- ✅ Toast notifications for all actions

🎨 **UI Updates:**

- Modern glassmorphism design
- Responsive navigation
- Real-time updates
- Better error handling

---

## Files to Read

**After setup works:**

1. **[FIRESTORE_RULES_UPDATE.md](./FIRESTORE_RULES_UPDATE.md)** - Detailed setup guide
2. **[TEAM_FEATURES_GUIDE.md](./TEAM_FEATURES_GUIDE.md)** - Complete feature documentation
3. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Full technical overview

---

## Need Help?

**If something goes wrong:**

1. Check browser console: Press `F12` → see Console tab
2. Look for red error messages
3. Common issue: "Missing or insufficient permissions"
   - → Go back to Step 1 and republish rules
   - → Wait 10 seconds after publishing
   - → Refresh browser

**Firebase Firestore rules can take up to 1 minute to fully propagate**

---

## Next Features to Try

Once team features work:

- ✅ Create tasks and assign to team members
- ✅ Create projects for collaboration
- ✅ View team member's tasks
- ✅ Comment on tasks
- ✅ Change dark/light theme

---

**That's it! Enjoy your collaborative task manager! 🚀**

Last updated: January 2024
