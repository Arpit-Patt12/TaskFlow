# Team Features - Quick Reference Guide

## New Features Added ✨

### 1. **Usernames**

- Each user has a unique username during signup
- Usernames are case-insensitive and lowercase for searches
- Used to invite team members

### 2. **Team Invitations**

- Send invites by searching users by username
- Invites show in Invitations page (pending/sent sections)
- Accept or reject team invitations
- Only accepted members appear on your Team page

### 3. **Team Management**

- View all team members on Team page
- Admin can promote/demote team members
- Team leader can remove members (with confirmation)
- Real-time team list updates (every 5 seconds)

### 4. **Notifications**

- Invitation bell icon in header (top-right)
- Red badge shows count of pending invitations
- "Invitations" link in sidebar (with badge)
- Toast notifications for actions (send invite, accept, reject)

## File Structure - What Was Added

### New Files Created:

```
src/
├── context/
│   ├── TeamInvitationContext.tsx      ← Team invitation management
│   └── ToastContext.tsx               ← Global toast notifications
├── pages/
│   └── InvitationsPage.tsx            ← View/manage invitations
└── utils/
    └── usernameMigration.ts           ← Fix existing usernames
```

### Files Modified:

```
src/
├── App.tsx                            ← Added routes & providers
├── types/index.ts                     ← Added Username & TeamInvite types
├── components/Common/
│   ├── Header.tsx                     ← Added notification bell
│   ├── Sidebar.tsx                    ← Added Invitations link
│   └── Toast.tsx                      ← Global toast component
├── context/
│   ├── AuthContext.tsx                ← Added username to signup
│   └── TaskContext.tsx                ← Only fetch team members
├── pages/
│   ├── SignupPage.tsx                 ← Added username input
│   └── TeamPage.tsx                   ← Full team management UI
└── FIREBASE_SETUP.md                  ← Updated with new rules
```

## Key Features Explained

### Sending an Invitation

1. Go to Team page
2. Click "Recruit Team Members"
3. Enter username (case-insensitive)
4. Click "Send Invite"
5. Toast shows success/error
6. Invite appears in Invitations page

### Receiving an Invitation

1. See red badge on Invitations icon in header
2. Click notification bell or Invitations link
3. Find invitation under "Pending Invitations"
4. Click "Accept" or "Reject"
5. If accepted, you appear on their team

### Managing Team Members (Admin)

1. Go to Team page
2. Hover over member card to see delete button
3. Click delete (trash icon) to remove
4. Confirm removal in modal
5. Click promote/demote buttons to change role

## Firebase Collections Created

### teamInvites Collection

```
Document Structure:
{
  fromUserId: "user123",
  toUserId: "user456",
  fromUsername: "john_doe",
  toUsername: "jane_smith",
  status: "pending" | "accepted" | "rejected",
  createdAt: "2024-01-15T10:30:00Z",
  respondedAt: "2024-01-15T10:35:00Z" (optional)
}
```

### teamMembers Collection

```
Document Structure:
{
  teamLeaderId: "user123",
  memberId: "user456",
  memberUsername: "jane_smith",
  memberName: "Jane Smith",
  role: "admin" | "member",
  joinedAt: "2024-01-15T10:35:00Z",
  isAdmin: true
}
```

## Important Notes ⚠️

1. **Must Update Firestore Rules First**
   - See `FIRESTORE_RULES_UPDATE.md` for instructions
   - Without rules update, team features won't work
   - Rules allow reading users and writing invitations

2. **Username is Case-Insensitive**
   - "John_Doe" = "john_doe" = "JOHN_DOE"
   - Internally stored as lowercase
   - Search works regardless of case

3. **Only Team Members Show**
   - Users only see: themselves + accepted team members
   - All database users are NOT shown
   - No more "Team" page showing random users

4. **Real-time Updates**
   - Team member list refreshes every 5 seconds
   - Invitations refresh automatically
   - Changes sync across browser tabs

5. **Admin Rights**
   - First user in team is admin by default
   - Admins can promote/demote other members
   - Any team member can leave (set role to member)

## Testing Team Features

### Test Scenario 1: Basic Invitation

```
1. Create Account A with username "alice"
2. Create Account B with username "bob"
3. Log in as Alice
4. Go to Team page
5. Enter "bob" in recruit form
6. Click "Send Invite"
7. Log in as Bob (new tab)
8. See invitation in Invitations page
9. Click "Accept"
10. Go back to Alice's Team page
11. See Bob in team list
```

### Test Scenario 2: Admin Controls

```
1. Complete Test Scenario 1 (Alice + Bob)
2. As Alice, hover over Bob's card
3. Click "Demote" button
4. Bob's role changes from "Admin" to "Member"
5. Click "Promote" button
6. Bob's role changes back to "Admin"
7. Click delete (trash icon)
8. Confirm removal in modal
9. Bob disappears from team list
```

### Test Scenario 3: Multiple Teams

```
1. Create 3 accounts: Alice, Bob, Charlie
2. Alice invites Bob and Charlie
3. Bob invites Charlie
4. Log in as Charlie
5. See 2 invitations (from Alice, from Bob)
6. Accept Alice's invite
7. Log in as Bob - Charlie appears on his team
8. As Charlie, accept Bob's invite
9. Alice and Bob both appear on Charlie's team
```

## Firestore Rules - What They Allow

| Collection  | Read                        | Write            | Notes                        |
| ----------- | --------------------------- | ---------------- | ---------------------------- |
| users       | All authenticated users     | Own profile only | Enables username search      |
| teamInvites | Own invites (sent/received) | Own invites      | Prevents unauthorized access |
| teamMembers | All authenticated users     | Team management  | Allows team operations       |
| tasks       | Own tasks                   | Own tasks        | Existing functionality       |
| projects    | Own projects                | Own projects     | Existing functionality       |

## Troubleshooting

### Problem: "User not found" when inviting

**Solution:**

- Check username spelling (case-insensitive but must match)
- Verify user account exists
- Try refreshing the page

### Problem: Can't send invite - permission error

**Solution:**

- Update Firestore rules (see `FIRESTORE_RULES_UPDATE.md`)
- Clear browser cache
- Refresh page after rules are published

### Problem: Invited user doesn't see invitation

**Solution:**

- Check their Invitations page
- Refresh page (Cmd+R or Ctrl+R)
- Check browser console for errors
- Verify internet connection

### Problem: Team member doesn't appear after accepting

**Solution:**

- Wait 5 seconds (real-time sync)
- Refresh the page
- Log out and log back in
- Check Firebase console to verify invite was accepted

## Toast Notification Meanings

| Type                | Message               | Action                     |
| ------------------- | --------------------- | -------------------------- |
| ✓ Success (Green)   | "Invite sent to..."   | Invitation was created     |
| ✓ Success (Green)   | "Invitation accepted" | You joined a team          |
| ✓ Success (Green)   | "Member removed"      | Member left the team       |
| ✗ Error (Red)       | "User not found"      | Username doesn't exist     |
| ✗ Error (Red)       | "Permission denied"   | Firebase rules need update |
| ⓘ Info (Blue)       | "Action completed"    | General info messages      |
| ⚠️ Warning (Yellow) | Action canceled       | Operation not completed    |

## Code Overview

### TeamInvitationContext.tsx

- `sendInvite(username)` - Send invitation to user
- `acceptInvite(inviteId)` - Accept invitation
- `rejectInvite(inviteId)` - Reject invitation
- `removeMember(userId)` - Remove from team
- `fetchInvites()` - Get all invitations
- Real-time auto-refresh every 5 seconds

### ToastContext.tsx

- `showToast(message, type)` - Show notification
- Auto-dismisses after 4 seconds
- Supports: success, error, warning, info types

### AuthContext.tsx (Updated)

- Now captures username during signup
- Validates username format (3+ chars, alphanumeric, -\_)
- Stores username in lowercase

### TaskContext.tsx (Updated)

- Changed to fetch only team members
- Queries teamInvites collection
- User list now reflects team membership

---

**All features are ready!** Just update the Firestore rules and you're good to go. 🚀
