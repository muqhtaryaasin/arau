import React, { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

function buildChildId(index) {
  return `child-${index + 1}`;
}

function normalizeChildren(data = {}) {
  const rawChildren = Array.isArray(data.children) ? data.children : [];
  const cleaned = rawChildren
    .map((child, index) => ({
      id: child?.id || buildChildId(index),
      name: String(child?.name || "").trim(),
      year: Number(child?.year) || 1,
    }))
    .filter((child) => child.name)
    .slice(0, 6);

  if (!cleaned.length && data.childName) {
    cleaned.push({
      id: buildChildId(0),
      name: String(data.childName).trim(),
      year: Number(data.childYear) || 1,
    });
  }

  const activeId = cleaned.some((child) => child.id === data.activeChildId)
    ? data.activeChildId
    : cleaned[0]?.id || null;
  const activeChild = cleaned.find((child) => child.id === activeId) || null;

  return {
    children: cleaned,
    activeChildId: activeId,
    activeChild,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = doc(db, "users", authUser.uid);

        // Ensure user document exists.
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const existingData = userDoc.data();
          const normalized = normalizeChildren(existingData);
          setUserData({
            ...existingData,
            role: existingData.role || "parent",
            parentName: authUser.displayName || existingData.parentName || "Parent",
            children: normalized.children,
            activeChildId: normalized.activeChildId,
            childName: normalized.activeChild?.name || "",
            childYear: normalized.activeChild?.year || 1,
          });
        } else {
          const initialChild = {
            id: buildChildId(0),
            name: "",
            year: 1,
          };
          const newUserData = {
            role: "parent",
            parentName: authUser.displayName || "Parent",
            email: authUser.email,
            displayName: authUser.displayName || "User",
            children: [initialChild],
            activeChildId: initialChild.id,
            childName: "",
            childYear: 1,
            subscriptionStatus: "free",
            subscriptionExpiry: null,
            createdAt: new Date(),
            totalQuestionsAnswered: 0,
            accuracy: 0,
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        }

        // Keep subscription status fresh after webhook updates.
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        unsubscribeUserDoc = onSnapshot(userRef, (snap) => {
          if (!snap.exists()) return;
          const data = snap.data();
          const normalized = normalizeChildren(data);
          setUserData({
            ...data,
            children: normalized.children,
            activeChildId: normalized.activeChildId,
            childName: normalized.activeChild?.name || "",
            childYear: normalized.activeChild?.year || 1,
          });
        });
      } else {
        if (unsubscribeUserDoc) {
          unsubscribeUserDoc();
          unsubscribeUserDoc = null;
        }
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      unsubscribeAuth();
    };
  }, []);

  const signup = async (email, password, parentName, childName, childYear) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firstChild = {
      id: buildChildId(0),
      name: String(childName || "").trim(),
      year: Number(childYear) || 1,
    };
    const newUserData = {
      role: "parent",
      parentName,
      email,
      displayName: parentName,
      children: firstChild.name ? [firstChild] : [],
      activeChildId: firstChild.name ? firstChild.id : null,
      childName: firstChild.name,
      childYear: firstChild.year,
      subscriptionStatus: "free",
      subscriptionExpiry: null,
      createdAt: new Date(),
      totalQuestionsAnswered: 0,
      accuracy: 0,
    };
    await setDoc(doc(db, "users", userCredential.user.uid), newUserData);
    setUserData(newUserData);
    return userCredential.user;
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const expiry = userData?.subscriptionExpiry;
  const expiryDate = expiry
    ? typeof expiry.toDate === "function"
      ? expiry.toDate()
      : new Date(expiry)
    : null;

  const isPremium =
    userData?.subscriptionStatus === "premium" &&
    expiryDate instanceof Date &&
    !Number.isNaN(expiryDate.getTime()) &&
    expiryDate > new Date();

  return (
    <AuthContext.Provider value={{ user, userData, loading, signup, login, logout, isPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
