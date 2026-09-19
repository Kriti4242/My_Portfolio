import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50',
  secondary:
    'glass text-text hover:border-secondary/50 hover:text-secondary',
  ghost: 'text-muted hover:text-text hover:bg-white/5',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  magnetic = false,
  href,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${variants[variant]} ${className}`;

  const Comp = href ? 'a' : 'button';

  return (
    <motion.div whileHover={magnetic ? { scale: 1.03 } : undefined} whileTap={{ scale: 0.98 }}>
      <Comp className={classes} href={href} disabled={props.disabled} {...props}>
        {children}
      </Comp>
    </motion.div>
  );
}
