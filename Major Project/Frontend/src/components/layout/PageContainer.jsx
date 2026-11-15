import clsx from "clsx";

/**
 * Responsive wide-content container for pages with dark luxury glassmorphism theme.
 * Expands across laptop/desktop screens to eliminate empty side voids.
 */
export default function PageContainer({
  title,
  subtitle,
  action,
  className,
  children,
}) {
  return (
    <div className={clsx("w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 text-white", className)}>
      {(title || action) && (
        <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
          <div>
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
