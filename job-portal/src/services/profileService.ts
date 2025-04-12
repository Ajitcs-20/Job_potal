import { Job } from './jobService';

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  resume: string | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  savedJobs: Job[];
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadResume(userId: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`/api/profile/${userId}/resume`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }
      const data = await response.json();
      return data.resumeUrl;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  },

  async saveJob(userId: string, jobId: string): Promise<void> {
    try {
      const response = await fetch(`/api/profile/${userId}/saved-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  async removeSavedJob(userId: string, jobId: string): Promise<void> {
    try {
      const response = await fetch(`/api/profile/${userId}/saved-jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove saved job');
      }
    } catch (error) {
      console.error('Error removing saved job:', error);
      throw error;
    }
  },
}; 