'use client';

import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

class AuthService {
  private provider: GoogleAuthProvider;
  private auth: Auth | null;

  constructor() {
    this.provider = new GoogleAuthProvider();
    this.provider.setCustomParameters({
      prompt: 'select_account',
    });
    this.auth = auth;
  }

  async signInWithGoogle(): Promise<AuthUser> {
    if (!this.auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }
    
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;
      return {
        id: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    if (!this.auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }
    
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (!this.auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }
    
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        callback({
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || undefined,
        });
      } else {
        callback(null);
      }
    });
  }

  getCurrentUser(): AuthUser | null {
    if (!this.auth) return null;
    
    const user = this.auth.currentUser;
    if (user) {
      return {
        id: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
      };
    }
    return null;
  }
}

export const authService = new AuthService(); 