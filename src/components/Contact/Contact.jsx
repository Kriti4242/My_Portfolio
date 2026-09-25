import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, CheckCircle2, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon, MailIcon } from '@/components/common/SocialIcons';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import Button from '@/components/common/Button/Button';
import { sendContactEmail } from '@/services/emailService';
import { socialLinks } from '@/data/social';

const initialForm = { name: '', email: '', message: '' };

const socialIcons = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: MailIcon,
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [typedPrompt, setTypedPrompt] = useState('');
  const toastTimeoutRef = useRef(null);
  const prompt = '$ connect --with-kriti';

  // Type the terminal prompt on mount
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTypedPrompt(prompt.slice(0, i + 1));
      i++;
      if (i >= prompt.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const clearToastTimeout = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };

  const showToast = (nextToast) => {
    clearToastTimeout();
    setToast(nextToast);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3500);
  };

  useEffect(() => () => clearToastTimeout(), []);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) next.email = 'Valid email required';
    if (!form.message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    clearToastTimeout();
    setToast(null);
    try {
      await sendContactEmail(form);
      setForm(initialForm);
      showToast({ type: 'success', message: 'Message sent! I will get back to you soon.' });
    } catch (err) {
      showToast({
        type: 'error',
        message: err.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  return (
    <Section id="contact" className="bg-gradient-to-t from-card/40 to-transparent">
      <Heading
        eyebrow="Contact"
        title="Let's Build Something Great"
        subtitle="Questions, thoughts, or just want to say hello? Send a message."
        align="center"
        className="mb-12"
      />

      <div className="mx-auto max-w-2xl">
        {/* Terminal header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-card/60 px-4 py-3 dark-terminal-bar">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 flex items-center gap-1.5 text-xs text-muted">
              <Terminal className="h-3 w-3" />
              kriti-portfolio — contact
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 sm:p-8">
            {/* Typed prompt */}
            <div className="mb-6 font-mono text-sm">
              <span className="text-secondary">{typedPrompt}</span>
              <span className="animate-pulse text-primary">_</span>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              {['name', 'email'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="mb-1.5 flex items-center gap-1.5 text-xs font-mono text-secondary">
                    <span className="text-muted">{'>'}</span>
                    {field}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={form[field]}
                    onChange={onChange}
                    placeholder={field === 'email' ? 'your@email.com' : 'Your name'}
                    className="contact-input w-full rounded-xl px-4 py-3 font-mono text-sm outline-none transition focus:border-primary focus:shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                    aria-invalid={!!errors[field]}
                  />
                  {errors[field] && (
                    <p className="mt-1 font-mono text-xs text-red-500">{'// '}{errors[field]}</p>
                  )}
                </div>
              ))}

              <div>
                <label htmlFor="message" className="mb-1.5 flex items-center gap-1.5 text-xs font-mono text-secondary">
                  <span className="text-muted">{'>'}</span>
                  message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  placeholder="What's on your mind?"
                  className="contact-input w-full resize-none rounded-xl px-4 py-3 font-mono text-sm outline-none transition focus:border-primary focus:shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="mt-1 font-mono text-xs text-red-500">{'// '}{errors.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </form>

            {/* Social links */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="mb-4 font-mono text-xs text-muted">{'// Or find me on'}</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ id, href, label }) => {
                  const Icon = socialIcons[id] || MailIcon;
                  return (
                    <a
                      key={id}
                      href={href}
                      target={id !== 'email' ? '_blank' : undefined}
                      rel={id !== 'email' ? 'noopener noreferrer' : undefined}
                      aria-label={label}
                      className="contact-social-link flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-[0_0_16px_rgba(124,58,237,0.2)]"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-24 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-xl ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
            role="status"
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
