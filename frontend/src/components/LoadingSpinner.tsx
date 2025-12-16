import { Loader2 } from "lucide-react";

export function LoadingSpinner({
  size = "default",
  className = "",
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
    </div>
  );
}

export function LoadingOverlay({
  message = "Loading...",
  className = "",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center z-10 ${className}`}
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

export function FullPageLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}

export function InlineLoader({
  text = "Loading...",
  size = "default",
}: {
  text?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      <span className={textSizeClasses[size]}>{text}</span>
    </div>
  );
}
