import { Component } from "react";
import Button from "./Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">
            <h2 className="text-base font-semibold text-gray-900">
              Something broke on our end
            </h2>
            <p className="max-w-sm text-sm text-gray-500">
              Please try again. If the problem continues, refresh the page.
            </p>
            <Button size="sm" onClick={this.handleReset}>Try again</Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
