import { Note, Notebook, User } from '../types';

export const user: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const notebooks: Notebook[] = [
  {
    id: 'nb1',
    title: 'Work Projects',
    notes: ['n1', 'n2', 'n3'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20'),
  },
  {
    id: 'nb2',
    title: 'Personal',
    notes: ['n4', 'n5'],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-06-18'),
  },
  {
    id: 'nb3',
    title: 'Research',
    notes: ['n6'],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-06-15'),
  },
];

export const notes: Note[] = [
  {
    id: 'n1',
    title: 'Project Roadmap',
    content: `# Project Roadmap for Q3

## Key Milestones
- Complete user authentication system by July 15
- Launch beta version by August 10
- Gather user feedback through September
- Implement improvements based on feedback by October 1

## Resources Needed
- 2 additional frontend developers
- 1 UX designer for user testing
- Cloud infrastructure upgrade

## Risks and Mitigations
1. Potential delay in authentication system
   - Mitigation: Start early, use existing libraries where possible
2. User adoption might be slow
   - Mitigation: Prepare marketing campaign, offer incentives for early adopters`,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-20'),
    tags: ['work', 'planning', 'important'],
  },
  {
    id: 'n2',
    title: 'Meeting Notes - Design Team',
    content: `# Design Team Meeting - June 18, 2023

## Attendees
- Sarah (Lead Designer)
- Michael (UI Developer)
- Priya (UX Researcher)
- Alex (Product Manager)

## Discussion Points
1. New design system implementation
2. User testing results for dashboard redesign
3. Mobile app UI consistency issues

## Action Items
- Sarah: Finalize color palette by Friday
- Michael: Update component library documentation
- Priya: Schedule additional user testing sessions
- Alex: Share product roadmap updates with design team

## Next Meeting
June 25, 2023 at 10:00 AM`,
    createdAt: new Date('2023-06-18'),
    updatedAt: new Date('2023-06-18'),
    tags: ['work', 'meeting', 'design'],
  },
  {
    id: 'n3',
    title: 'API Documentation',
    content: `# API Documentation

## Authentication
\`\`\`
POST /api/auth/login
POST /api/auth/register
GET /api/auth/user
POST /api/auth/logout
\`\`\`

## Users
\`\`\`
GET /api/users
GET /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id
\`\`\`

## Products
\`\`\`
GET /api/products
POST /api/products
GET /api/products/:id
PATCH /api/products/:id
DELETE /api/products/:id
\`\`\`

## Error Handling
All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error`,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-06-15'),
    tags: ['work', 'development', 'documentation'],
  },
  {
    id: 'n4',
    title: 'Vacation Planning',
    content: `# Summer Vacation Ideas

## Beach Destinations
- Maldives
  - Best time: November to April
  - Activities: Snorkeling, diving, relaxing
- Hawaii
  - Best time: September to November
  - Activities: Surfing, hiking, volcano tours
- Greek Islands
  - Best time: May to October
  - Activities: Historical sites, island hopping, beaches

## Mountain Retreats
- Swiss Alps
  - Best time: June to September for hiking
  - Activities: Hiking, mountain biking, scenic train rides
- Rocky Mountains
  - Best time: July to September
  - Activities: National parks, wildlife viewing, hiking

## Budget: $3,000 - $5,000
## Time frame: 2 weeks in August

## To-Do Before Booking
- Check passport expiration
- Research COVID restrictions
- Compare flight prices
- Look into accommodations`,
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-06-18'),
    tags: ['personal', 'travel', 'planning'],
  },
  {
    id: 'n5',
    title: 'Book Recommendations',
    content: `# Books to Read in 2023

## Fiction
- "The Midnight Library" by Matt Haig
- "Klara and the Sun" by Kazuo Ishiguro
- "Project Hail Mary" by Andy Weir
- "The Lincoln Highway" by Amor Towles

## Non-Fiction
- "Atomic Habits" by James Clear
- "Noise: A Flaw in Human Judgment" by Daniel Kahneman
- "The Code Breaker" by Walter Isaacson
- "Four Thousand Weeks" by Oliver Burkeman

## Currently Reading
"The Psychology of Money" by Morgan Housel - Page 156

## Completed
- "Educated" by Tara Westover
- "The Anthropocene Reviewed" by John Green`,
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-06-10'),
    tags: ['personal', 'books', 'recommendations'],
  },
  {
    id: 'n6',
    title: 'Research on AI Ethics',
    content: `# AI Ethics Research Notes

## Key Ethical Concerns in AI
1. **Bias and Fairness**
   - Training data biases
   - Algorithmic discrimination
   - Representation issues

2. **Privacy**
   - Data collection practices
   - Surveillance capabilities
   - Right to be forgotten

3. **Transparency and Explainability**
   - Black box problem
   - Interpretable AI methods
   - Regulatory requirements

4. **Accountability**
   - Who is responsible for AI decisions?
   - Legal frameworks
   - Industry standards

## Recent Papers to Review
- "Toward Trustworthy AI Development: Mechanisms for Supporting Verifiable Claims"
- "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?"
- "Ethics of Artificial Intelligence and Robotics" (Stanford Encyclopedia of Philosophy)

## Questions for Further Research
- How can we effectively audit AI systems for bias?
- What governance structures best support ethical AI development?
- How do cultural differences impact AI ethics globally?`,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-06-15'),
    tags: ['research', 'AI', 'ethics'],
  },
];
