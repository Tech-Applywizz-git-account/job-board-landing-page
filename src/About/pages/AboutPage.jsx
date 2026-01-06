import { useEffect } from 'react';
import AboutHero from '../components/AboutHero';
import OurMission from '../components/OurMission';
import ProblemSolution from '../components/ProblemSolution';
import WhyDifferent from '../components/WhyDifferent';
import HowItWorksAbout from '../components/HowItWorksAbout';
import OurImpact from '../components/OurImpact';
import VisionValues from '../components/VisionValues';
import WhoWeServe from '../components/WhoWeServe';
import TheTeam from '../components/TheTeam';
import AboutFAQ from '../components/AboutFAQ';
import AboutCTA from '../components/AboutCTA';

const AboutPage = () => {
    useEffect(() => {
        document.title = 'About ApplyWizz | Smart Job Matching Platform';
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen">
            <AboutHero />
            <OurMission />
            <ProblemSolution />
            <WhyDifferent />
            <HowItWorksAbout />
            <OurImpact />
            <VisionValues />
            <WhoWeServe />
            <TheTeam />
            <AboutFAQ />
            <AboutCTA />
        </div>
    );
};

export default AboutPage;
