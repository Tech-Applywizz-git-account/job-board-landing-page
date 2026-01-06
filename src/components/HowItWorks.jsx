const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: 'Upload Resume',
            subtitle: 'Parse skills & experience (< 30 seconds)',
            description: 'Simply upload your resume and let our AI analyze your skills, experience, and qualifications instantly.',
            icon: '📄',
        },
        {
            id: 2,
            title: 'Create Profile',
            subtitle: 'Set preferences, salary, job type (≈ 2 mins)',
            description: 'Customize your job search with filters for location, salary range, job type, and preferred domains.',
            icon: '⚙️',
        },
        {
            id: 3,
            title: 'Browse Matched Jobs',
            subtitle: 'Algorithm ranks jobs 0-100 score',
            description: 'Get personalized job recommendations ranked by relevance. Focus only on the best opportunities for you.',
            icon: '✨',
        },
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    Find Your Best Job Match in{' '}
                    <span className="gradient-text">3 Simple Steps</span>
                </h2>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-2xl mx-auto">
                    Getting started with ApplyWizz is quick and easy
                </p>

                <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                            {/* Step Card */}
                            <div className="bg-white rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:border-bright-blue border-2 border-gray-200 h-full shadow-md">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-16 h-16 bg-bright-blue/10 rounded-xl flex items-center justify-center shadow-glow-blue">
                                        <span className="text-4xl">{step.icon}</span>
                                    </div>
                                    <div className="text-6xl font-bold text-bright-blue/10">
                                        {step.id}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                <p className="text-bright-blue text-sm mb-4 font-semibold">{step.subtitle}</p>
                                <p className="text-text-secondary leading-relaxed">{step.description}</p>
                            </div>

                            {/* Arrow for desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                    <div className="text-bright-blue text-4xl">→</div>
                                </div>
                            )}

                            {/* Arrow for mobile */}
                            {index < steps.length - 1 && (
                                <div className="lg:hidden flex justify-center my-4">
                                    <div className="text-bright-blue text-4xl">↓</div>
                                </div>
                            )}
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
