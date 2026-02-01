import { useEffect } from "react";
import { useTeamInvitation } from "../context/TeamInvitationContext";
import { useToast } from "../context/ToastContext";
import { CheckCircle, XCircle, Inbox, Mail } from "lucide-react";

export const InvitationsPage = () => {
  const {
    pendingInvites,
    sentInvites,
    loading,
    fetchInvites,
    acceptInvite,
    rejectInvite,
  } = useTeamInvitation();
  const { showToast } = useToast();

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleAccept = async (inviteId: string) => {
    const success = await acceptInvite(inviteId);
    if (success) {
      showToast("Invitation accepted! You joined the team", "success");
    } else {
      showToast("Failed to accept invitation", "error");
    }
  };

  const handleReject = async (inviteId: string) => {
    const success = await rejectInvite(inviteId);
    if (success) {
      showToast("Invitation rejected", "info");
    } else {
      showToast("Failed to reject invitation", "error");
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-rose-600 bg-clip-text text-transparent">
          Invitations
        </h1>
        <p className="text-cyan-700/70 dark:text-cyan-300/70 mt-1 font-medium">
          Manage your team invitations
        </p>
      </div>

      {/* Pending Invitations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-cyan-500" />
          <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            Pending Invitations ({pendingInvites.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-cyan-700/70 dark:text-cyan-300/70">
            Loading...
          </div>
        ) : pendingInvites.length === 0 ? (
          <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-8 text-center">
            <Inbox className="w-12 h-12 text-cyan-500/50 mx-auto mb-3" />
            <p className="text-cyan-700/70 dark:text-cyan-300/70 font-medium">
              No pending invitations at the moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-cyan-100">
                      {invite.message}
                    </p>
                    <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70 mt-1">
                      Sent on {formatDate(invite.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(invite.id)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/30 hover:to-cyan-400/30 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60 dark:border-cyan-500/40 rounded-xl transition-all duration-200 font-semibold"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(invite.id)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500/20 to-rose-400/20 hover:from-rose-500/30 hover:to-rose-400/30 text-rose-700 dark:text-rose-300 border border-rose-400/60 dark:border-rose-500/40 rounded-xl transition-all duration-200 font-semibold"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Invitations */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            Sent Invitations ({sentInvites.length})
          </h2>
        </div>

        {sentInvites.length === 0 ? (
          <div className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-8 text-center">
            <Mail className="w-12 h-12 text-rose-500/50 mx-auto mb-3" />
            <p className="text-cyan-700/70 dark:text-cyan-300/70 font-medium">
              No sent invitations yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentInvites.map((invite) => (
              <div
                key={invite.id}
                className="glass-effect backdrop-blur-sm dark:bg-slate-cyber-800/60 border border-cyan-300/40 dark:border-cyan-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-cyan-100">
                      @{invite.toUsername}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70">
                        Sent on {formatDate(invite.createdAt)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          invite.status === "pending"
                            ? "bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 text-yellow-700 dark:text-yellow-300 border border-yellow-400/60"
                            : invite.status === "accepted"
                              ? "bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/60"
                              : "bg-gradient-to-r from-rose-500/20 to-rose-400/20 text-rose-700 dark:text-rose-300 border border-rose-400/60"
                        }`}
                      >
                        {invite.status.charAt(0).toUpperCase() +
                          invite.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
