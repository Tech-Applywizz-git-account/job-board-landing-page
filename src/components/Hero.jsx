import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                            Find Your Perfect{' '}
                            <span className="gradient-text">Job Match</span>{' '}
                            in Minutes
                        </h1>

                        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
                            Browse jobs from <span className="text-neon-green font-semibold">5+ sources</span>, matched to your resume across{' '}
                            <span className="text-bright-blue font-semibold">73+ domains</span>.{' '}
                            All jobs posted in the last <span className="text-neon-green font-semibold">24 hours</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                className="btn-primary text-lg"
                                aria-label="Search jobs now"
                            >
                                Search Jobs Now
                            </button>
                            <button
                                className="btn-secondary text-lg"
                                onClick={() => navigate('/signup')}
                                aria-label="Sign up for free"
                            >
                                Sign Up Free
                            </button>
                        </div>

                        <button
                            className="btn-tertiary text-lg block sm:inline-block underline"
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                            aria-label="Learn how ApplyWizz works"
                        >
                            How It Works →
                        </button>
                    </div>

                    {/* Right Column - Visual Mock UI */}
                    <div className="relative">
                        <div className="glass-effect rounded-2xl p-8 space-y-6 animate-float">
                            {/* Resume Upload Icon */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-neon-green/20 rounded-xl flex items-center justify-center glow-green">
                                    <span className="text-3xl">📄</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Your Resume</p>
                                    <p className="text-sm text-text-muted">Uploaded & Analyzed</p>
                                </div>
                            </div>

                            {/* AI Matching Arrow */}
                            <div className="flex justify-center">
                                <div className="text-bright-blue text-4xl animate-pulse-slow">↓</div>
                            </div>

                            {/* AI Processing */}
                            <div className="glass-effect-dark rounded-xl p-4 border-2 border-bright-blue/30">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-bright-blue/20 rounded-lg flex items-center justify-center glow-blue">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">AI Matching Engine</p>
                                        <p className="text-xs text-text-muted">Analyzing 70,000+ jobs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Results Arrow */}
                            <div className="flex justify-center">
                                <div className="text-neon-green text-4xl animate-pulse-slow">↓</div>
                            </div>

                            {/* Job Cards with Match Scores */}
                            <div className="space-y-3">
                                <div className="glass-effect-dark rounded-lg p-4 border-l-4 border-neon-green hover:scale-105 transition-transform duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">Senior Software Engineer</p>
                                            <p className="text-sm text-text-muted">Google • Remote</p>
                                        </div>
                                        <div className="bg-neon-green/20 text-neon-green px-3 py-1 rounded-full text-sm font-bold glow-green">
                                            98%
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-effect-dark rounded-lg p-4 border-l-4 border-bright-blue hover:scale-105 transition-transform duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">Cloud Architect</p>
                                            <p className="text-sm text-text-muted">Microsoft • Hybrid</p>
                                        </div>
                                        <div className="bg-bright-blue/20 text-bright-blue px-3 py-1 rounded-full text-sm font-bold glow-blue">
                                            94%
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-effect-dark rounded-lg p-4 border-l-4 border-gray-400 hover:scale-105 transition-transform duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">DevOps Engineer</p>
                                            <p className="text-sm text-text-muted">Amazon • Seattle</p>
                                        </div>
                                        <div className="bg-gray-400/20 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
                                            87%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
