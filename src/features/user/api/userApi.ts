import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type UserCredential
} from 'firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import {
  INVALID_CREDENTIALS,
  NAME_CHANGE_ERROR,
  NAME_CHANGE_SUCCESS,
  PASSWORD_CHANGE_ERROR,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORDS_SAME
} from '../../../shared/constants';
import app from '../../../shared/firebase';

const db = getFirestore(app);
const auth = getAuth(app);
const userRef = collection(db, 'users');

const getCurrentUserId = (): string => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('No authenticated user found.');
  }

  return uid;
};

export const addToFavouriteFBStore = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();

  await updateDoc(doc(userRef, userId), {
    favourites: arrayUnion(id)
  });
};

export const removeFromFavouriteFBStore = async (id: string): Promise<void> => {
  const userId = getCurrentUserId();

  await updateDoc(doc(userRef, userId), {
    favourites: arrayRemove(id)
  });
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string
): Promise<{ name: string; uid: string }> => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  const user = credentials.user;

  await setDoc(doc(userRef, user.uid), {
    name,
    favourites: []
  });

  return { name, uid: user.uid };
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const updateFBName = async (newName: string): Promise<string> => {
  try {
    const userId = getCurrentUserId();
    await updateDoc(doc(userRef, userId), {
      name: newName
    });

    return NAME_CHANGE_SUCCESS;
  } catch {
    throw new Error(NAME_CHANGE_ERROR);
  }
};

export const updateFBPassword = async (currentPassword: string, newPassword: string): Promise<string> => {
  const currentUser = auth.currentUser;

  if (!currentUser?.email) {
    throw new Error(INVALID_CREDENTIALS);
  }

  if (currentPassword === newPassword) {
    throw new Error(PASSWORDS_SAME);
  }

  const credentials = EmailAuthProvider.credential(currentUser.email, currentPassword);

  try {
    await reauthenticateWithCredential(currentUser, credentials);
    await updatePassword(currentUser, newPassword);
    return PASSWORD_CHANGE_SUCCESS;
  } catch {
    throw new Error(PASSWORD_CHANGE_ERROR);
  }
};
