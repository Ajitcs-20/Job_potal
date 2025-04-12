export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
  logo: string;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'We are looking for an experienced software engineer to join our team...',
    requirements: [
      '5+ years of experience in software development',
      'Strong knowledge of React and Node.js',
      'Experience with cloud platforms (AWS/Azure)',
      'Excellent problem-solving skills'
    ],
    salary: '$120,000 - $150,000',
    postedDate: '2024-03-20',
    logo: 'https://via.placeholder.com/50'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our product team to drive innovation and user experience...',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical skills',
      'Experience with agile methodologies',
      'Excellent communication skills'
    ],
    salary: '$130,000 - $160,000',
    postedDate: '2024-03-19',
    logo: 'https://via.placeholder.com/50'
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Digital Solutions',
    location: 'Remote',
    type: 'Contract',
    description: 'Looking for a skilled frontend developer to work on our web applications...',
    requirements: [
      '3+ years of frontend development',
      'Proficiency in React and TypeScript',
      'Experience with modern CSS frameworks',
      'Strong portfolio of previous work'
    ],
    salary: '$80,000 - $100,000',
    postedDate: '2024-03-18',
    logo: 'https://via.placeholder.com/50'
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AI Analytics Co.',
    location: 'Boston, MA',
    type: 'Full-time',
    description: 'Join our data science team to develop cutting-edge AI solutions...',
    requirements: [
      'Master\'s degree in Computer Science or related field',
      'Experience with machine learning frameworks',
      'Strong programming skills in Python',
      'Experience with big data technologies'
    ],
    salary: '$140,000 - $170,000',
    postedDate: '2024-03-17',
    logo: 'https://via.placeholder.com/50'
  },
  {
    id: '5',
    title: 'UX Designer',
    company: 'Creative Design Studio',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Looking for a talented UX designer to create beautiful user experiences...',
    requirements: [
      '3+ years of UX design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating user-centered design',
      'Experience with user research and testing'
    ],
    salary: '$90,000 - $120,000',
    postedDate: '2024-03-16',
    logo: 'https://via.placeholder.com/50'
  }
]; 