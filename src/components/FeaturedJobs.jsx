import { featuredJobs } from '../data/mockData';
import { useState } from 'react';

const FeaturedJobs = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All Jobs' },
        { id: 'easy-apply', label: 'Easy Apply' },
        { id: 'remote', label: 'Remote' },
        { id: 'last-24h', label: 'Last 24 Hours' },
    ];

    // Filter jobs based on selected tab
    const getFilteredJobs = () => {
        switch (selectedFilter) {
            case 'easy-apply':
                return featuredJobs.filter(job => job.isEasyApply);
            case 'remote':
                return featuredJobs.filter(job => job.isRemote);
            case 'last-24h':
                return featuredJobs.filter(job => job.postedHoursAgo <= 24);
            case 'all':
            default:
                return featuredJobs;
        }
    };

    const filteredJobs = getFilteredJobs();

    return (
        <section id="featured-jobs" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-bg">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-4">
                    Browse Jobs from <span className="text-bright-blue">Top Companies</span>
                </h2>
                <p className="text-xl text-text-secondary text-center mb-12 max-w-2xl mx-auto">
                    Explore opportunities from industry-leading organizations
                </p>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${selectedFilter === filter.id
                                ? 'bg-bright-blue text-white shadow-glow-blue'
                                : 'bg-white text-text-secondary hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:border-neon-green border-2 border-gray-200 group shadow-md"
                        >
                            {/* Company Logo */}
                            <div className="w-16 h-16 bg-secondary-bg rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                                {job.logo.startsWith('/') ? (
                                    <img
                                        src={job.logo}
                                        alt={`${job.company} logo`}
                                        className="w-12 h-12 object-contain"
                                    />
                                ) : (
                                    <span className="text-4xl">{job.logo}</span>
                                )}
                            </div>

                            {/* Job Title */}
                            <h3 className="text-lg font-bold mb-2 group-hover:text-neon-green transition-colors">
                                {job.title}
                            </h3>

                            {/* Company */}
                            <p className="text-text-secondary mb-2">{job.company}</p>

                            {/* Location */}
                            <p className="text-sm text-text-muted mb-4 flex items-center">
                                <span className="mr-2">📍</span>
                                {job.location}
                            </p>

                            {/* Match Score or Login Prompt */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                {job.matchScore !== null ? (
                                    <div className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm font-bold shadow-glow-green">
                                        {job.matchScore}% Match
                                    </div>
                                ) : (
                                    <p className="text-sm text-text-muted italic">
                                        Login to see match
                                    </p>
                                )}

                                {/* Category Tag */}
                                <span className="bg-bright-blue/10 text-bright-blue px-3 py-1 rounded-full text-xs font-semibold">
                                    {job.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More CTA */}
                <div className="text-center mt-12">
                    <button className="btn-secondary text-lg" aria-label="View all jobs">
                        View All Jobs →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedJobs;
