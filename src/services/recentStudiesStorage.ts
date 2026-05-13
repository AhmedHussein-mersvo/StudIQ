import { storage } from '../utils/storage';
import type { StudyResult } from './aiServices';

const STORAGE_KEY = 'recent_studies_v1';
const MAX_RECORDS = 30;

export type RecentStudyRecord = {
  id: string;
  fileName: string;
  iconName: string;
  iconColor: string;
  createdAt: number;
  result: StudyResult;
  errorMessage?: string | null;
};

function parseRecords(raw: string | undefined): RecentStudyRecord[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is RecentStudyRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as RecentStudyRecord).id === 'string' &&
        typeof (item as RecentStudyRecord).fileName === 'string' &&
        typeof (item as RecentStudyRecord).iconName === 'string' &&
        typeof (item as RecentStudyRecord).iconColor === 'string' &&
        typeof (item as RecentStudyRecord).createdAt === 'number' &&
        typeof (item as RecentStudyRecord).result === 'object' &&
        (item as RecentStudyRecord).result !== null,
    );
  } catch {
    return [];
  }
}

export function getRecentStudies(): RecentStudyRecord[] {
  return parseRecords(storage.getString(STORAGE_KEY));
}

export function appendRecentStudy(record: RecentStudyRecord): void {
  const existing = getRecentStudies();
  const next = [
    record,
    ...existing.filter(r => r.id !== record.id),
  ].slice(0, MAX_RECORDS);
  storage.set(STORAGE_KEY, JSON.stringify(next));
}
