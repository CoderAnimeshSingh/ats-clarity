import Dexie, { type Table } from 'dexie';
import type { Resume, CoverLetter, UserSettings } from '@/types/resume';

// Version history entry
export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  snapshot: Resume;
  createdAt: Date;
  label?: string;
}

export class ResumeDatabase extends Dexie {
  resumes!: Table<Resume>;
  coverLetters!: Table<CoverLetter>;
  settings!: Table<UserSettings>;
  resumeVersions!: Table<ResumeVersion>;

  constructor() {
    super('ResumeBuilderDB');
    this.version(2).stores({
      resumes: 'id, name, createdAt, updatedAt',
      coverLetters: 'id, resumeId, name, createdAt, updatedAt',
      settings: 'id',
      resumeVersions: 'id, resumeId, version, createdAt'
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
  // Delete all versions first
  await db.resumeVersions.where('resumeId').equals(id).delete();
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

// Version history functions
export async function saveResumeVersion(resume: Resume, label?: string): Promise<void> {
  const { v4: uuidv4 } = await import('uuid');
  
  // Get current version count
  const existingVersions = await db.resumeVersions
    .where('resumeId')
    .equals(resume.id)
    .count();
  
  const version: ResumeVersion = {
    id: uuidv4(),
    resumeId: resume.id,
    version: existingVersions + 1,
    snapshot: { ...resume },
    createdAt: new Date(),
    label,
  };
  
  await db.resumeVersions.add(version);
  
  // Keep only last 10 versions per resume
  const allVersions = await db.resumeVersions
    .where('resumeId')
    .equals(resume.id)
    .sortBy('version');
  
  if (allVersions.length > 10) {
    const toDelete = allVersions.slice(0, allVersions.length - 10);
    await Promise.all(toDelete.map(v => db.resumeVersions.delete(v.id)));
  }
}

export async function getResumeVersions(resumeId: string): Promise<ResumeVersion[]> {
  return db.resumeVersions
    .where('resumeId')
    .equals(resumeId)
    .sortBy('version')
    .then(versions => versions.reverse());
}

export async function restoreResumeVersion(versionId: string): Promise<Resume | undefined> {
  const version = await db.resumeVersions.get(versionId);
  if (!version) return undefined;
  
  const restoredResume = {
    ...version.snapshot,
    updatedAt: new Date(),
  };
  
  await db.resumes.put(restoredResume);
  return restoredResume;
}

// Cover letter functions
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

// Settings functions
export async function getUserSettings(): Promise<UserSettings> {
  const settings = await db.settings.get('user');
  return settings || { isPro: false };
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await db.settings.put({ ...settings, id: 'user' } as UserSettings & { id: string });
}

// Check if first-time user (no resumes exist)
export async function isFirstTimeUser(): Promise<boolean> {
  const count = await db.resumes.count();
  return count === 0;
}
