import emptyStateIllustration from "/images/empty-state.svg";
import Button from "./Button";

export default function EmptyState({
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-slate-900/60 backdrop-blur-md px-6 py-12 text-center text-white">
      {icon || <img src={emptyStateIllustration} alt="" className="h-32 w-32 opacity-70" />}
      <h3 className="text-base font-extrabold text-white">{title}</h3>
      {description && <p className="max-w-sm text-xs sm:text-sm text-slate-300 leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2 !bg-amber-500 !text-white hover:!bg-amber-600 font-bold">{actionLabel}</Button>
      )}
    </div>
  );
}
