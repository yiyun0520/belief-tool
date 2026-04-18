import { useEffect, useRef, useState, useCallback } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

const SK = "ba-v2-settings";
const BK = "ba-v2-beliefs";
const UID_KEY = "ba-v3-last-uid";

function ldS() {
  try { return JSON.parse(localStorage.getItem(SK)) || { theme: "d1", lang: "zh" }; }
  catch { return { theme: "d1", lang: "zh" }; }
}
function ldB() {
  try { return JSON.parse(localStorage.getItem(BK)) || []; }
  catch { return []; }
}
function toDate(val) {
  if (!val) return new Date(0);
  if (val?.toDate) return val.toDate();
  if (val instanceof Date) return val;
  return new Date(val);
}

export function useSync(user) {
  const [beliefs, setBeliefs] = useState([]);
  const [settings, setSettings] = useState({ theme: "d1", lang: "zh" });
  const [syncStatus, setSyncStatus] = useState("loading");
  const pendingRef = useRef(0);
  const mergedRef = useRef(false);
  const snapshotActiveRef = useRef(false);

  // ── helpers ────────────────────────────────────────────────────────────────
  function incPending() {
    pendingRef.current++;
    setSyncStatus(navigator.onLine ? "syncing" : "offline");
  }
  function decPending() {
    pendingRef.current = Math.max(0, pendingRef.current - 1);
    if (pendingRef.current === 0) setSyncStatus(navigator.onLine ? "synced" : "offline");
  }

  // ── clear local if switching accounts ─────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const lastUid = localStorage.getItem(UID_KEY);
    if (lastUid && lastUid !== user.uid) {
      localStorage.removeItem(SK);
      localStorage.removeItem(BK);
    }
    localStorage.setItem(UID_KEY, user.uid);
  }, [user?.uid]);

  // ── initial merge + realtime subscription ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      setBeliefs([]);
      setSettings({ theme: "d1", lang: "zh" });
      mergedRef.current = false;
      snapshotActiveRef.current = false;
      return;
    }

    let unsubBeliefs = null;
    let unsubProfile = null;

    async function mergeAndSubscribe() {
      setSyncStatus("loading");
      const uid = user.uid;

      // 1. Read local
      const localBeliefs = ldB();
      const localSettings = ldS();

      // 2. Read Firestore
      const profileRef = doc(db, "users", uid, "profile", "main");
      const beliefsCol = collection(db, "users", uid, "beliefs");

      let cloudSettings = null;
      let cloudBeliefs = [];

      try {
        const [profileSnap, beliefsSnap] = await Promise.all([
          getDoc(profileRef),
          getDocs(beliefsCol),
        ]);

        if (profileSnap.exists()) {
          const d = profileSnap.data();
          cloudSettings = d.settings || null;
        }
        beliefsSnap.forEach((docSnap) => {
          cloudBeliefs.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (e) {
        console.error("Firestore initial read failed", e);
        // Offline: use local data, subscribe will sync when back online
        setBeliefs(localBeliefs);
        setSettings(localSettings);
        setSyncStatus("offline");
        setupSubscriptions(uid);
        return;
      }

      // 3. Merge settings (cloud wins if newer)
      let mergedSettings = localSettings;
      if (cloudSettings) {
        const cloudTime = toDate(cloudSettings.updatedAt);
        const localTime = toDate(localSettings.updatedAt);
        if (cloudTime >= localTime) {
          mergedSettings = cloudSettings;
        } else {
          // push local settings up
          try {
            await setDoc(profileRef, {
              settings: { ...localSettings, updatedAt: serverTimestamp() },
              updatedAt: serverTimestamp(),
            }, { merge: true });
          } catch (e) { console.error("Settings push failed", e); }
        }
      } else {
        // No cloud settings, push local
        try {
          await setDoc(profileRef, {
            settings: { ...localSettings, updatedAt: serverTimestamp() },
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (e) { console.error("Settings push failed", e); }
      }

      // 4. Merge beliefs
      const cloudMap = new Map(cloudBeliefs.map((b) => [b.id, b]));
      const localMap = new Map(localBeliefs.map((b) => [b.id, b]));
      const allIds = new Set([...cloudMap.keys(), ...localMap.keys()]);

      const mergedBeliefs = [];
      const batch = writeBatch(db);
      let batchHasWrites = false;

      for (const id of allIds) {
        const cloud = cloudMap.get(id);
        const local = localMap.get(id);

        if (cloud && !local) {
          // Cloud only → add to local
          mergedBeliefs.push(cloud);
        } else if (local && !cloud) {
          // Local only → push to cloud
          const bRef = doc(db, "users", uid, "beliefs", id);
          batch.set(bRef, { ...local, updatedAt: serverTimestamp() });
          batchHasWrites = true;
          mergedBeliefs.push(local);
        } else if (cloud && local) {
          // Both exist → newer wins
          const cloudTime = toDate(cloud.updatedAt);
          const localTime = toDate(local.updatedAt ?? new Date(0));
          if (cloudTime >= localTime) {
            mergedBeliefs.push(cloud);
          } else {
            const bRef = doc(db, "users", uid, "beliefs", id);
            batch.set(bRef, { ...local, updatedAt: serverTimestamp() });
            batchHasWrites = true;
            mergedBeliefs.push(local);
          }
        }
      }

      if (batchHasWrites) {
        try { await batch.commit(); }
        catch (e) { console.error("Merge batch write failed", e); }
      }

      // 5. Apply merged state
      const finalSettings = { ...mergedSettings };
      delete finalSettings.updatedAt; // don't pollute local settings with timestamp

      setSettings(finalSettings);
      setBeliefs(mergedBeliefs);
      localStorage.setItem(SK, JSON.stringify(finalSettings));
      localStorage.setItem(BK, JSON.stringify(mergedBeliefs));

      mergedRef.current = true;
      setupSubscriptions(uid);
    }

    function setupSubscriptions(uid) {
      snapshotActiveRef.current = true;

      // Subscribe to beliefs subcollection
      const beliefsCol = collection(db, "users", uid, "beliefs");
      unsubBeliefs = onSnapshot(beliefsCol, (snap) => {
        if (!mergedRef.current) return; // wait for merge to complete
        setBeliefs((prev) => {
          const prevMap = new Map(prev.map((b) => [b.id, b]));
          const updates = [];
          snap.docChanges().forEach((change) => {
            const data = { id: change.doc.id, ...change.doc.data() };
            if (change.type === "removed") {
              prevMap.delete(data.id);
            } else {
              prevMap.set(data.id, data);
            }
            updates.push(change);
          });
          if (updates.length === 0) return prev;
          const next = Array.from(prevMap.values());
          localStorage.setItem(BK, JSON.stringify(next));
          return next;
        });
        setSyncStatus(navigator.onLine ? "synced" : "offline");
      }, (err) => {
        console.error("beliefs snapshot error", err);
        setSyncStatus("error");
      });

      // Subscribe to profile
      const profileRef = doc(db, "users", uid, "profile", "main");
      unsubProfile = onSnapshot(profileRef, (snap) => {
        if (!mergedRef.current || !snap.exists()) return;
        const d = snap.data();
        if (d.settings) {
          const s = { ...d.settings };
          delete s.updatedAt;
          setSettings(s);
          localStorage.setItem(SK, JSON.stringify(s));
        }
      }, (err) => {
        console.error("profile snapshot error", err);
      });

      setSyncStatus(navigator.onLine ? "synced" : "offline");
    }

    mergeAndSubscribe();

    return () => {
      if (unsubBeliefs) unsubBeliefs();
      if (unsubProfile) unsubProfile();
      snapshotActiveRef.current = false;
    };
  }, [user?.uid]);

  // ── online/offline detection ───────────────────────────────────────────────
  useEffect(() => {
    function onOnline() { if (pendingRef.current === 0) setSyncStatus("synced"); }
    function onOffline() { setSyncStatus("offline"); }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ── write operations ───────────────────────────────────────────────────────
  const addBelief = useCallback(async (belief) => {
    const withTs = { ...belief, updatedAt: new Date().toISOString() };
    setBeliefs((prev) => {
      const next = [withTs, ...prev];
      localStorage.setItem(BK, JSON.stringify(next));
      return next;
    });
    if (!user) return;
    incPending();
    try {
      const bRef = doc(db, "users", user.uid, "beliefs", belief.id);
      await setDoc(bRef, { ...withTs, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error("addBelief failed", e);
      setSyncStatus("error");
    } finally { decPending(); }
  }, [user]);

  const updateBelief = useCallback(async (id, patchFn) => {
    let patched;
    setBeliefs((prev) => {
      const next = prev.map((b) => {
        if (b.id !== id) return b;
        patched = { ...patchFn(b), updatedAt: new Date().toISOString() };
        return patched;
      });
      localStorage.setItem(BK, JSON.stringify(next));
      return next;
    });
    if (!user || !patched) return;
    incPending();
    try {
      const bRef = doc(db, "users", user.uid, "beliefs", id);
      await setDoc(bRef, { ...patched, updatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.error("updateBelief failed", e);
      setSyncStatus("error");
    } finally { decPending(); }
  }, [user]);

  const deleteBelief = useCallback(async (id) => {
    setBeliefs((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem(BK, JSON.stringify(next));
      return next;
    });
    if (!user) return;
    incPending();
    try {
      await deleteDoc(doc(db, "users", user.uid, "beliefs", id));
    } catch (e) {
      console.error("deleteBelief failed", e);
      setSyncStatus("error");
    } finally { decPending(); }
  }, [user]);

  const updateSettings = useCallback(async (newSettings) => {
    const s = { ...newSettings };
    setSettings(s);
    localStorage.setItem(SK, JSON.stringify(s));
    if (!user) return;
    incPending();
    try {
      const profileRef = doc(db, "users", user.uid, "profile", "main");
      await setDoc(profileRef, {
        settings: { ...s, updatedAt: serverTimestamp() },
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error("updateSettings failed", e);
      setSyncStatus("error");
    } finally { decPending(); }
  }, [user]);

  // Special: bulk replace all beliefs (used by import)
  const replaceBeliefs = useCallback(async (newBeliefs, newSettings) => {
    const withTs = newBeliefs.map((b) => ({ ...b, updatedAt: b.updatedAt || new Date().toISOString() }));
    setBeliefs(withTs);
    localStorage.setItem(BK, JSON.stringify(withTs));
    if (newSettings) {
      setSettings(newSettings);
      localStorage.setItem(SK, JSON.stringify(newSettings));
    }
    if (!user) return;
    incPending();
    try {
      const uid = user.uid;
      // Delete all existing cloud beliefs and rewrite
      const beliefsCol = collection(db, "users", uid, "beliefs");
      const snap = await getDocs(beliefsCol);
      const batch = writeBatch(db);
      snap.forEach((d) => batch.delete(d.ref));
      withTs.forEach((b) => {
        const bRef = doc(db, "users", uid, "beliefs", b.id);
        batch.set(bRef, { ...b, updatedAt: serverTimestamp() });
      });
      if (newSettings) {
        const profileRef = doc(db, "users", uid, "profile", "main");
        batch.set(profileRef, {
          settings: { ...newSettings, updatedAt: serverTimestamp() },
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.error("replaceBeliefs failed", e);
      setSyncStatus("error");
    } finally { decPending(); }
  }, [user]);

  return {
    beliefs,
    settings,
    syncStatus,
    addBelief,
    updateBelief,
    deleteBelief,
    updateSettings,
    replaceBeliefs,
  };
}
