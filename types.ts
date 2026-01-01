export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export enum ViewMode {
  DASHBOARD = 'dashboard',
  MIRROR = 'mirror',
  THEATER = 'theater',
  ARCHIVE = 'archive',
}

export type Language = 'en' | 'zh';

export interface TheaterAnalysis {
  idVoice: string;
  superegoVoice: string;
  symptom: string; // The "Knot"
  authorship: string; // The "Resolution"
  emotionalState: string;
}

// Unified Data Structure
export type NarrativeType = 'log_entry' | 'tension_analysis';

export interface NarrativeEvent {
  id: string;
  type: NarrativeType;
  timestamp: number;
  content: string | TheaterAnalysis; // Raw text for logs, Structured object for analysis
  summary?: string; // Optional AI summary for context window optimization
}

export interface Signifier {
  id: string;
  text: string; // The keyword (e.g., "Control")
  insight: string; // Short "Old Teacher" comment derived from actual history
  weight: number; // 1-3, based on frequency/intensity in history
  x: number; // 0-100%
  y: number; // 0-100%
}

export interface CoreMetric {
  // Legacy
}
