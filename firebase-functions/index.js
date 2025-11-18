const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Trigger: When new auth user created — create users doc and set default claim
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const displayName = user.displayName || null;
  const email = user.email || null;
  const role = "student"; // default role

  await admin.auth().setCustomUserClaims(uid, { role });

  await admin.firestore().collection("users").doc(uid).set({
    uid,
    email,
    displayName,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return null;
});

// Callable function: list users (admin only)
exports.listUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not signed in.");
  const callerClaims = context.auth.token || {};
  if (callerClaims.role !== "admin") throw new functions.https.HttpsError("permission-denied", "Must be admin.");

  const snap = await admin.firestore().collection("users").orderBy("createdAt", "desc").get();
  const users = snap.docs.map((d) => d.data());
  return { users };
});

// Callable function: set user role (admin only)
exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not signed in.");
  const callerClaims = context.auth.token || {};
  if (callerClaims.role !== "admin") throw new functions.https.HttpsError("permission-denied", "Must be admin.");

  const { uid, role } = data || {};
  if (!uid || !role) throw new functions.https.HttpsError("invalid-argument", "uid and role are required.");

  await admin.auth().setCustomUserClaims(uid, { role });
  await admin.firestore().collection("users").doc(uid).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
