export default function Section({ id, children, className = '' }) {
  return (
    <section
      id={id}
      className={`section-padding relative overflow-hidden ${className}`}
    >
      <div className="mx-auto max-w-7xl w-full min-w-0">{children}</div>
    </section>
  );
}
