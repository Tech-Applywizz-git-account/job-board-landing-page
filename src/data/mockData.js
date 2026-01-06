// Mock data for the landing page

export const featuredJobs = [
    {
        id: 1,
        company: 'Google',
        title: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        matchScore: null, // Show "Login to see score" if null
        category: 'Easy Apply',
        logo: '🔍'
    },
    {
        id: 2,
        company: 'Microsoft',
        title: 'Cloud Solutions Architect',
        location: 'Seattle, WA',
        matchScore: null,
        category: 'Contract',
        logo: '💻'
    },
    {
        id: 3,
        company: 'Amazon',
        title: 'Product Manager',
        location: 'Austin, TX',
        matchScore: null,
        category: 'Easy Apply',
        logo: '📦'
    },
    {
        id: 4,
        company: 'Meta',
        title: 'Data Scientist',
        location: 'Menlo Park, CA',
        matchScore: null,
        category: 'Remote',
        logo: '📊'
    },
];

export const jobTypes = [
    {
        id: 1,
        title: 'Career Portal Jobs',
        description: 'Direct applications to company career pages',
        icon: '🏢',
    },
    {
        id: 2,
        title: 'LinkedIn Easy Apply',
        description: 'One-click applications on LinkedIn',
        icon: '💼',
    },
    {
        id: 3,
        title: 'Indeed Easy Apply',
        description: 'Quick apply jobs from Indeed',
        icon: '✅',
    },
    {
        id: 4,
        title: 'W2 Contract Jobs',
        description: 'Full-time contract opportunities',
        icon: '📋',
    },
    {
        id: 5,
        title: 'C2C Contract Jobs',
        description: 'Corp-to-corp consulting roles',
        icon: '🤝',
    },
    {
        id: 6,
        title: 'Staffing Agency Jobs',
        description: 'Positions through recruitment agencies',
        icon: '🎯',
    },
    {
        id: 7,
        title: 'Sponsored Jobs',
        description: 'Featured opportunities from top employers',
        icon: '⭐',
    },
];

export const domains = [
    'Software Engineering',
    'Data Science',
    'Cybersecurity',
    'Product Management',
    'Finance',
    'Marketing',
    'Business Analyst',
    'QA Engineering',
    'DevOps',
    'Cloud Architecture',
    'Healthcare IT',
    'AI/Machine Learning',
    'Mobile Development',
    'Full Stack Development',
    'Backend Engineering',
    'Frontend Engineering',
    'UX/UI Design',
    'Project Management',
    'Sales',
    'Customer Success',
];

export const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Software Engineer',
        text: 'ApplyWizz helped me find my dream job in just 2 weeks! The match scores were incredibly accurate.',
        avatar: '👩‍💻',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Data Analyst',
        text: 'The ability to see jobs from all sources in one place saved me hours of searching. Highly recommend!',
        avatar: '👨‍💼',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Product Manager',
        text: 'I love that ApplyWizz only shows fresh jobs. No more wasting time on outdated listings!',
        avatar: '👩‍🎓',
    },
];

export const stats = [
    {
        id: 1,
        value: '70,000+',
        label: 'Jobs Matched',
    },
    {
        id: 2,
        value: '50,000+',
        label: 'Active Job Seekers',
    },
    {
        id: 3,
        value: '85%+',
        label: 'Relevance Accuracy',
    },
    {
        id: 4,
        value: '73+',
        label: 'Job Domains',
    },
];
