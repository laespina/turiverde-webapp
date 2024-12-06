import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserType } from '../types/user';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<UserCredential>;
  loginWithGithub: () => Promise<UserCredential>;
  loginWithPhone: () => Promise<any>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserType) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUserProfile({ id: user.uid, ...userDoc.data() } as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const loginWithPhone = async () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    
    // This is a simplified version. In a real app, you'd need to:
    // 1. Show a phone number input
    // 2. Send the verification code
    // 3. Show a verification code input
    // 4. Verify the code
    return signInWithPhoneNumber(auth, '+1234567890', recaptchaVerifier);
  };

  async function signup(email: string, password: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      roles: [],
      createdAt: new Date().toISOString()
    });
  }

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  async function switchRole(role: UserType) {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        activeRole: role
      });

      setUserProfile(prev => prev ? { ...prev, activeRole: role } : null);
      toast.success(`Modo ${role === 'supplier' ? 'fornecedor' : 'cliente'} ativado`);
    } catch (error) {
      toast.error('Erro ao trocar de perfil');
    }
  }

  const value = {
    currentUser,
    userProfile,
    login,
    loginWithGoogle,
    loginWithGithub,
    loginWithPhone,
    signup,
    logout,
    switchRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
}