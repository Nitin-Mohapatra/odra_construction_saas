import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error);
    console.error(errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center bg-white px-3">
          <h2 className="fw-bold text-danger mb-3">
            Something went wrong
          </h2>

          <p className="text-muted mb-4">
            An unexpected error occurred while loading this page.
          </p>

          <button
            className="btn btn-success"
            onClick={this.handleReload}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;