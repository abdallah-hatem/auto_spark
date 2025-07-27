export default () => ({
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Path to your Firebase service account JSON file (alternative to individual env vars)
    // serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  },
}); 