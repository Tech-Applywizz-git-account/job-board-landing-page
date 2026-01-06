const JobTypeCategories = () => {
    const jobTypes = [
        {
            id: 1,
            title: 'Career Portal Jobs',
            description: 'Direct applications to company career pages with full job details',
            icon: '🏢',
        },
        {
            id: 2,
            title: 'Easy Apply Jobs',
            description: 'One-click applications on LinkedIn & Indeed for faster process',
            icon: '✅',
        },
        {
            id: 3,
            title: 'Contract Jobs',
            description: 'W2 and C2C contract opportunities with competitive rates',
            icon: '📋',
        },
        {
            id: 4,
            title: 'Staffing Agency Jobs',
            description: 'Positions through top recruitment agencies nationwide',
            icon: '🎯',
        },
        {
            id: 5,
            title: 'Sponsored Jobs',
            description: 'Featured opportunities from premium employers',
            icon: '⭐',
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    All Job Types in <span className="gradient-text">One Place</span>
                </h2>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto">
                    From traditional career portals to modern easy-apply platforms, we've got you covered
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {jobTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-white rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-bright-blue border-2 border-gray-200 group shadow-md"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-bright-blue/10 rounded-lg flex items-center justify-center mb-4 shadow-glow-blue group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">{type.icon}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold mb-3 group-hover:text-bright-blue transition-colors min-h-[56px]">
                                {type.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                {type.description}
                            </p>

                            {/* CTA Button */}
                            <button
                                className="w-full bg-transparent border border-bright-blue text-bright-blue px-4 py-2 rounded-lg text-sm font-semibold hover:bg-bright-blue hover:text-white transition-all duration-300"
                                aria-label={`Browse ${type.title}`}
                            >
                                Browse →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JobTypeCategories;
