import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const FIELDS = [
  { id: 'name', type: 'text', label: 'Your name', placeholder: 'How can I address you?' },
  { id: 'email', type: 'email', label: 'Your email', placeholder: 'Where can I reach you?' },
];

const ContactForm = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );
      setForm({ name: '', email: '', message: '' });
      setSent(true);
    } catch (error) {
      console.error('EmailJS Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
      {FIELDS.map(({ id, type, label, placeholder }) => (
        <div key={id}>
          <label htmlFor={id} className="eyebrow block mb-2">
            {label}
          </label>
          <input
            type={type}
            id={id}
            name={id}
            value={form[id]}
            onChange={handleChange}
            placeholder={placeholder}
            required
          />
        </div>
      ))}
      <div>
        <label htmlFor="message" className="eyebrow block mb-2">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="How can I help you?"
          rows="4"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group w-fit font-mono text-xs uppercase tracking-[0.35em] border border-paper rounded-full px-10 py-5 hover:bg-accent hover:border-accent hover:text-ink transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Sending…' : sent ? 'Sent — thank you ✦' : 'Send message →'}
      </button>
    </form>
  );
};

export default ContactForm;
