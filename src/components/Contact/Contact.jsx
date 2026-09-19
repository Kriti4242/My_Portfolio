import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import Section from '@/components/common/Section/Section';
import Heading from '@/components/common/Heading/Heading';
import Button from '@/components/common/Button/Button';
import { sendContactEmail } from '@/services/emailService';

const initialForm = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const toastTimeoutRef = useRef(null);

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

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card mx-auto max-w-2xl space-y-5 p-6 sm:p-8"
        noValidate
      >
        {['name', 'email'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="mb-1 block text-sm capitalize text-muted">
              {field}
            </label>
            <input
              id={field}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={onChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-primary"
              aria-invalid={!!errors[field]}
            />
            {errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="message" className="mb-1 block text-sm text-muted">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={onChange}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-primary"
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
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
      </motion.form>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-24 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm shadow-xl ${
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
