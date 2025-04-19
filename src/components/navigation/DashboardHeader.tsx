
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 sticky top-0 z-10">
      <SidebarTrigger className="md:hidden mr-4" />
      <h1 className="font-semibold text-lg hidden md:block">
        {user.role === 'recruiter' ? 'Recruiter Dashboard' : 'Applicant Dashboard'}
      </h1>
      <div className="flex-1" />
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link to="/">
            Home
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-recruitment-primary text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={user.role === 'recruiter' ? '/recruiter' : '/applicant'}>
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={user.role === 'recruiter' ? '/recruiter/jobs' : '/applicant/profile'}>
                {user.role === 'recruiter' ? 'My Jobs' : 'My Profile'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
