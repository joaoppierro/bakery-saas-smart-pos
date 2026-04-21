import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextData {
  user: User | null;
  loadingAuth: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout }}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);