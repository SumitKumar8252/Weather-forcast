import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebaseConfig'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (err) {
            setError(getFriendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        setError('')
        setLoading(true)
        try {
            await signInWithPopup(auth, googleProvider)
            navigate('/')
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') setError(getFriendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
            <div className="w-full max-w-[420px] bg-bg-card border border-white/[0.08] rounded-card p-10 shadow-lg animate-fade-up">

                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8 no-underline">
                    <span className="text-[1.8rem]">🌤</span>
                    <span className="font-display text-2xl font-bold text-text-primary">AtmosIQ</span>
                </Link>

                <h1 className="font-display text-[1.4rem] font-bold text-text-primary text-center mb-1">Welcome back</h1>
                <p className="text-center text-text-secondary text-sm mb-7">Sign in to your account to continue</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-[10px] text-accent-red text-sm px-4 py-2.5 text-center mb-4">{error}</div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.82rem] font-semibold text-text-secondary uppercase tracking-wide">Email</label>
                        <input
                            className="w-full bg-bg-secondary border border-white/[0.08] rounded-[10px] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-200"
                            type="email" placeholder="you@example.com" value={email}
                            onChange={e => setEmail(e.target.value)} required autoComplete="email"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[0.82rem] font-semibold text-text-secondary uppercase tracking-wide">Password</label>
                        <input
                            className="w-full bg-bg-secondary border border-white/[0.08] rounded-[10px] px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-200"
                            type="password" placeholder="••••••••" value={password}
                            onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                        />
                    </div>
                    <button
                        className="mt-2 w-full py-2.5 bg-accent text-white font-bold text-sm rounded-[10px] border-none cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit" disabled={loading}
                    >{loading ? 'Signing in…' : 'Sign In'}</button>
                </form>

                <div className="flex items-center gap-3 my-4 text-text-muted text-[0.82rem] before:content-[''] before:flex-1 before:h-px before:bg-white/[0.08] after:content-[''] after:flex-1 after:h-px after:bg-white/[0.08]">or</div>

                <button
                    className="w-full py-3 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-text-primary text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 hover:bg-bg-card-hover hover:border-white/[0.16] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogle} disabled={loading} type="button"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-text-secondary text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-accent font-semibold hover:opacity-80 transition-opacity">Create one</Link>
                </p>
            </div>
        </div>
    )
}

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

function getFriendlyError(code) {
    switch (code) {
        case 'auth/user-not-found': case 'auth/wrong-password': case 'auth/invalid-credential':
            return 'Invalid email or password.'
        case 'auth/too-many-requests': return 'Too many attempts. Please try again later.'
        case 'auth/network-request-failed': return 'Network error. Check your connection.'
        default: return 'Something went wrong. Please try again.'
    }
}

export default Login
