export default function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`section-padding relative ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
