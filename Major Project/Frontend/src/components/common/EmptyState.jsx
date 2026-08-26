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
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      {icon || <img src={emptyStateIllustration} alt="" className="h-32 w-32" />}
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-1">{actionLabel}</Button>
      )}
    </div>
  );
}
