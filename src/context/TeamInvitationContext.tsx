import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { TeamInvite } from "../types";
import { useAuth } from "./AuthContext";

interface TeamInvitationContextType {
  pendingInvites: TeamInvite[];
  sentInvites: TeamInvite[];
  loading: boolean;
  acceptInvite: (inviteId: string) => Promise<boolean>;
  rejectInvite: (inviteId: string) => Promise<boolean>;
  removeMember: (userId: string) => Promise<boolean>;
  sendInvite: (username: string) => Promise<boolean>;
  fetchInvites: () => Promise<void>;
}

const TeamInvitationContext = createContext<
  TeamInvitationContextType | undefined
>(undefined);

export const TeamInvitationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentUser } = useAuth();
  const [pendingInvites, setPendingInvites] = useState<TeamInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    if (!currentUser || !db) return;

    setLoading(true);
    try {
      // Fetch pending invites for current user
      const q1 = query(
        collection(db, "teamInvites"),
        where("toUserId", "==", currentUser.id),
        where("status", "==", "pending"),
      );
      const snapshot1 = await getDocs(q1);
      const pending = snapshot1.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TeamInvite,
      );
      setPendingInvites(pending);

      // Fetch sent invites by current user
      const q2 = query(
        collection(db, "teamInvites"),
        where("fromUserId", "==", currentUser.id),
      );
      const snapshot2 = await getDocs(q2);
      const sent = snapshot2.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as TeamInvite,
      );
      setSentInvites(sent);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
    // Refresh invites every 5 seconds
    const interval = setInterval(fetchInvites, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const acceptInvite = async (inviteId: string): Promise<boolean> => {
    try {
      if (!currentUser || !db) return false;

      // Update invite status to accepted
      const inviteRef = doc(db, "teamInvites", inviteId);
      await updateDoc(inviteRef, {
        status: "accepted",
        acceptedAt: serverTimestamp(),
      });

      // Add member to team (create a team membership record)
      await addDoc(collection(db, "teamMembers"), {
        teamLeaderId: pendingInvites.find((i) => i.id === inviteId)?.fromUserId,
        memberId: currentUser.id,
        joinedAt: serverTimestamp(),
        status: "active",
      });

      await fetchInvites();
      return true;
    } catch (error) {
      console.error("Error accepting invite:", error);
      return false;
    }
  };

  const rejectInvite = async (inviteId: string): Promise<boolean> => {
    try {
      if (!db) return false;
      const inviteRef = doc(db, "teamInvites", inviteId);
      await updateDoc(inviteRef, {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });

      await fetchInvites();
      return true;
    } catch (error) {
      console.error("Error rejecting invite:", error);
      return false;
    }
  };

  const removeMember = async (userId: string): Promise<boolean> => {
    try {
      if (!currentUser || !db) return false;

      // Remove team member record
      const q = query(
        collection(db, "teamMembers"),
        where("teamLeaderId", "==", currentUser.id),
        where("memberId", "==", userId),
      );
      const snapshot = await getDocs(q);

      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(doc(db, "teamMembers", docSnapshot.id));
      }

      return true;
    } catch (error) {
      console.error("Error removing member:", error);
      return false;
    }
  };

  const sendInvite = async (username: string): Promise<boolean> => {
    try {
      if (!currentUser || !db) return false;

      const lowercaseUsername = username.toLowerCase().trim();

      if (!lowercaseUsername) {
        return false;
      }

      // Find user by username (case-insensitive search)
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", lowercaseUsername));
      const querySnapshot = await getDocs(q);

      console.log(
        `Searching for username: "${lowercaseUsername}", found ${querySnapshot.size} results`,
      );

      if (querySnapshot.empty) {
        console.error(`User with username "${lowercaseUsername}" not found`);
        return false;
      }

      const targetUser = querySnapshot.docs[0];
      const targetUserId = targetUser.id;

      // Prevent inviting yourself
      if (targetUserId === currentUser.id) {
        console.warn("Cannot invite yourself");
        return false;
      }

      // Create invitation
      await addDoc(collection(db, "teamInvites"), {
        fromUserId: currentUser.id,
        fromUsername: currentUser.username,
        toUserId: targetUserId,
        toUsername: lowercaseUsername,
        status: "pending",
        createdAt: serverTimestamp(),
        message: `${currentUser.name} invited you to join their team`,
      });

      console.log(`Invite sent to ${lowercaseUsername}`);
      await fetchInvites();
      return true;
    } catch (error) {
      console.error("Error sending invite:", error);
      return false;
    }
  };

  return (
    <TeamInvitationContext.Provider
      value={{
        pendingInvites,
        sentInvites,
        loading,
        acceptInvite,
        rejectInvite,
        removeMember,
        sendInvite,
        fetchInvites,
      }}
    >
      {children}
    </TeamInvitationContext.Provider>
  );
};

export const useTeamInvitation = () => {
  const context = useContext(TeamInvitationContext);
  if (!context) {
    throw new Error(
      "useTeamInvitation must be used within TeamInvitationProvider",
    );
  }
  return context;
};
