import { Component, type ReactNode } from 'react'

/** Isolates a chapter: if it throws (e.g. no canvas support), the rest of the page keeps working. */
export default class SafeSection extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[TOMA] section failed to render', error)
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
