import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function AboutUs() {
    const observerRef = useRef(null);

    useEffect(() => {
        // Intersection Observer for scroll animations
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll(".animate-on-scroll");
        elements.forEach((el) => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const coreValues = [
        {
            icon: "🎯",
            title: "Quality First",
            description: "We provide only the highest quality audio equipment, meticulously maintained and tested to ensure optimal performance for your events."
        },
        {
            icon: "🤝",
            title: "Customer Focus",
            description: "Your success is our priority. We're committed to providing exceptional service and support throughout your entire rental experience."
        },
        {
            icon: "⚡",
            title: "Innovation",
            description: "We continuously update our inventory with the latest technology to give you access to cutting-edge audio solutions."
        },
        {
            icon: "💎",
            title: "Reliability",
            description: "Count on us for dependable equipment and timely delivery. We understand that your event's success depends on our reliability."
        }
    ];

    const whyChooseUs = [
        {
            icon: "🏆",
            title: "Industry Expertise",
            description: "Years of experience in the audio rental industry, serving events of all sizes with professional-grade equipment."
        },
        {
            icon: "🔧",
            title: "Professional Maintenance",
            description: "All equipment is regularly inspected, maintained, and tested to ensure peak performance and reliability."
        },
        {
            icon: "📦",
            title: "Extensive Inventory",
            description: "From microphones to complete sound systems, we have everything you need for any type of event or production."
        },
        {
            icon: "💰",
            title: "Transparent Pricing",
            description: "Clear, competitive pricing with no hidden fees. You'll know exactly what you're paying for upfront."
        },
        {
            icon: "🚀",
            title: "Easy Booking",
            description: "Our streamlined online booking system makes it simple to reserve equipment and manage your rentals."
        },
        {
            icon: "🛡️",
            title: "Quality Assurance",
            description: "Every item undergoes rigorous quality checks before and after each rental to maintain our high standards."
        }
    ];

    const stats = [
        { number: "3+", label: "Years of Experience" },
        { number: "200+", label: "Happy Customers" },
        { number: "80+", label: "Quality Equipment" },
        { number: "350+", label: "Successful Events" }
    ];

    return (
        <div className="min-h-screen w-full bg-primary text-text">
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-accent/95 to-accent/90">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
                    <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-white/90 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            About Us
                        </p>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Elevating Events with
                            <br />
                            <span className="text-white/90">Premium Audio Solutions</span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Your trusted partner for professional audio equipment rentals, delivering excellence and reliability for every occasion.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/items"
                                className="group w-full sm:w-auto px-8 py-4 bg-white text-accent font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Browse Equipment
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <Link
                                to="/contact"
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
                        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image */}
                        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-accent/20">
                                <img
                                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop"
                                    alt="Professional Audio Equipment"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
                            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
                                Our Story
                            </p>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-6">
                                Passion for Perfect Sound
                            </h2>

                            <div className="space-y-4 text-text/80 text-base sm:text-lg leading-relaxed">
                                <p>
                                    Founded with a passion for delivering exceptional audio experiences, KV Audio has become a trusted name in professional equipment rentals. What started as a small collection of premium audio gear has grown into a comprehensive inventory serving events of all sizes.
                                </p>
                                <p>
                                    We understand that great sound can transform any event—from intimate gatherings to large-scale productions. That's why we're committed to providing not just equipment, but reliable partnerships with our clients.
                                </p>
                                <p>
                                    Our team combines decades of industry experience with a dedication to staying current with the latest audio technology, ensuring you always have access to the best equipment for your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-primary to-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
                            Our Purpose
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
                            Mission & Vision
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Mission */}
                        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                            <div className="h-full bg-secondary/50 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-text/10 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
                                <div className="text-5xl mb-6">🎯</div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-text mb-4">Our Mission</h3>
                                <p className="text-text/70 leading-relaxed text-base sm:text-lg">
                                    To empower events and productions with professional-grade audio equipment, exceptional service, and expert support - making premium sound accessible to everyone, from first-time renters to seasoned professionals.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
                            <div className="h-full bg-secondary/50 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-text/10 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
                                <div className="text-5xl mb-6">🌟</div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-text mb-4">Our Vision</h3>
                                <p className="text-text/70 leading-relaxed text-base sm:text-lg">
                                    To be the leading audio rental solution, recognized for innovation, reliability, and customer satisfaction - continuously expanding our offerings and setting new standards in the industry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
                            What Drives Us
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-base sm:text-lg text-text/70 max-w-2xl mx-auto">
                            The principles that guide everything we do, ensuring excellence in every interaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 group"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="h-full bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-text/10 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-2">
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-text mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-text/70 leading-relaxed text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-primary to-secondary/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16 animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
                            The KV Audio Advantage
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-4">
                            Why Choose Us
                        </h2>
                        <p className="text-base sm:text-lg text-text/70 max-w-2xl mx-auto">
                            Discover what sets us apart and makes us the preferred choice for audio equipment rentals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {whyChooseUs.map((reason, index) => (
                            <div
                                key={index}
                                className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 group"
                                style={{ transitionDelay: `${index * 80}ms` }}
                            >
                                <div className="h-full bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text/10 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {reason.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text mb-2">
                                                {reason.title}
                                            </h3>
                                            <p className="text-text/70 leading-relaxed text-sm">
                                                {reason.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <div className="bg-gradient-to-br from-accent via-accent/95 to-accent/90 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl shadow-accent/20 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '30px 30px'
                                }}></div>
                            </div>

                            <div className="relative z-10">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                        Our Achievements
                                    </h2>
                                    <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                                        Numbers that reflect our commitment to excellence and customer satisfaction
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                                        >
                                            <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2">
                                                {stat.number}
                                            </div>
                                            <div className="text-sm sm:text-base text-white/90 font-medium">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-accent via-accent/95 to-accent/90 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Explore our collection of premium audio equipment or get in touch to discuss your specific needs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/items"
                                className="group w-full sm:w-auto px-8 py-4 bg-white text-accent font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Explore Equipment
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>

                            <Link
                                to="/contact"
                                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS for animations */}
            <style>{`
        .animate-on-scroll {
          transition-property: opacity, transform;
        }
        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
        </div>
    );
}
