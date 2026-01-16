import { UserRoster } from "@/types";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  increment,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface CommunityRoster extends UserRoster {
  authorName: string;
  likes: number;
  likedBy?: string[];
  comments: Comment[];
  sharedAt: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

const USER_NAME_KEY = "lol-roster-username";
const USER_ID_KEY = "lol-roster-userid";

// 사용자 ID 가져오기 (없으면 생성)
function getUserId(): string {
  if (typeof window === "undefined") return "";

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

// 커뮤니티 로스터 저장
export async function saveToCommunity(
  roster: UserRoster,
  authorName: string
): Promise<CommunityRoster> {
  const communityRoster: CommunityRoster = {
    ...roster,
    authorName,
    likes: 0,
    likedBy: [],
    comments: [],
    sharedAt: Date.now(),
  };

  try {
    // Firestore에 저장
    const rostersRef = collection(db, "rosters");
    const docRef = await addDoc(rostersRef, {
      ...communityRoster,
      sharedAt: Timestamp.fromMillis(communityRoster.sharedAt),
    });

    console.log("Roster saved to Firestore with ID:", docRef.id);
    return communityRoster;
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    // Fallback to local storage
    saveToLocalStorage(communityRoster);
    return communityRoster;
  }
}

// 로컬 스토리지 저장 (Fallback)
function saveToLocalStorage(roster: CommunityRoster): void {
  const STORAGE_KEY = "lol-roster-community";
  const existingRosters = getFromLocalStorage();
  existingRosters.unshift(roster);

  if (existingRosters.length > 100) {
    existingRosters.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRosters));
}

// 로컬 스토리지에서 가져오기 (Fallback)
function getFromLocalStorage(): CommunityRoster[] {
  if (typeof window === "undefined") return [];

  try {
    const STORAGE_KEY = "lol-roster-community";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load from local storage:", error);
    return [];
  }
}

// 커뮤니티 로스터 가져오기
export async function getCommunityRosters(): Promise<CommunityRoster[]> {
  try {
    const rostersRef = collection(db, "rosters");
    const q = query(rostersRef, orderBy("sharedAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);

    const rosters: CommunityRoster[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rosters.push({
        ...data,
        id: data.id || doc.id,
        sharedAt:
          data.sharedAt instanceof Timestamp
            ? data.sharedAt.toMillis()
            : data.sharedAt,
        likedBy: data.likedBy || [],
      } as CommunityRoster);
    });

    console.log(`Loaded ${rosters.length} rosters from Firestore`);
    return rosters;
  } catch (error) {
    console.error("Error loading from Firestore:", error);
    // Fallback to local storage
    return getFromLocalStorage();
  }
}

// 좋아요 추가
export async function addLike(rosterId: string): Promise<void> {
  const userId = getUserId();

  try {
    // Firestore에서 rosterId로 문서 찾기
    const rostersRef = collection(db, "rosters");
    const querySnapshot = await getDocs(rostersRef);

    let targetDocId: string | null = null;
    querySnapshot.forEach((docSnapshot) => {
      if (docSnapshot.data().id === rosterId) {
        targetDocId = docSnapshot.id;
      }
    });

    if (targetDocId) {
      const rosterRef = doc(db, "rosters", targetDocId);
      await updateDoc(rosterRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
      console.log("Like added to Firestore");
    }
  } catch (error) {
    console.error("Error adding like to Firestore:", error);
    // Fallback to local storage
    const STORAGE_KEY = "lol-roster-community";
    const rosters = getFromLocalStorage();
    const roster = rosters.find((r) => r.id === rosterId);

    if (roster && (!roster.likedBy || !roster.likedBy.includes(userId))) {
      roster.likes += 1;
      if (!roster.likedBy) roster.likedBy = [];
      roster.likedBy.push(userId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
    }
  }
}

// 댓글 추가
export async function addComment(
  rosterId: string,
  author: string,
  content: string
): Promise<void> {
  const comment: Comment = {
    id: Date.now().toString(),
    author,
    content,
    timestamp: Date.now(),
  };

  try {
    // Firestore에서 rosterId로 문서 찾기
    const rostersRef = collection(db, "rosters");
    const querySnapshot = await getDocs(rostersRef);

    let targetDocId: string | null = null;
    querySnapshot.forEach((docSnapshot) => {
      if (docSnapshot.data().id === rosterId) {
        targetDocId = docSnapshot.id;
      }
    });

    if (targetDocId) {
      const rosterRef = doc(db, "rosters", targetDocId);
      await updateDoc(rosterRef, {
        comments: arrayUnion(comment),
      });
      console.log("Comment added to Firestore");
    }
  } catch (error) {
    console.error("Error adding comment to Firestore:", error);
    // Fallback to local storage
    const STORAGE_KEY = "lol-roster-community";
    const rosters = getFromLocalStorage();
    const roster = rosters.find((r) => r.id === rosterId);

    if (roster) {
      roster.comments.push(comment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
    }
  }
}

// 사용자 이름 저장/가져오기
export function saveUserName(name: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_NAME_KEY, name);
  }
}

export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USER_NAME_KEY) || "";
}

export { getUserId };
