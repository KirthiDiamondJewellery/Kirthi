import React, { Component, ErrorInfo, ReactNode } from "react";
import { isDatabaseConnectionError } from "./lib/firebase";

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
    console.error("Uncaught error intercepted by ErrorBoundary:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDbError = isDatabaseConnectionError(this.state.error);

      if (isDbError) {
        return (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", padding: "30px", background: "#050505", color: "#F5F5F0", textAlign: "center", fontFamily: "serif" }}>
            <div style={{ width: "40px", height: "1px", background: "#D4AF37", marginBottom: "1.5rem" }} />
            <h2 style={{ fontSize: "1.75rem", marginBottom: "0.75rem", color: "#D4AF37", fontStyle: "italic", letterSpacing: "0.05em" }}>
              Maison Archive Maintenance
            </h2>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "1rem", maxWidth: "460px", lineHeight: 1.6, fontFamily: "sans-serif" }}>
              Our cloud database reserves are currently synchronizing or undergoing scheduled maintenance. To ensure data fidelity, access has been safely safeguarded.
            </p>
            <p style={{ fontSize: "0.75rem", opacity: 0.5, marginBottom: "2rem", fontFamily: "sans-serif" }}>
              All client services and showroom consultations remain fully operational.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button 
                onClick={this.handleRetry} 
                style={{ padding: "12px 28px", background: "#D4AF37", color: "#000", border: "none", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "11px", fontWeight: 600, transition: "all 0.3s ease" }}
              >
                Reconnect Archive
              </button>
              <a 
                href="/"
                style={{ padding: "12px 28px", background: "transparent", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.4)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "11px", display: "inline-block" }}
              >
                Return to Boutique
              </a>
            </div>
            <div style={{ width: "40px", height: "1px", background: "#D4AF37", marginTop: "2rem" }} />
          </div>
        );
      }

      return (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", padding: "20px", background: "#050505", color: "#F5F5F0", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#D4AF37", fontStyle: "italic", fontFamily: "serif" }}>Experience Interrupted</h2>
          <p style={{ fontSize: "0.9rem", opacity: 0.7, marginBottom: "2rem", maxWidth: "420px", lineHeight: 1.5 }}>
            A connection instability prevented this view from loading. Please retry to restore your browsing session.
          </p>
          <button 
             onClick={this.handleRetry} 
             style={{ padding: "12px 24px", background: "transparent", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.5)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.3em", fontSize: "11px", transition: "all 0.3s ease" }}
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
