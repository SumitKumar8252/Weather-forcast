import { createContext, useContext, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { auth } from '../firebase/firebaseConfig'
import { setUser, clearAuth } from '../features/auth/authSlice'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const dispatch = useDispatch()

    useEffect(() => {
        // If Firebase is not configured (missing .env keys), immediately clear auth
        if (!auth) {
            dispatch(clearAuth())
            return
        }

        let unsubscribe = () => { }
        try {
            unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    dispatch(setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                    }))
                } else {
                    dispatch(clearAuth())
                }
            })
        } catch (e) {
            console.warn('[Auth] onAuthStateChanged error:', e.message)
            dispatch(clearAuth())
        }

        return unsubscribe
    }, [dispatch])

    return (
        <AuthContext.Provider value={null}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext
