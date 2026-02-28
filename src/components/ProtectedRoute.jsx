import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectUser, selectAuthLoading } from '../features/auth/authSlice'

function ProtectedRoute({ children }) {
    const user = useSelector(selectUser)
    const loading = useSelector(selectAuthLoading)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="spinner" />
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />

    return children
}

export default ProtectedRoute
