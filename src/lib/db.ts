import Dexie, { type Table } from 'dexie';
import type { Resume, CoverLetter, UserSettings } from '@/types/resume';

export class ResumeDatabase extends Dexie {
  resumes!: Table<Resume>;
  coverLetters!: Table<CoverLetter>;
  settings!: Table<UserSettings>;

  constructor() {
    super('ResumeBuilderDB');
    this.version(1).stores({
      resumes: 'id, name, createdAt, updatedAt',
      coverLetters: 'id, resumeId, name, createdAt, updatedAt',
      settings: 'id'
    });
  }
}

export const db = new ResumeDatabase();

// Helper functions
export async function saveResume(resume: Resume): Promise<string> {
  const now = new Date();
  const updatedResume = {
    ...resume,
    updatedAt: now,
    createdAt: resume.createdAt || now,
  };
  await db.resumes.put(updatedResume);
  return resume.id;
}

export async function getResume(id: string): Promise<Resume | undefined> {
  return db.resumes.get(id);
}

export async function getAllResumes(): Promise<Resume[]> {
  return db.resumes.orderBy('updatedAt').reverse().toArray();
}

export async function deleteResume(id: string): Promise<void> {
  await db.resumes.delete(id);
}

export async function duplicateResume(id: string): Promise<string> {
  const original = await getResume(id);
  if (!original) throw new Error('Resume not found');
  
  const { v4: uuidv4 } = await import('uuid');
  const newId = uuidv4();
  const now = new Date();
  
  const duplicate: Resume = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.resumes.add(duplicate);
  return newId;
}

export async function saveCoverLetter(coverLetter: CoverLetter): Promise<string> {
  const now = new Date();
  const updated = {
    ...coverLetter,
    updatedAt: now,
    createdAt: coverLetter.createdAt || now,
  };
  await db.coverLetters.put(updated);
  return coverLetter.id;
}

export async function getCoverLetter(id: string): Promise<CoverLetter | undefined> {
  return db.coverLetters.get(id);
}

export async function getAllCoverLetters(): Promise<CoverLetter[]> {
  return db.coverLetters.orderBy('updatedAt').reverse().toArray();
}

export async function deleteCoverLetter(id: string): Promise<void> {
  await db.coverLetters.delete(id);
}

export async function getUserSettings(): Promise<UserSettings> {
  const settings = await db.settings.get('user');
  return settings || { isPro: false };
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await db.settings.put({ ...settings, id: 'user' } as UserSettings & { id: string });
}
