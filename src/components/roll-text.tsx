// Two stacked copies of the label: on hover of a `group/roll` parent the first
// slides down out of view and the second slides in from above.
const ROLL = "transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]";

export function RollText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden ${className}`}>
      <span className={`block ${ROLL} group-hover/roll:translate-y-full`}>{text}</span>
      <span aria-hidden="true" className={`absolute inset-0 block -translate-y-full ${ROLL} group-hover/roll:translate-y-0`}>
        {text}
      </span>
    </span>
  );
}
