import { getStatusMeta } from "./characterMeta";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "lg";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const meta = getStatusMeta(status);
  const sizeClass = size === "lg" ? "text-lg px-5 py-2 gap-3" : "text-sm px-3 py-1 gap-2";
  const dotSize = size === "lg" ? "w-3.5 h-3.5" : "w-2.5 h-2.5";

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full border-2 backdrop-blur-md ${meta.badge} ${sizeClass}`}
    >
      <span className={`inline-block rounded-full ${dotSize} ${meta.dot}`} />
      {status} {meta.emoji}
    </span>
  );
}
