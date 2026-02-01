import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * This utility function fixes existing usernames by converting them to lowercase
 * Run this once to migrate existing data
 */
export const fixExistingUsernames = async () => {
  try {
    if (!db) {
      console.error("Firebase database not initialized");
      return { success: false, error: "Database not initialized" };
    }
    console.log("Starting username migration...");
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    let updatedCount = 0;

    for (const docSnap of snapshot.docs) {
      const userData = docSnap.data();
      const username = userData.username;

      // If username exists and is not all lowercase, update it
      if (username && username !== username.toLowerCase()) {
        console.log(`Updating ${username} to ${username.toLowerCase()}`);
        await updateDoc(doc(db, "users", docSnap.id), {
          username: username.toLowerCase(),
        });
        updatedCount++;
      }
    }

    console.log(`Migration complete! Updated ${updatedCount} usernames`);
    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error("Error during username migration:", error);
    return { success: false, error };
  }
};

/**
 * List all existing usernames for debugging
 */
export const listAllUsernames = async () => {
  try {
    if (!db) {
      console.error("Firebase database not initialized");
      return [];
    }
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const usernames: {
      id: string;
      name: string;
      username: string;
      email: string;
    }[] = [];

    snapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      usernames.push({
        id: docSnap.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
      });
    });

    console.table(usernames);
    return usernames;
  } catch (error) {
    console.error("Error listing usernames:", error);
    return [];
  }
};
