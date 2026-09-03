export type AiPersona = 
  | 'biographer' // Életrajzíró – precíz, krónikás
  | 'friend'     // Barát – közvetlen, támogató
  | 'reporter'   // Riporter – kérdez, kutatja az okokat
  | 'hunter'     // Emlékvadász – érzékek, múlt kutatása
  | 'humorist'   // Humorista – könnyed, derűs
  | 'writer';    // Író – irodalmi, regényes

export interface UserProfile {
  id: string;
  name: string;
  penName: string; // FateBoard jeligéje (pl. ÖregRóka72)
  email: string;
  aiName: string; // pl. Krónikás Gergő
  aiPersona: AiPersona;
  tier: 'free' | 'plus' | 'family';
  streakDays: number;
  totalAudioHours: number;
  totalWords: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  audioDurationSeconds?: number;
  extractedEntities?: string[];
}

export type EntityConfidence = 'verified' | 'hypothesis';

export interface FateEntity {
  id: string;
  name: string;
  type: 'person' | 'place' | 'event' | 'object' | 'school' | 'job' | 'era';
  confidence: EntityConfidence;
  details: string;
  mentionCount: number;
  relatedYears?: string;
  inferredExplanation?: string;
}

export interface ContradictionItem {
  id: string;
  title: string;
  context: string;
  optionA: string;
  optionB: string;
  status: 'pending' | 'resolved';
  resolvedChoice?: string;
}

export type ChapterStatus = 'draft' | 'reviewed' | 'final';

export interface BookChapter {
  id: string;
  title: string;
  timeBracket: string; // pl. "1994. Július"
  orderIndex: number;
  volumeName: string;  // pl. "I. Kötet: A kezdetek"
  content: string;
  style: string;       // pl. "Életrajzi regény", "Napló"
  status: ChapterStatus;
  readingTimeMinutes: number;
  photoUrl?: string;
  photoCaption?: string;
  pageNumber: number;
  createdAt: string;
}

export interface BoardStory {
  id: string;
  authorPenName: string;
  title: string;
  content: string;
  era: string;
  location: string;
  photoUrl?: string;
  photoCaption?: string;
  reactions: {
    touching: number;   // 🥹 Megható
    funny: number;      // 😂 Vicces
    incredible: number; // 😲 Hihetetlen
    thoughtful: number; // 🤔 Elgondolkodtató
    love: number;       // ❤️ Szerelem
    adventure: number;  // 🎒 Kaland
    creepy: number;     // 🕯️ Hátborzongató
    wisdom: number;     // 🦉 Életbölcsesség
  };
  userReacted?: string;
  readCompletionRate: number; // 0-100%
  createdAt: string;
}

export interface FamilyPerspective {
  id: string;
  authorName: string;
  relationship: string;
  avatarColor: string;
  text: string;
}

export interface MultiPerspectiveEvent {
  id: string;
  title: string;
  year: string;
  place: string;
  perspectives: FamilyPerspective[];
}

export type ActiveTab = 'dashboard' | 'ai' | 'book' | 'board' | 'memory' | 'family';
