const TrustSection = () => {
    const stats = [
        {
            id: 1,
            value: '70,000+',
            label: 'Jobs Matched',
        },
        {
            id: 2,
            value: '50,000+',
            label: 'Active Seekers',
        },
        {
            id: 3,
            value: '85%+',
            label: 'Matching Accuracy',
        },
        {
            id: 4,
            value: '73+',
            label: 'Domains',
        },
    ];

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            text: 'ApplyWizz helped me find my dream job in just 2 weeks! The match scores were incredibly accurate and I only applied to relevant positions.',
            avatar: '👩‍💻',
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Data Analyst',
            text: 'The ability to see jobs from all sources in one place saved me hours of searching. The fresh jobs filter is a game-changer!',
            avatar: '👨‍💼',
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Product Manager',
            text: 'I love that ApplyWizz only shows fresh jobs. No more wasting time on outdated listings. Found my role in under a month!',
            avatar: '👩‍🎓',
        },
        {
            id: 4,
            name: 'David Kumar',
            role: 'DevOps Engineer',
            text: 'The domain-specific filtering made it so easy to find exactly what I was looking for. Highly recommend to any job seeker!',
            avatar: '👨‍🔬',
        },
    ];

    return (
        <section id="user" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    Trusted by Job Seekers <span className="gradient-text">Across America</span>
                </h2>
                <p className="text-xl text-text-secondary text-center mb-16 max-w-2xl mx-auto">
                    Join thousands of professionals who found their dream jobs through ApplyWizz
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white rounded-xl p-8 text-center hover:scale-105 transition-all duration-300 hover:border-neon-green border-2 border-gray-200 shadow-md"
                        >
                            <div className="text-5xl font-bold text-neon-green mb-3 text-glow-green">
                                {stat.value}
                            </div>
                            <p className="text-text-secondary text-sm sm:text-base">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-bright-blue border-2 border-gray-200 shadow-md"
                        >
                            {/* Quote Icon */}
                            <div className="text-bright-blue text-4xl mb-3 opacity-50">"</div>

                            {/* Testimonial Text */}
                            <p className="text-text-secondary mb-6 leading-relaxed italic text-sm">
                                {testimonial.text}
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                                <div className="w-10 h-10 bg-neon-green/10 rounded-full flex items-center justify-center text-xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
