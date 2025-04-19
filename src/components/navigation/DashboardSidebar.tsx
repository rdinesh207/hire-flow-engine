
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Search,
  FileText,
  Users,
  User,
  ListFilter,
} from "lucide-react";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isRecruiter = user.role === 'recruiter' || user.role === 'admin';
  const isApplicant = user.role === 'applicant' || user.role === 'admin';
  
  const recruiterMenuItems = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      url: "/recruiter",
      active: location.pathname === "/recruiter",
    },
    {
      icon: FileText,
      title: "Jobs",
      url: "/recruiter/jobs",
      active: location.pathname.startsWith("/recruiter/jobs"),
    },
    {
      icon: Users,
      title: "Candidates",
      url: "/recruiter/candidates",
      active: location.pathname.startsWith("/recruiter/candidates"),
    },
    {
      icon: Search,
      title: "Search",
      url: "/recruiter/search",
      active: location.pathname === "/recruiter/search",
    }
  ];

  const applicantMenuItems = [
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      url: "/applicant",
      active: location.pathname === "/applicant",
    },
    {
      icon: Search,
      title: "Find Jobs",
      url: "/applicant/jobs",
      active: location.pathname.startsWith("/applicant/jobs"),
    },
    {
      icon: ListFilter,
      title: "Compare",
      url: "/applicant/compare",
      active: location.pathname === "/applicant/compare",
    },
    {
      icon: User,
      title: "My Profile",
      url: "/applicant/profile",
      active: location.pathname === "/applicant/profile",
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">HireFlow</span>
        </Link>
        <div className="flex-1" />
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent>
        {isRecruiter && (
          <SidebarGroup>
            <SidebarGroupLabel>Recruiter</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recruiterMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={item.active}>
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {isApplicant && (
          <SidebarGroup>
            <SidebarGroupLabel>Applicant</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {applicantMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={item.active}>
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-6 py-4 border-t border-sidebar-border">
          <div className="text-xs text-white/50">
            HireFlow Engine v1.0.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
