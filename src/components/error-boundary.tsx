import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#fbfaf6]">
          <div className="max-w-lg w-full bg-white border border-[#c89b51]/40 shadow-xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#fbf5e6] text-[#c89b51] border border-[#c89b51]/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="font-serif text-2xl text-[#071b2e] font-semibold mb-2">
              {this.props.fallbackTitle || 'Đã có lỗi xảy ra khi hiển thị'}
            </h2>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Hệ thống đã ghi nhận lỗi giao diện. Bạn có thể bấm &ldquo;Thử lại&rdquo; hoặc tải lại trang để tiếp tục làm việc.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-slate-50 border border-slate-200 text-left text-xs font-mono text-slate-700 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#071b2e] text-[#e7c487] hover:bg-[#0c665f] hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 bg-[#c89b51] text-[#071523] hover:bg-[#d8ab61] text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Tải lại trang
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
