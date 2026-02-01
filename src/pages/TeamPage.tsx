import { useTasks } from "../context/TaskContext";
import { useState } from "react";
import {
  Users,
  Mail,
  Briefcase,
  Send,
  UserPlus,
  Trash2,
  Settings,
} from "lucide-react";
import { getInitials } from "../utils/dateUtils";
import { useToast } from "../context/ToastContext";
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTeamInvitation } from "../context/TeamInvitationContext";

export const TeamPage = () => {
  const { users, tasks } = useTasks();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { sendInvite, removeMember } = useTeamInvitation();
  const [usernameToInvite, setUsernameToInvite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const getTaskCount = (userId: string) => {
    return tasks.filter((t) => t.assignedTo === userId).length;
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!currentUser) {
        showToast("You must be logged in to invite members", "error");
        setIsLoading(false);
        return;
      }

      if (!usernameToInvite.trim()) {
        showToast("Please enter a username", "error");
        setIsLoading(false);
        return;
      }

      // Check if already in team
      if (users.some((u) => u.username === usernameToInvite.toLowerCase())) {
        showToast("User is already in your team", "info");
        setIsLoading(false);
        return;
      }

      const success = await sendInvite(usernameToInvite);
      if (success) {
        showToast(`Invitation sent to @${usernameToInvite}!`, "success");
        setUsernameToInvite("");
      } else {
        showToast("User not found", "error");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      showToast("Failed to send invitation", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      const success = await removeMember(memberToRemove);
      if (success) {
        showToast("Member removed from team", "success");
        setShowRemoveConfirm(false);
        setMemberToRemove(null);
      } else {
        showToast("Failed to remove member", "error");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showToast("Failed to remove member", "error");
    }
  };

  const handlePromoteMember = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: "admin",
      });
      showToast("Member promoted to admin", "success");
    } catch (error) {
      console.error("Error promoting member:", error);
      showToast("Failed to promote member", "error");
    }
  };

  const handleDemoteMember = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: "member",
      });
      showToast("Member demoted to member role", "success");
    } catch (error) {
      console.error("Error demoting member:", error);
      showToast("Failed to demote member", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent">
          Team
        </h1>
        <p className="text-cyan-700/70 dark:text-cyan-300/70 mt-1 font-medium">
          {users.length} team {users.length === 1 ? "member" : "members"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 relative group"
          >
            {/* Admin Controls */}
            {currentUser?.id === user.id || currentUser?.role === "admin" ? (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setMemberToRemove(user.id);
                    setShowRemoveConfirm(true);
                  }}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cyan-100 dark:text-cyan-100">
                  {user.name}
                </h3>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-gradient-to-r from-violet-500/20 to-violet-400/20 text-violet-700 dark:text-violet-300 border border-violet-400/60"
                      : "bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                <Mail className="w-4 h-4 text-cyan-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-700/70 dark:text-cyan-300/70 font-medium">
                <Briefcase className="w-4 h-4 text-cyan-500" />
                <span>{getTaskCount(user.id)} active tasks</span>
              </div>
            </div>

            {/* Admin action buttons */}
            {currentUser?.role === "admin" && currentUser?.id !== user.id && (
              <div className="flex gap-2 border-t border-cyan-300/30 pt-4">
                {user.role === "member" ? (
                  <button
                    onClick={() => handlePromoteMember(user.id)}
                    className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-violet-500/20 to-violet-400/20 hover:from-violet-500/40 hover:to-violet-400/40 text-violet-700 dark:text-violet-300 border border-violet-400/60 rounded-lg transition-colors font-semibold"
                  >
                    Promote to Admin
                  </button>
                ) : (
                  <button
                    onClick={() => handleDemoteMember(user.id)}
                    className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/40 hover:to-cyan-400/40 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 rounded-lg transition-colors font-semibold"
                  >
                    Demote to Member
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-6 h-6 text-cyan-500" />
          <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            Recruit Team Members
          </h2>
        </div>
        <p className="text-cyan-700/70 dark:text-cyan-300/70 font-medium mb-4">
          Invite team members by their username to collaborate on tasks
        </p>
        <form onSubmit={handleInviteUser} className="flex gap-2">
          <input
            type="text"
            value={usernameToInvite}
            onChange={(e) => setUsernameToInvite(e.target.value)}
            placeholder="Enter username (e.g., john_doe)"
            className="input-modern flex-1 px-4 py-3 bg-white/60 dark:bg-slate-cyber-700/50 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-white transition-all placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-modern-primary px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-rose-400 disabled:to-rose-400 text-white rounded-xl hover:shadow-lg hover:shadow-rose-500/50 transition-all duration-200 font-semibold flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Sending..." : "Invite"}
          </button>
        </form>
      </div>

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirm && memberToRemove && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-effect backdrop-blur-xl dark:bg-slate-cyber-800/90 rounded-3xl shadow-2xl p-8 border border-cyan-300/40 dark:border-cyan-500/30 max-w-md w-full">
            <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              Remove Member?
            </h2>
            <p className="text-cyan-700/70 dark:text-cyan-300/70 mb-6 font-medium">
              Are you sure you want to remove this member from your team? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setMemberToRemove(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/40 hover:to-cyan-400/40 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 rounded-xl transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl hover:shadow-lg hover:shadow-rose-500/50 transition-all font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
