// ─── Jobs ───────────────────────────────────────────────────────────────────
export const dummyJobs = [
  {
    id: 'j1',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$150k – $200k',
    type: 'Full-time',
    stack: ['React', 'TypeScript', 'GraphQL'],
    posted: '2 days ago',
    logo: 'S',
    logoColor: '#635BFF',
    description: 'Build beautiful payment interfaces used by millions of businesses worldwide.',
    match: 88,
    applicants: 142,
    saved: false,
    applied: false,
  },
  {
    id: 'j2',
    title: 'Full Stack Developer',
    company: 'Notion',
    location: 'Remote',
    salary: '$130k – $170k',
    type: 'Full-time',
    stack: ['Node.js', 'React', 'PostgreSQL'],
    posted: '1 day ago',
    logo: 'N',
    logoColor: '#000000',
    description: 'Join the team making the world\'s most flexible workspace tool.',
    match: 74,
    applicants: 89,
    saved: true,
    applied: false,
  },
  {
    id: 'j3',
    title: 'Backend Engineer – Python',
    company: 'Vercel',
    location: 'New York, NY',
    salary: '$140k – $180k',
    type: 'Full-time',
    stack: ['Python', 'FastAPI', 'Redis', 'AWS'],
    posted: '3 days ago',
    logo: 'V',
    logoColor: '#000000',
    description: 'Architect serverless infrastructure powering millions of deployments.',
    match: 61,
    applicants: 203,
    saved: false,
    applied: true,
  },
  {
    id: 'j4',
    title: 'ML Engineer',
    company: 'Hugging Face',
    location: 'Remote',
    salary: '$160k – $220k',
    type: 'Full-time',
    stack: ['Python', 'PyTorch', 'Transformers', 'CUDA'],
    posted: '5 days ago',
    logo: 'H',
    logoColor: '#FF9D00',
    description: 'Push the boundaries of open-source machine learning.',
    match: 52,
    applicants: 318,
    saved: false,
    applied: false,
  },
  {
    id: 'j5',
    title: 'DevOps / Platform Engineer',
    company: 'Linear',
    location: 'San Francisco, CA',
    salary: '$135k – $175k',
    type: 'Full-time',
    stack: ['Kubernetes', 'Terraform', 'Go', 'AWS'],
    posted: '1 week ago',
    logo: 'L',
    logoColor: '#5E6AD2',
    description: 'Build the infrastructure behind the fastest issue tracker on the planet.',
    match: 45,
    applicants: 67,
    saved: true,
    applied: false,
  },
  {
    id: 'j6',
    title: 'React Native Developer',
    company: 'Figma',
    location: 'Remote (US)',
    salary: '$145k – $195k',
    type: 'Contract',
    stack: ['React Native', 'TypeScript', 'Expo'],
    posted: '4 days ago',
    logo: 'F',
    logoColor: '#F24E1E',
    description: 'Bring Figma\'s design power to mobile devices.',
    match: 79,
    applicants: 95,
    saved: false,
    applied: false,
  }
]

// ─── Kanban Applications ─────────────────────────────────────────────────────
export const dummyApplications = {
  applied: [
    { id: 'a1', role: 'Frontend Engineer', company: 'Airbnb', date: 'Mar 12', salary: '$160k', logo: 'A', logoColor: '#FF5A5F' },
    { id: 'a2', role: 'React Developer', company: 'Shopify', date: 'Mar 18', salary: '$145k', logo: 'S', logoColor: '#96BF48' },
    { id: 'a3', role: 'Full Stack Dev', company: 'GitHub', date: 'Mar 20', salary: '$155k', logo: 'G', logoColor: '#24292E' },
  ],
  interview: [
    { id: 'a4', role: 'Senior Engineer', company: 'Vercel', date: 'Mar 5', salary: '$175k', logo: 'V', logoColor: '#000', interviewDate: 'Apr 2' },
    { id: 'a5', role: 'Tech Lead', company: 'Framer', date: 'Feb 28', salary: '$190k', logo: 'F', logoColor: '#0055FF', interviewDate: 'Apr 5' },
  ],
  offer: [
    { id: 'a6', role: 'Sr. Frontend Eng', company: 'Linear', date: 'Feb 15', salary: '$165k', logo: 'L', logoColor: '#5E6AD2', offerExpiry: 'Apr 10' },
  ],
  rejected: [
    { id: 'a7', role: 'Staff Engineer', company: 'Meta', date: 'Feb 10', salary: '$200k', logo: 'M', logoColor: '#0866FF' },
  ]
}

// ─── Resumes ─────────────────────────────────────────────────────────────────
export const dummyResumes = [
  { id: 'r1', name: 'Resume_v1_General.pdf', atsScore: 62, uploaded: 'Feb 20, 2024', size: '245 KB', skills: 14, experience: '3 yrs', active: false },
  { id: 'r2', name: 'Resume_v2_Frontend.pdf', atsScore: 78, uploaded: 'Mar 5, 2024', size: '238 KB', skills: 18, experience: '3 yrs', active: true },
  { id: 'r3', name: 'Resume_v3_Tailored_Stripe.pdf', atsScore: 91, uploaded: 'Mar 18, 2024', size: '251 KB', skills: 22, experience: '3 yrs', active: false },
]

// ─── Interview Questions ──────────────────────────────────────────────────────
export const dummyInterviewQuestions = {
  technical: [
    { id: 'q1', question: 'Explain the concept of closures in JavaScript and provide a practical example.' },
    { id: 'q2', question: 'How does React\'s reconciliation algorithm work? What is the virtual DOM?' },
    { id: 'q3', question: 'What are the SOLID principles? Give examples for each.' },
    { id: 'q4', question: 'Describe the difference between REST and GraphQL. When would you use each?' },
    { id: 'q5', question: 'How would you optimize a slow database query? Walk me through your process.' },
  ],
  hr: [
    { id: 'q6', question: 'Tell me about a time you disagreed with a team member and how you resolved it.' },
    { id: 'q7', question: 'Where do you see yourself in 5 years? How does this role align?' },
    { id: 'q8', question: 'Describe a challenging project and how you managed the complexity.' },
    { id: 'q9', question: 'What\'s your approach to learning a new technology or framework?' },
    { id: 'q10', question: 'How do you prioritize tasks when everything feels urgent?' },
  ]
}

// ─── Skill Roadmap ───────────────────────────────────────────────────────────
export const dummyRoadmap = {
  dreamJob: 'Senior ML Engineer',
  requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Statistics', 'Linear Algebra', 'MLOps', 'Docker', 'AWS SageMaker', 'Data Pipelines', 'Model Deployment'],
  yourSkills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Docker'],
  missingSkills: ['PyTorch', 'TensorFlow', 'Statistics', 'Linear Algebra', 'MLOps', 'AWS SageMaker', 'Data Pipelines', 'Model Deployment'],
  roadmap: [
    { phase: 'Week 1–2', title: 'Foundations', tasks: ['Python for Data Science (NumPy, Pandas)', 'Linear Algebra basics (Khan Academy)', 'Statistics fundamentals (distributions, hypothesis testing)'] },
    { phase: 'Week 3–6', title: 'Core ML', tasks: ['PyTorch fundamentals', 'scikit-learn for classical ML', 'Build 3 classification/regression projects', 'Kaggle beginner competitions'] },
    { phase: 'Week 7–10', title: 'Deep Learning', tasks: ['Neural networks from scratch', 'CNNs and RNNs with PyTorch', 'Fine-tune a HuggingFace model', 'Deploy model to FastAPI endpoint'] },
    { phase: 'Week 11–14', title: 'MLOps & Production', tasks: ['Docker & containerization', 'AWS SageMaker basics', 'MLflow for experiment tracking', 'Build an end-to-end ML pipeline'] },
  ]
}

// ─── Recruiter Candidates ─────────────────────────────────────────────────────
export const dummyCandidates = [
  { id: 'c1', name: 'Aisha Patel', role: 'Frontend Engineer', score: 94, atsScore: 91, skills: ['React', 'TypeScript', 'GraphQL', 'CSS'], experience: '5 years', strengths: ['Strong portfolio', 'Open source contributor', 'Fast learner'], weaknesses: ['No backend experience'], avatar: 'AP' },
  { id: 'c2', name: 'Marcus Johnson', role: 'Frontend Engineer', score: 82, atsScore: 78, skills: ['React', 'JavaScript', 'CSS', 'Node.js'], experience: '4 years', strengths: ['Full-stack capability', 'Team lead experience'], weaknesses: ['TypeScript limited', 'No GraphQL'], avatar: 'MJ' },
  { id: 'c3', name: 'Priya Sharma', role: 'Frontend Engineer', score: 76, atsScore: 72, skills: ['Vue.js', 'React', 'Python', 'SQL'], experience: '3 years', strengths: ['Multi-framework', 'Data engineering exposure'], weaknesses: ['React experience newer', 'No TS'], avatar: 'PS' },
  { id: 'c4', name: 'Jordan Lee', role: 'Frontend Engineer', score: 65, atsScore: 62, skills: ['React', 'HTML', 'CSS', 'jQuery'], experience: '2 years', strengths: ['Design eye', 'Fast CSS skills'], weaknesses: ['Modern tooling gaps', 'No TypeScript', 'Limited React patterns'], avatar: 'JL' },
]

// ─── Notifications ────────────────────────────────────────────────────────────
export const dummyNotifications = [
  { id: 'n1', type: 'match', message: 'New job match: Staff Engineer at Loom (89% match)', time: '2h ago', read: false },
  { id: 'n2', type: 'alert', message: 'Interview reminder: Vercel screen call tomorrow at 2 PM', time: '5h ago', read: false },
  { id: 'n3', type: 'tip', message: 'Add quantifiable metrics to your resume to boost ATS score', time: '1d ago', read: true },
  { id: 'n4', type: 'match', message: '3 new jobs match your ML Engineer profile', time: '2d ago', read: true },
]
