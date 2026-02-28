import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Guard: only initialise when credentials are present to avoid crashing
// the React tree when the .env file has empty values.
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId

let app            = null
let auth           = null
let googleProvider = null

if (hasConfig) {
  try {
    app            = initializeApp(firebaseConfig)
    auth           = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (e) {
    console.warn('[Firebase] Initialisation failed:', e.message)
  }
} else {
  console.warn('[Firebase] Missing credentials in .env — auth disabled.')
}

export { auth, googleProvider }
export default app
