
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BarChart3, 
  Brain, 
  BookOpen, 
  Calendar, 
  User, 
  Settings, 
  Shield, 
  HelpCircle, 
  Moon, 
  LogOut 
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <aside className="w-[260px] bg-[#101124] border-r border-[#2B2E3D]/30 flex flex-col items-center py-6 max-sm:hidden">
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <div className="flex items-center px-6 mb-10">
          <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center mr-3">
            <img 
              src="/lovable-uploads/63f5d9eb-a8ae-4a52-9f1c-d5353be3f7e4.png" 
              alt="Trade Republic Logo"
              className="w-6 h-6"
            />
          </div>
          <h1 className="text-white text-xl font-bold">Trade Republic</h1>
        </div>
        
        {/* Main Navigation */}
        <div className="w-full px-4 mb-8">
          <nav className="space-y-1">
            <Link 
              to="/" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Home</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/dashboard') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link 
              to="/stocks" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/stocks') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              <span className="font-medium">Stocks Analytics</span>
            </Link>
            
            <Link 
              to="/ai-advisor" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/ai-advisor') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <Brain className="w-5 h-5 mr-3" />
              <span className="font-medium">AI Advisor</span>
            </Link>
            
            <Link 
              to="/financial-narrative" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/financial-narrative') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span className="font-medium">Financial summary</span>
            </Link>
            
            <Link 
              to="/finance-journey" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/finance-journey') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              <span className="font-medium">Financial Journey</span>
            </Link>
            
            <Link 
              to="/accounts" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/accounts') 
                  ? 'bg-[#3F51B5] text-white' 
                  : 'text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white'
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              <span className="font-medium">Accounts</span>
            </Link>
          </nav>
        </div>
        
        {/* Settings & Security */}
        <div className="w-full px-4">
          <nav className="space-y-1">
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-3 rounded-lg text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white transition-all"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Settings</span>
            </Link>
            
            <Link 
              to="/security" 
              className="flex items-center px-4 py-3 rounded-lg text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white transition-all"
            >
              <Shield className="w-5 h-5 mr-3" />
              <span className="font-medium">Security</span>
            </Link>
            
            <Link 
              to="/help" 
              className="flex items-center px-4 py-3 rounded-lg text-[#8E9196] hover:bg-[#1A1F2C]/40 hover:text-white transition-all"
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              <span className="font-medium">Help Centre</span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Footer - Dark Mode Toggle */}
      <div className="mt-auto w-full px-4">
        <div className="border-t border-[#2B2E3D] pt-4 mt-8 px-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-[36px] h-[36px] rounded-full bg-[#D6BCFA] flex items-center justify-center mr-3 text-[#121525] font-medium text-sm">
                MG
              </div>
              <div>
                <p className="text-white text-sm font-medium">Max Günther</p>
                <p className="text-[#8E9196] text-xs">Premium Plan</p>
              </div>
            </div>
            <button className="text-[#8E9196] hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-3 py-2 bg-[#1A1F2C]/40 rounded-lg">
            <div className="flex items-center">
              <Moon className="w-4 h-4 text-[#8E9196] mr-2" />
              <span className="text-[#8E9196] text-sm">Dark Mode</span>
            </div>
            <div className="w-10 h-5 bg-[#3F51B5] rounded-full relative">
              <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 left-5 transform transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
