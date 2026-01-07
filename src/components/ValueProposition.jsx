const ValueProposition = () => {
    const features = [
        {
            id: 1,
            icon: '🧠',
            title: 'Resume-Based Job Matching',
            description: 'We analyze your resume against job requirements. Jobs appear in order of relevance to YOUR profile.',
            stat: '85%+ users find relevant jobs within 5 minutes',
        },
        {
            id: 2,
            icon: '📚',
            title: 'One Stop for 5+ Job Sources',
            description: 'LinkedIn Easy Apply, Indeed, Career Portals, Contract Jobs, Staffing Agencies — all in one platform.',
            stat: '70,000+ jobs available',
        },
        {
            id: 3,
            icon: '⏰',
            title: 'Fresh Jobs Only',
            description: 'Only the newest jobs. Updated hourly. No stale listings.',
            stat: '10,000+ new jobs daily',
        },
        {
            id: 4,
            icon: '🎯',
            title: 'All Major Job Categories',
            description: 'We support all industries — with domain-specific filtering.',
            stat: 'All jobs posted within 24 hours',
        },
    ];

    return (
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-bg">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    Why <span className="text-neon-green">ApplyWizz</span> is Different
                </h2>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto">
                    We're not just another job board. We're your intelligent job-matching assistant.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-white rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl shadow-md group border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-neon-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neon-green/20 group-hover:shadow-glow-green transition-all duration-300">
                                <span className="text-4xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-green transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                {feature.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-bright-blue font-semibold text-sm">{feature.stat}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProposition;
