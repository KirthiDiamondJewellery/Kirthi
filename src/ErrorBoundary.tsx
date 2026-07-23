import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", flexDirection: "column", padding: "20px", background: "#050505", color: "#F5F5F0", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#D4AF37", fontStyle: "italic", fontFamily: "serif" }}>Experience Interrupted</h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "2rem", maxWidth: "400px" }}>
            A connection instability prevented this module from loading perfectly. Please retry to restore the connection.
          </p>
          <button 
             onClick={this.handleRetry} 
             style={{ padding: "12px 24px", background: "transparent", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.5)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.4em", fontSize: "10px", transition: "all 0.3s ease" }}
             onMouseEnter={(e) => {
               (e.target as HTMLButtonElement).style.background = "#D4AF37";
               (e.target as HTMLButtonElement).style.color = "#000";
             }}
             onMouseLeave={(e) => {
               (e.target as HTMLButtonElement).style.background = "transparent";
               (e.target as HTMLButtonElement).style.color = "#D4AF37";
             }}
          >
             Retry Loading
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
