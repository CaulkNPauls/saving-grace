type DividerProps = {
  className?: string;
};

/**
 * Small abstract branching mark flanked by rules — an antler/thorn-inspired
 * motif in the general sense (geometric branch lines only, no tattoo
 * artwork). Used sparingly between major section transitions.
 */
export default function Divider({ className = "" }: DividerProps) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`} aria-hidden="true">
      <svg width="128" height="20" viewBox="0 0 128 20" className="opacity-70">
        <path d="M0 10H44" stroke="currentColor" strokeWidth="1" />
        <path d="M84 10H128" stroke="currentColor" strokeWidth="1" />
        <path
          d="M64 10L57 2M64 10L71 2M64 10L57 18M64 10L71 18"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="64" cy="10" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
