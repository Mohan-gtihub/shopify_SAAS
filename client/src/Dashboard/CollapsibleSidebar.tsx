import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChartColumn, ChevronDown, ChevronUp, LogOut, User2Icon, Store, BarChart, ShoppingCart, MapPin, Layout, Share2, Calendar } from 'lucide-react'; // Import Calendar icon
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useBrand } from '@/context/BrandContext';
import axios from 'axios';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Logo from '@/components/dashboard_component/Logo';
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea from shadcn

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { selectedBrandId, setSelectedBrandId, brands, setBrands } = useBrand();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null); // Reference for the sidebar

  const baseURL =
    import.meta.env.PROD
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_LOCAL_API_URL;

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/brands/all`, { withCredentials: true });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, [setBrands]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const reports = [
    { name: "Monthly Ad Metrics Reports", icon: <BarChart />, path: `/ad-metrics/${selectedBrandId}` },
    { name: "Daily E-Commerce Metrics Reports", icon: <ShoppingCart />, path: `/ecommerce-metrics/${selectedBrandId}` },
    { name: "City based Reports", icon: <MapPin />, path: `/city-metrics/${selectedBrandId}` },
    { name: "Landing Page based Reports", icon: <Layout />, path: `/page-metrics/${selectedBrandId}` },
    { name: "Referring Channel based Reports", icon: <Share2 />, path: `/channel-metrics/${selectedBrandId}` },
  ];

  const isReportSelected = reports.some(report => location.pathname === report.path); // Check if any report is selected

  return (
    <TooltipProvider>
      <div
        ref={sidebarRef} // Attach the ref to the sidebar
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'w-64' : 'w-16'}`}
        style={{ height: '100vh' }} // Ensure the sidebar takes full viewport height
      >
        <div className={`flex-1 overflow-y-auto ${isExpanded ? 'h-[calc(100vh-64px)]' : 'h-[calc(100vh-16px)]'}`}>
          <ScrollArea className="h-full">
            <div className="flex justify-end p-4">
              <button
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white focus:outline-none"
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            </div>
            <nav className="mt-3">
              <SidebarItem
                icon={<Logo />}
                text={"Messold"}
                isExpanded={isExpanded}
                isSelected={true}
                tooltipContent="Messold"
              />
            </nav>
            <nav className="mt-3">
              <SidebarItem
                icon={<Store size={24} />}
                text={selectedBrandId ? brands.find(b => b._id === selectedBrandId)?.name.replace(/_/g, ' ') || "Unknown Brand" : "Your Brands"}
                isExpanded={isExpanded}
                openIcon={<ChevronUp />}
                closeIcon={<ChevronDown />}
                isSelected={!!selectedBrandId}
                tooltipContent="Your Brands"
              >
                {brands.map(brand => (
                  <SidebarChild
                    key={brand._id}
                    path={`/business-dashboard/${brand._id}`} // Navigate to the brand's business dashboard
                    text={brand.name.replace(/_/g, ' ')}
                    onClick={() => {
                      setSelectedBrandId(brand._id); // Set the selected brand ID
                      navigate(`/business-dashboard/${brand._id}`); // Navigate to the brand's business dashboard
                      // Do not toggle the sidebar
                    }}
                    isSelected={selectedBrandId === brand._id} // Highlight selected brand
                  />
                ))}
              </SidebarItem>
              <SidebarItem
                icon={<ChartColumn size={24} />}
                text="Analytics"
                isExpanded={isExpanded}
                openIcon={<ChevronUp />}
                closeIcon={<ChevronDown />}
                isSelected={location.pathname.includes("/business-dashboard") || location.pathname.includes("/analytics-dashboard")}
                tooltipContent="Analytics"
              >
                <SidebarChild path={`/business-dashboard/${selectedBrandId || ''}`} text="Business Dashboard" />
                <SidebarChild path={`/analytics-dashboard/${selectedBrandId || ''}`} text="Metrics Dashboard"
                  disabled={
                    !selectedBrandId || 
                    !brands || 
                    brands.length === 0 || 
                    !brands.find(b => b._id === selectedBrandId)?.fbAdAccounts?.length
                  } />
              </SidebarItem>
              <SidebarItem
                icon={<Calendar />}
                text="Reports"
                isExpanded={isExpanded}
                openIcon={<ChevronUp />}
                closeIcon={<ChevronDown />}
                isSelected={isReportSelected} // Highlight if any report is selected
                tooltipContent="Reports"
              >
                {reports.map(report => (
                  <SidebarChild
                    key={report.name}
                    path={report.path}
                    text={report.name}
                    onClick={() => navigate(report.path)} 
                    isSelected={location.pathname === report.path} // Check if the report is selected
                  >
                    {report.icon}
                  </SidebarChild>
                ))}
              </SidebarItem>
            </nav>
          </ScrollArea>
        </div>

        {/* Fixed User Profile and Logout Section */}
        <div className="flex flex-col p-4">
          <UserProfile isExpanded={isExpanded} />
          <LogoutButton handleLogout={() => {
            const baseURL = import.meta.env.PROD
              ? import.meta.env.VITE_API_URL
              : import.meta.env.VITE_LOCAL_API_URL;

            axios.post(`${baseURL}/api/auth/logout`, {}, { withCredentials: true })
              .then(() => {
                setUser(null);
                resetBrand();
                navigate('/');
              })
              .catch(error => console.error('Error logging out:', error));
          }} isExpanded={isExpanded} /> {/* Pass isExpanded prop here */}
        </div>
      </div>
    </TooltipProvider>
  );
}

// SidebarItem and SidebarChild components remain unchanged.

function SidebarItem({ icon, text, isExpanded, openIcon, closeIcon, children, isSelected, tooltipContent }: {
  icon?: React.ReactNode;
  text: string;
  isExpanded: boolean;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  children?: React.ReactNode;
  isSelected: boolean;
  tooltipContent: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const content = (
    <div
      onClick={handleToggle}
      className={`flex items-center px-4 py-2 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors
         duration-200 cursor-pointer ${isSelected ? 'text-white font-semibold relative' : 'text-gray-100'}`}
    >
      <span className="mr-4">{icon}</span>
      {isExpanded && <span className="text-sm">{text}</span>}
      {isExpanded && <span className="ml-auto">{isOpen ? openIcon : closeIcon}</span>}
    </div>
  );

  return (
    <div>
      {!isExpanded ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className={React.Children.count(children) > 0 ? 'mb-4' : ''}>{tooltipContent}</p>
            {React.Children.map(children, (child) => (
              <div className="relative">
                <div className="absolute top-0 w-1 h-full bg-gray-500" />
                {child}
              </div>
            ))}
          </TooltipContent>
        </Tooltip>
      ) : (
        content
      )}
      {isOpen && isExpanded && (
        <div className="relative pl-8">
          <div className="absolute top-0 w-1 h-full bg-gray-500" />
          {React.Children.map(children, (child) => (
            <div>{child}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ... existing code ...

function SidebarChild({
  path,
  text,
  onClick,
  disabled,
  isSelected, 
}: {
  path: string;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  isSelected?: boolean; // New prop
}) {
  const { pathname } = useLocation();
  const isSelectedChild = isSelected || pathname === path;

  const baseClasses = `flex items-center text-sm w-full p-3 transition-colors duration-200 ${
    isSelectedChild ? 'text-white font-semibold relative bg-gray-700' : 'text-gray-100'
  } ${disabled ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-700'}`;

  return disabled ? (
    <div className={baseClasses}>
      {text}
      {isSelectedChild && <div className="absolute left-0 w-1 h-full bg-white" />} {/* White indication */}
    </div>
  ) : (
    <NavLink
      to={path}
      className={baseClasses}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {text}
      {isSelectedChild && <div className="absolute left-0 top-0 w-1 h-full bg-white" />} {/* Adjusted position */}
    </NavLink>
  );
}

// ... existing code ...
function UserProfile({ isExpanded }: { isExpanded: boolean }) {
  const { user } = useUser();

  const userProfileContent = (
    <div className={'flex items-center gap-2 px-2 py-2 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer'}>
      <span className="text-gray-300 hover:text-white">
        <User2Icon size={24} />
      </span>
      {isExpanded && <span className="text-sm">{user?.username || 'user'}</span>}
    </div>
  );

  return (
    <div>
      {!isExpanded ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {userProfileContent}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{user?.username || 'user'}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        userProfileContent
      )}
    </div>
  );
}

function LogoutButton({ handleLogout, isExpanded }: { handleLogout: () => void; isExpanded: boolean }) { // Added isExpanded prop
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={'flex items-center gap-2 px-2 py-2 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer'}>
          <span className="text-gray-300 hover:text-white">
            <LogOut onClick={handleLogout} size={24} />
          </span>
          {isExpanded && <span className="text-sm">Logout</span>} {/* Render text only when sidebar is expanded */}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Logout</p>
      </TooltipContent>
    </Tooltip>
  );
}