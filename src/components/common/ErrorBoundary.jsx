import { Component } from 'react'

/*
  ErrorBoundary — catches render-time errors so one broken module doesn't blank
  the whole app. Renders a recoverable fallback.
*/
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset() {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-[60vh] place-items-center p-6">
          <div className="max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
            <p className="font-display text-xl font-semibold text-ink">Something went wrong</p>
            <p className="mt-2 text-sm text-muted">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
