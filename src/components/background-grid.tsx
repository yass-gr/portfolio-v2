// Fixed column hairlines behind the whole page: 4 columns on mobile, 12 from md.
export function BackgroundGrid() {
  return (
    <>
      <div className="fixed inset-0 -z-10" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-1 grid grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`h-full border-l ${i === 0 ? "border-transparent" : "border-brand-primary/25"} ${i >= 4 ? "hidden md:block" : ""}`}
          />
        ))}
      </div>
    </>
  );
}
