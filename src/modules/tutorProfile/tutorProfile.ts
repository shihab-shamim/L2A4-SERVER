export type TutorProfile = {
  id: string;
  userId: string;

  headline?: string | null;
  about?: string | null;

  hourlyRate: number;
  currency: string;

  subjects: string[];
  languages: string[];

  ratingAvg: number;
  totalReviews: number;
  totalSessions: number;

  isFeatured: boolean;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};