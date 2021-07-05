import { ReactNode, createContext, useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';

import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid, email } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
          email: email
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (result?.user) {
      const { displayName, photoURL, uid, email } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      showToast('🎉', `Seja bem-vindo  ${displayName}!`);

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
        email: email
      });
    }
  }

  async function signOut() {
    firebase.auth().signOut();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOut
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
