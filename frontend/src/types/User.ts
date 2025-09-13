export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  department?: string;
  jobTitle?: string;
  bio?: string;
  profileImageUrl?: string;
  gender: Gender;
  interestedInGenders: Gender[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Match {
  id: number;
  user1: User;
  user2: User;
  status: MatchStatus;
  matchedAt?: string;
  createdAt: string;
}

export enum MatchStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  REJECTED = 'REJECTED'
}

export interface Message {
  id: number;
  sender: User;
  recipient: User;
  content: string;
  sentAt: string;
  readAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
}