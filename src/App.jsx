import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import HowItWorks from './components/HowItWorks';
import FeaturedJobs from './components/FeaturedJobs';
import JobTypeCategories from './components/JobTypeCategories';
import DomainGrid from './components/DomainGrid';
import TrustSection from './components/TrustSection';
import CTABanner from './components/CTABanner';
import Footer from './components/Footer';

// Job Listings imports
import JobListingsHub from './JobListings/pages/JobListingsHub';
import CareerPortalsPage from './JobListings/pages/CareerPortalsPage';
import LinkedInEasyApplyPage from './JobListings/pages/LinkedInEasyApplyPage';
import IndeedEasyApplyPage from './JobListings/pages/IndeedEasyApplyPage';
import W2ContractsPage from './JobListings/pages/W2ContractsPage';
import C2CContractsPage from './JobListings/pages/C2CContractsPage';
import StaffingAgenciesPage from './JobListings/pages/StaffingAgenciesPage';
import SponsoredJobsPage from './JobListings/pages/SponsoredJobsPage';

// Domain imports
import DomainsHub from './Domains/pages/DomainsHub';
import SoftwareEngineeringPage from './Domains/pages/SoftwareEngineeringPage';
import DataSciencePage from './Domains/pages/DataSciencePage';
import ProductManagementPage from './Domains/pages/ProductManagementPage';

// About import
import AboutPage from './About/pages/AboutPage';

// Signup import
import Signup from './pages/Signup';

// Pricing import
import PricingPage from './pages/PricingPage';

// Homepage Component
const Homepage = () => {
  return (
    <>
      <Hero />
      <ValueProposition />
      <HowItWorks />
      <FeaturedJobs />
      <JobTypeCategories />
      <DomainGrid />
      <TrustSection />
      <CTABanner />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-bg">
        <Navbar />
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* About Page */}
          <Route path="/about" element={<AboutPage />} />

          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />

          {/* Pricing Page */}
          <Route path="/pricing" element={<PricingPage />} />

          {/* Job Listings Hub */}
          <Route path="/jobs" element={<JobListingsHub />} />

          {/* Job Category Pages */}
          <Route path="/jobs/career-portals" element={<CareerPortalsPage />} />
          <Route path="/jobs/linkedin-easy-apply" element={<LinkedInEasyApplyPage />} />
          <Route path="/jobs/indeed-easy-apply" element={<IndeedEasyApplyPage />} />
          <Route path="/jobs/w2-contracts" element={<W2ContractsPage />} />
          <Route path="/jobs/c2c-contracts" element={<C2CContractsPage />} />
          <Route path="/jobs/staffing-agencies" element={<StaffingAgenciesPage />} />
          <Route path="/jobs/sponsored" element={<SponsoredJobsPage />} />

          {/* Domains Hub */}
          <Route path="/domains" element={<DomainsHub />} />

          {/* Domain-Specific Pages */}
          <Route path="/jobs/software-engineering" element={<SoftwareEngineeringPage />} />
          <Route path="/jobs/data-science" element={<DataSciencePage />} />
          <Route path="/jobs/product-management" element={<ProductManagementPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
