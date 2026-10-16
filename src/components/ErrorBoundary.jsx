import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <main className="panel error-boundary"><h2>Something went wrong.</h2><p>Please refresh the page and try again.</p><button onClick={() => window.location.reload()}>Reload</button></main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;