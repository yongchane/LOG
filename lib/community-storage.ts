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

    // 문서 ID를 roster에 저장
    await updateDoc(docRef, { id: docRef.id });
    communityRoster.id = docRef.id;

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

// 좋아요 토글
export async function toggleLike(rosterId: string): Promise<void> {
  const userId = getUserId();

  try {
    // Firestore에서 rosterId로 문서 직접 참조
    const rosterRef = doc(db, "rosters", rosterId);
    const rostersRef = collection(db, "rosters");
    const querySnapshot = await getDocs(rostersRef);

    let currentData: any = null;
    querySnapshot.forEach((docSnapshot) => {
      if (docSnapshot.id === rosterId) {
        currentData = docSnapshot.data();
      }
    });

    if (currentData) {
      const likedBy = currentData.likedBy || [];
      const hasLiked = likedBy.includes(userId);

      if (hasLiked) {
        // 좋아요 취소
        await updateDoc(rosterRef, {
          likes: increment(-1),
          likedBy: likedBy.filter((id: string) => id !== userId),
        });
        console.log("Like removed from Firestore");
      } else {
        // 좋아요 추가
        await updateDoc(rosterRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
        });
        console.log("Like added to Firestore");
      }
    } else {
      console.error("Roster not found with ID:", rosterId);
    }
  } catch (error) {
    console.error("Error toggling like in Firestore:", error);
    // Fallback to local storage
    const STORAGE_KEY = "lol-roster-community";
    const rosters = getFromLocalStorage();
    const roster = rosters.find((r) => r.id === rosterId);

    if (roster) {
      if (!roster.likedBy) roster.likedBy = [];
      const hasLiked = roster.likedBy.includes(userId);

      if (hasLiked) {
        // 좋아요 취소
        roster.likes = Math.max(0, roster.likes - 1);
        roster.likedBy = roster.likedBy.filter((id) => id !== userId);
      } else {
        // 좋아요 추가
        roster.likes += 1;
        roster.likedBy.push(userId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
    }
  }
}

// 사용자가 좋아요를 눌렀는지 확인
export function hasUserLiked(roster: CommunityRoster): boolean {
  const userId = getUserId();
  return roster.likedBy?.includes(userId) || false;
}

// 좋아요 추가 (기존 함수 - 하위 호환성을 위해 유지)
export async function addLike(rosterId: string): Promise<void> {
  await toggleLike(rosterId);
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
    // Firestore에서 rosterId로 문서 직접 참조
    const rosterRef = doc(db, "rosters", rosterId);
    await updateDoc(rosterRef, {
      comments: arrayUnion(comment),
    });
    console.log("Comment added to Firestore for doc:", rosterId);
  } catch (error) {
    console.error("Error adding comment to Firestore:", error);
    // Fallback to local storage
    const STORAGE_KEY = "lol-roster-community";
    const rosters = getFromLocalStorage();
    const roster = rosters.find((r) => r.id === rosterId);

    if (roster) {
      roster.comments.push(comment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
      console.log("Comment saved to local storage");
    } else {
      console.error("Roster not found in local storage either");
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
