import { Component } from 'react'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-[#07080f] text-[#f0f4ff] text-center px-6 gap-4">
                    <div className="text-6xl">⚠️</div>
                    <h1 className="text-2xl font-bold">Something went wrong</h1>
                    <p className="text-[#8899bb] text-sm max-w-md">{this.state.error?.message}</p>
                    <button
                        className="mt-2 px-5 py-2 bg-[#3b82f6] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        onClick={() => window.location.reload()}
                    >Reload Page</button>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary
