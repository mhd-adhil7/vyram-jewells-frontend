import { useState } from 'react';

const WHATSAPP_NUMBER = '9744342857';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [buttonText, setButtonText] = useState('Send Message');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setButtonText('Fill Required Fields');
      window.setTimeout(() => setButtonText('Send Message'), 1800);
      return;
    }

    const message = `Hello, I have a new enquiry:\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${
      formData.subject || 'General Inquiry'
    }\nMessage: ${formData.message}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setButtonText('Redirecting...');
    window.open(whatsappUrl, '_blank');

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    window.setTimeout(() => setButtonText('Send Message'), 1600);
  };

  return (
    <main className="contact-page-wrapper">
      <section className="contact-heading-section fade-in-on-scroll">
        <div className="contact-top-logo">
          <img src="/assets/vyram-logo.png" alt="Vyram Logo" />
        </div>
        <div className="decorative-icon">
          <i className="fa-solid fa-gem"></i>
        </div>
        <h1>Send an Inquiry</h1>
        <p>
          Connect with our expert consultants for bespoke luxury jewelry and personalized
          appointments.
        </p>
      </section>

      <section className="contact-split-new fade-in-on-scroll">
        <div className="contact-split-container">
          <div className="contact-image-side">
            <img src="/assets/vyram-cover.jpg" alt="Vyram Jewelry Aesthetic" />
          </div>

          <div className="contact-form-side-new">
            <h2>We&apos;d love to hear from you!</h2>
            <form className="contact-form new-premium-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />
              </div>

              <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry subject"
                />
              </div>

              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you?"
                ></textarea>
              </div>

              <button type="submit" className="btn-send-message">
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
