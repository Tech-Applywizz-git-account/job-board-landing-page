import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef([]);

    const steps = [
        {
            id: 1,
            title: 'Upload Resume',
            subtitle: 'Parse skills & experience',
            time: '< 30 seconds',
            description: 'Simply upload your resume and let our AI analyze your skills, experience, and qualifications instantly.',
            icon: '📄',
            metrics: [
                { label: 'Speed', value: 98 },
                { label: 'Accuracy', value: 95 },
                { label: 'AI Power', value: 99 },
            ],
            overall: 97,
        },
        {
            id: 2,
            title: 'Create Profile',
            subtitle: 'Set preferences & filters',
            time: '≈ 2 mins',
            description: 'Customize your job search with filters for location, salary range, job type, and preferred domains.',
            icon: '⚙️',
            metrics: [
                { label: 'Customization', value: 100 },
                { label: 'Flexibility', value: 96 },
                { label: 'Ease of Use', value: 94 },
            ],
            overall: 97,
        },
        {
            id: 3,
            title: 'Browse Matched Jobs',
            subtitle: 'AI-ranked opportunities',
            time: '0-100 score',
            description: 'Get personalized job recommendations ranked by relevance. Focus only on the best opportunities for you.',
            icon: '✨',
            metrics: [
                { label: 'Match Score', value: 95 },
                { label: 'Relevance', value: 93 },
                { label: 'Quality', value: 96 },
            ],
            overall: 95,
        },
    ];

    useEffect(() => {
        const content = contentRef.current;

        // Animate only the left content sections one by one on scroll
        gsap.fromTo(
            content,
            {
                opacity: 0,
                x: -50,
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 1.0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }, []);

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    Find Your Best Job Match in{' '}
                    <span className="gradient-text">3 Simple Steps</span>
                </h2>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-2xl mx-auto">
                    Getting started with ApplyWizz is quick and easy
                </p>

                <div className="flex flex-col gap-20">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                        >
                            {/* Left Content */}
                            <div ref={(el) => (contentRef.current[index] = el)} className="lg:pr-8">
                                <h3 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {step.description}
                                </p>
                                <button
                                    className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={() => document.getElementById('cta-banner')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Get Started Now
                                </button>
                            </div>

                            {/* Right Card */}
                            <div className="relative transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                                {/* Background decorative element */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-3xl transform rotate-3 opacity-50"></div>

                                {/* Main Card */}
                                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
                                    {/* Overall Score Badge */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg">
                                        <span className="text-2xl font-bold">{step.overall}%</span>
                                        <span className="text-xs">Overall</span>
                                    </div>

                                    {/* Header with Icon and Time */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-md">
                                            <span className="text-3xl">{step.icon}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 block">{step.time}</span>
                                            <span className="text-sm font-bold text-gray-700">{step.subtitle}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-xl font-bold mb-1 text-gray-900">{step.title}</h4>
                                    <p className="text-xs text-gray-500 mb-6">ApplyWizz</p>

                                    {/* Metrics */}
                                    <div className="flex justify-between mb-6">
                                        {step.metrics.map((metric, idx) => (
                                            <div key={idx} className="flex flex-col items-center">
                                                <div className="relative w-16 h-16 mb-2">
                                                    {/* Background Circle */}
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            stroke="#e5e7eb"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <circle
                                                            cx="32"
                                                            cy="32"
                                                            r="28"
                                                            stroke="#10b981"
                                                            strokeWidth="4"
                                                            fill="none"
                                                            strokeDasharray={`${2 * Math.PI * 28}`}
                                                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - metric.value / 100)}`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-600 font-medium">{metric.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Why You Are A Good Fit Section */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h5 className="text-sm font-bold text-gray-900 mb-3">Why You're A Perfect Match</h5>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                                                <span className="text-green-600 text-sm">✓</span>
                                                <span className="text-xs text-gray-700 font-medium">Experience Level</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                                                <span className="text-red-600 text-sm">✗</span>
                                                <span className="text-xs text-gray-700 font-medium">Education</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Green Bar */}
                                    <div className="absolute bottom-0 right-0 w-3/4 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-bl-3xl rounded-tr-3xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <button
                        className="btn-primary text-lg"
                        onClick={() => document.getElementById('cta-banner')?.scrollIntoView({ behavior: 'smooth' })}
                        aria-label="Get started with ApplyWizz"
                    >
                        Get Started Free
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
