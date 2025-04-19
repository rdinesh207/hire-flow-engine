
import { User } from '../../types';

export const users: User[] = [
  {
    id: "user-1",
    name: "Emily Chen",
    email: "emily@example.com",
    role: "applicant",
    createdAt: "2023-04-10T08:30:00Z",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user-2",
    name: "Jordan Smith",
    email: "jordan@example.com",
    role: "recruiter",
    createdAt: "2023-03-15T10:45:00Z",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user-3",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "recruiter",
    createdAt: "2023-02-20T14:20:00Z",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user-4",
    name: "Morgan Williams",
    email: "morgan@example.com",
    role: "admin",
    createdAt: "2023-01-05T09:10:00Z",
    avatar: "https://i.pravatar.cc/150?img=4"
  }
];

// Demo login credentials
export const demoLogins = [
  { email: "emily@example.com", password: "demo123", role: "applicant" },
  { email: "jordan@example.com", password: "demo123", role: "recruiter" }
];
