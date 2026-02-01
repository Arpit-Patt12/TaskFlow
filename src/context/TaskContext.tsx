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
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  arrayUnion,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { TaskContextType, Task, Project, User } from "../types";
import { useAuth } from "./AuthContext";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setProjects([]);
      return;
    }

    // Subscribe to tasks with an orderBy. If Firestore requires a composite index we'll fall back to an unordered query and sort client-side.
    let unsubscribeTasks: () => void = () => {};

    const subscribeTasks = (useOrder = true) => {
      const q = useOrder
        ? query(
            collection(db, "tasks"),
            where("createdBy", "==", currentUser.id),
            orderBy("updatedAt", "desc"),
          )
        : query(
            collection(db, "tasks"),
            where("createdBy", "==", currentUser.id),
          );

      return onSnapshot(
        q,
        (snapshot) => {
          const tasksData: Task[] = [];
          snapshot.forEach((docSnap) => {
            tasksData.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as Task);
          });

          if (!useOrder) {
            // fallback: sort client-side by updatedAt desc
            tasksData.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            );
          }

          setTasks(tasksData);
        },
        (error) => {
          // Listener error (for example: requires an index)
          // eslint-disable-next-line no-console
          console.error("Firestore tasks listener error:", error);

          if (
            error?.code === "failed-precondition" ||
            /requires an index/.test(error?.message || "")
          ) {
            // If an index is required, fallback to client-side ordered subscription without orderBy
            // eslint-disable-next-line no-console
            console.warn(
              "Firestore index required for tasks query. Falling back to client-side sorting. Create the index shown in the Firebase console to optimize this query.",
            );
            try {
              unsubscribeTasks();
            } catch (e) {}
            unsubscribeTasks = subscribeTasks(false);
          }
        },
      );
    };

    unsubscribeTasks = subscribeTasks(true);

    // Subscribe to projects with an orderBy and similar fallback as tasks
    let unsubscribeProjects: () => void = () => {};

    const subscribeProjects = (useOrder = true) => {
      const q = useOrder
        ? query(
            collection(db, "projects"),
            where("createdBy", "==", currentUser.id),
            orderBy("updatedAt", "desc"),
          )
        : query(
            collection(db, "projects"),
            where("createdBy", "==", currentUser.id),
          );

      return onSnapshot(
        q,
        (snapshot) => {
          const projectsData: Project[] = [];
          snapshot.forEach((docSnap) => {
            projectsData.push({
              id: docSnap.id,
              ...docSnap.data(),
            } as Project);
          });

          if (!useOrder) {
            projectsData.sort((a, b) =>
              (b as any).updatedAt && (a as any).updatedAt
                ? new Date((b as any).updatedAt).getTime() -
                  new Date((a as any).updatedAt).getTime()
                : 0,
            );
          }

          setProjects(projectsData);
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.error("Firestore projects listener error:", error);

          if (
            error?.code === "failed-precondition" ||
            /requires an index/.test(error?.message || "")
          ) {
            // fallback to unordered client-side sort
            // eslint-disable-next-line no-console
            console.warn(
              "Firestore index required for projects query. Falling back to client-side sorting. Create the index shown in the Firebase console to optimize this query.",
            );
            try {
              unsubscribeProjects();
            } catch (e) {}
            unsubscribeProjects = subscribeProjects(false);
          }
        },
      );
    };

    unsubscribeProjects = subscribeProjects(true);

    return () => {
      unsubscribeTasks();
      unsubscribeProjects();
    };
  }, [currentUser]);

  useEffect(() => {
    // Subscribe to team members who have accepted invitations from current user
    if (!currentUser || !db) {
      setUsers([]);
      return;
    }

    const fetchTeamMembers = async () => {
      try {
        // Get all accepted invitations where current user is the sender
        const invitesQuery = query(
          collection(db, "teamInvites"),
          where("fromUserId", "==", currentUser.id),
          where("status", "==", "accepted"),
        );

        const invitesSnapshot = await getDocs(invitesQuery);
        const teamMemberIds = new Set<string>();

        // Add the current user
        teamMemberIds.add(currentUser.id);

        // Add all users who accepted invitations
        invitesSnapshot.forEach((doc) => {
          const invite = doc.data();
          if (invite.toUserId) {
            teamMemberIds.add(invite.toUserId);
          }
        });

        // Also get invitations where current user received and accepted
        const receivedQuery = query(
          collection(db, "teamInvites"),
          where("toUserId", "==", currentUser.id),
          where("status", "==", "accepted"),
        );

        const receivedSnapshot = await getDocs(receivedQuery);
        receivedSnapshot.forEach((doc) => {
          const invite = doc.data();
          if (invite.fromUserId) {
            teamMemberIds.add(invite.fromUserId);
          }
        });

        // Fetch user data for all team members
        if (teamMemberIds.size > 0) {
          const usersCollection = collection(db, "users");
          const usersSnapshot = await getDocs(usersCollection);
          const usersData: User[] = [];

          usersSnapshot.forEach((docSnap) => {
            if (teamMemberIds.has(docSnap.id)) {
              usersData.push({
                id: docSnap.id,
                ...docSnap.data(),
              } as User);
            }
          });

          setUsers(usersData);
        } else {
          setUsers([]);
        }
      } catch (error: any) {
        // Silently fail for permission errors - just show current user
        if (error?.code === "permission-denied") {
          // If we can't access teamInvites, just show the current user
          setUsers([
            {
              id: currentUser.id,
              email: currentUser.email,
              name: currentUser.name,
              username: currentUser.username,
              role: currentUser.role,
            },
          ]);
        } else {
          console.error("Error fetching team members:", error);
          setUsers([]);
        }
      }
    };

    fetchTeamMembers();
    // Refresh team members every 5 seconds
    const interval = setInterval(fetchTeamMembers, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments">,
  ) => {
    if (!currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const tempTask: Task = {
      id: tempId,
      ...taskData,
      createdBy: currentUser.id,
      createdAt: nowIso,
      updatedAt: nowIso,
      comments: [],
    } as Task;

    // Show task immediately
    setTasks((prev) => [tempTask, ...prev]);

    try {
      await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdBy: currentUser.id,
        createdAt: nowIso,
        updatedAt: nowIso,
        comments: [],
      });
      // onSnapshot will replace local list with authoritative data including real id
    } catch (error) {
      console.error("Error adding task:", error);
      // remove temp task
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const prevTasks = [...tasks];
    const nowIso = new Date().toISOString();

    // Optimistically update locally
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? ({ ...t, ...updates, updatedAt: nowIso } as Task) : t,
      ),
    );

    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: nowIso,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      // revert on failure
      setTasks(prevTasks);
    }
  };

  const deleteTask = async (id: string) => {
    const prevTasks = [...tasks];
    // Optimistically remove locally
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("Error deleting task:", error);
      // revert on failure
      setTasks(prevTasks);
    }
  };

  const addComment = async (taskId: string, text: string) => {
    if (!currentUser) return;

    const newComment = {
      id: `comment${Date.now()}`,
      userId: currentUser.id,
      text,
      date: new Date().toISOString(),
    };

    // Optimistic local update so comment appears instantly
    const prevTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? ({
              ...t,
              comments: [...t.comments, newComment],
              updatedAt: newComment.date,
            } as Task)
          : t,
      ),
    );

    try {
      // Use arrayUnion to safely append a comment server-side without needing the local task state
      await updateDoc(doc(db, "tasks", taskId), {
        comments: arrayUnion(newComment),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      // revert on failure
      setTasks(prevTasks);
    }
  };

  const addProject = async (projectData: Omit<Project, "id" | "taskCount">) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "projects"), {
        ...projectData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const projectRef = doc(db, "projects", id);
      await updateDoc(projectRef, updates);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getTaskById = (id: string) => tasks.find((task) => task.id === id);
  const getProjectById = (id: string) =>
    projects.find((project) => project.id === id);
  const getUserById = (id: string) => users.find((user) => user.id === id);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        users,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        addProject,
        updateProject,
        deleteProject,
        getTaskById,
        getProjectById,
        getUserById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};
