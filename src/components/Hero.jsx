import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section
            id="hero"
            className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: 'url(/background_image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* White overlay for lighter background */}
            <div className="absolute inset-0 bg-white/10"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="space-y-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
                        AI-Matched Jobs, Not Endless Browsing
                    </h1>

                    <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
                        Browse jobs from <span className="text-neon-green font-semibold">different sources</span>, matched to your resume across{' '}
                        <span className="text-bright-blue font-semibold">all major job categories</span>.{' '}
                        All jobs posted in the last <span className="text-neon-green font-semibold">24 hours</span>.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                            className="btn-primary text-lg px-8 py-4"
                            aria-label="Search jobs now"
                        >
                            Search Jobs Now
                        </button>
                        <button
                            className="btn-secondary text-lg px-8 py-4"
                            onClick={() => navigate('/signup')}
                            aria-label="Sign up for free"
                        >
                            Sign Up Free
                        </button>
                    </div>

                    <button
                        className="btn-tertiary text-lg underline"
                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        aria-label="Learn how ApplyWizz works"
                    >
                        How It Works →
                    </button>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap justify-center gap-8 pt-12 text-text-secondary">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">✨</span>
                            <span className="text-sm font-semibold">AI-Powered Matching</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">⚡</span>
                            <span className="text-sm font-semibold">Fresh Jobs Daily</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            <span className="text-sm font-semibold">70,000+ Jobs</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
