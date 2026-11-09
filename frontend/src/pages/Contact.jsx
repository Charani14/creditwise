import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { ErrorText, Field, Notice } from '../components/ui';

const emptyForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function submitMessage(event) {
    event.preventDefault();
    setError(null);
    setSent(false);
    setBusy(true);

    try {
      await api.post('/contact', form);
      setSent(true);
      setForm(emptyForm);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="public-page contact-page">
        <div className="contact-copy">
          <div className="eyebrow">CONTACT</div>
          <h1>We’re listening.</h1>
          <p>
            Send questions or feedback about the CreditWise project. The
            administrator can review messages from the admin workspace.
          </p>
          <div className="contact-callout">
            <i className="fas fa-circle-info" />
            <span>
              This is a simulated student project. Do not include real
              financial or card details.
            </span>
          </div>
        </div>

        <form className="contact-form glass-card" onSubmit={submitMessage}>
          {sent && (
            <Notice kind="success">
              Thanks. Your message has been received.
            </Notice>
          )}
          <ErrorText error={error} />

          <div className="form-row">
            <Field
              label="Your name"
              name="name"
              value={form.name}
              onChange={updateField}
              required
              minLength="2"
              maxLength="100"
            />
            <Field
              label="Email address"
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </div>

          <Field
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={updateField}
            required
            maxLength="200"
          />

          <label className="field-wrap">
            <span className="form-label-cw">Message</span>
            <textarea
              className="form-control-cw textarea-cw"
              name="message"
              value={form.message}
              onChange={updateField}
              required
              minLength="10"
              maxLength="3000"
              rows="5"
            />
          </label>

          <button className="btn-primary-cw" disabled={busy}>
            {busy ? 'Sending…' : 'Send message'}
            <i className="fas fa-arrow-right" />
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
}
