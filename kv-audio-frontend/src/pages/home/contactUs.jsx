import { FaLocationDot, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to send a message");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(
        `${backendUrl}/api/inquiries/add`,
        { message: message.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Message sent successfully! We'll get back to you soon.");
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] pt-20 pb-16 bg-gradient-to-br from-primary via-secondary/30 to-primary text-text relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <section className="rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-secondary/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(17,45,78,0.12)] border border-white/40 overflow-hidden mb-10 transform hover:scale-[1.01] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(17,45,78,0.15)]">
          <div className="px-6 sm:px-10 py-12 sm:py-16 relative">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-accent/90 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-2 shadow-sm">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                We're here to help
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text bg-gradient-to-r from-text via-accent to-text bg-clip-text">
                Contact <span className="text-transparent bg-gradient-to-r from-accent to-accent/70 bg-clip-text">KV Audio</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg lg:text-xl leading-relaxed text-text/70 max-w-3xl">
                Have a question about products, bookings, or availability? Send us a message and we'll get back to you soon.
              </p>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-2 grid gap-5 auto-rows-min">
            {/* Phone Card */}
            <div className="group rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-accent/10 hover:scale-[1.02] hover:border-accent/30 transition-all duration-500 hover:bg-white/80 animate-[fadeIn_0.6s_ease-out]">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-accent/20">
                  <FaPhone className="group-hover:animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-xl text-text">Phone</h2>
                  <p className="mt-2 text-sm text-text/70 leading-relaxed">
                    Tap to call us (mobile-friendly).
                  </p>
                  <a
                    href="tel:+94701533894"
                    className="mt-4 inline-flex text-base font-bold text-accent hover:text-accent/80 underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-all duration-300"
                  >
                    +94 70 153 3894
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-accent/10 hover:scale-[1.02] hover:border-accent/30 transition-all duration-500 hover:bg-white/80 animate-[fadeIn_0.6s_ease-out_0.1s] opacity-0" style={{ animation: 'fadeIn 0.6s ease-out 0.1s forwards' }}>
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-accent/20">
                  <FaEnvelope className="group-hover:animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-xl text-text">Email</h2>
                  <p className="mt-2 text-sm text-text/70 leading-relaxed">
                    Best for invoices, quotes, and details.
                  </p>
                  <a
                    href="mailto:info@kvaudio.lk"
                    className="mt-4 inline-flex text-base font-bold text-accent hover:text-accent/80 underline underline-offset-4 decoration-accent/40 hover:decoration-accent break-all transition-all duration-300"
                  >
                    info@kvaudio.lk
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-accent/10 hover:scale-[1.02] hover:border-accent/30 transition-all duration-500 hover:bg-white/80 animate-[fadeIn_0.6s_ease-out_0.2s] opacity-0" style={{ animation: 'fadeIn 0.6s ease-out 0.2s forwards' }}>
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-accent/20">
                  <FaLocationDot className="group-hover:animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-xl text-text">Location</h2>
                  <p className="mt-2 text-sm text-text/70 leading-relaxed">
                    Visit us for demos and pickups.
                  </p>
                  <p className="mt-4 text-base font-bold text-text">
                    KV Audio, Gampaha, Sri Lanka
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Gampaha,+Sri+Lanka"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-all duration-300"
                  >
                    Open in Google Maps
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="rounded-3xl bg-gradient-to-br from-accent/10 via-white/70 to-white/60 backdrop-blur-xl border border-white/50 shadow-lg p-6 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 animate-[fadeIn_0.6s_ease-out_0.3s] opacity-0" style={{ animation: 'fadeIn 0.6s ease-out 0.3s forwards' }}>
              <h2 className="font-bold text-xl text-text flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Hours
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/60 backdrop-blur-sm">
                  <span className="text-text/70 font-medium">Mon – Sat</span>
                  <span className="font-bold text-text">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/60 backdrop-blur-sm">
                  <span className="text-text/70 font-medium">Sunday</span>
                  <span className="font-bold text-text">10:00 AM – 2:00 PM</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-text/60 leading-relaxed px-3">
                Hours can vary on holidays. Call before visiting.
              </p>
            </div>
          </div>

          {/* Right Column: Message Form + FAQ */}
          <div className="lg:col-span-3 grid gap-6 lg:gap-8 auto-rows-min">
            {/* Message Form */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6 sm:p-8 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 animate-[fadeIn_0.6s_ease-out_0.4s] opacity-0" style={{ animation: 'fadeIn 0.6s ease-out 0.4s forwards' }}>
              <div className="flex items-start gap-5 mb-6">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-white flex items-center justify-center text-xl shadow-lg shadow-accent/30">
                  <FaPaperPlane />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-2xl text-text">Send us a message</h2>
                  <p className="mt-2 text-sm text-text/70 leading-relaxed">
                    We'll respond to your inquiry as soon as possible.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="7"
                    className="w-full px-5 py-4 border-2 border-text/10 rounded-2xl outline-none bg-white/80 backdrop-blur-sm text-text placeholder-text/40 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-300 resize-none hover:border-text/20 shadow-sm"
                    placeholder="Type your message here... Include details like preferred date/time, items you're interested in, event location, etc."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-accent via-accent/90 to-accent/80 hover:from-accent/90 hover:via-accent hover:to-accent text-white font-bold text-lg py-4 px-6 rounded-2xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg flex items-center justify-center gap-3 group"
                >
                  <FaPaperPlane className={`transition-transform duration-300 ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-text/60 bg-accent/5 rounded-xl p-3">
                  <span className="w-1.5 h-1.5 bg-accent/60 rounded-full"></span>
                  Your email and phone number will be automatically included from your account.
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg p-6 sm:p-8 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 animate-[fadeIn_0.6s_ease-out_0.5s] opacity-0" style={{ animation: 'fadeIn 0.6s ease-out 0.5s forwards' }}>
              <h2 className="font-bold text-2xl text-text mb-6">Quick answers</h2>
              <div className="space-y-4">
                <details className="group rounded-2xl border-2 border-text/10 bg-white/80 backdrop-blur-sm p-5 hover:border-accent/30 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  <summary className="cursor-pointer list-none font-bold text-base text-text flex items-center justify-between gap-4 select-none">
                    <span>How do I book items?</span>
                    <span className="text-accent/70 text-xl group-open:rotate-180 transition-transform duration-300 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-text/10 text-sm text-text/70 leading-relaxed">
                    Browse items, add to booking, and confirm your details. If you
                    need help choosing a setup, contact us and we'll recommend a
                    package.
                  </p>
                </details>

                <details className="group rounded-2xl border-2 border-text/10 bg-white/80 backdrop-blur-sm p-5 hover:border-accent/30 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  <summary className="cursor-pointer list-none font-bold text-base text-text flex items-center justify-between gap-4 select-none">
                    <span>Do you offer delivery and setup?</span>
                    <span className="text-accent/70 text-xl group-open:rotate-180 transition-transform duration-300 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-text/10 text-sm text-text/70 leading-relaxed">
                    Yes, depending on location and availability. Share your event
                    location and time when you contact us.
                  </p>
                </details>

                <details className="group rounded-2xl border-2 border-text/10 bg-white/80 backdrop-blur-sm p-5 hover:border-accent/30 hover:bg-white/90 transition-all duration-300 shadow-sm hover:shadow-md">
                  <summary className="cursor-pointer list-none font-bold text-base text-text flex items-center justify-between gap-4 select-none">
                    <span>What should I include in a message?</span>
                    <span className="text-accent/70 text-xl group-open:rotate-180 transition-transform duration-300 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 pt-4 border-t border-text/10 text-sm text-text/70 leading-relaxed">
                    Date, venue/city, expected audience size, and any items you're
                    considering (speakers, mixers, lights, etc.).
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Keyframes for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
