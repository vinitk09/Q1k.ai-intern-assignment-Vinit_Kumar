'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';

// Assuming your ThemeContext is in this file, adjust the import path as needed
import { useTheme } from './theme-provider'; 

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or nothing on the server
    return <div className="w-[36px] h-[36px]"></div>;
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function Header() {
  return (
    <header className="p-4 border-b">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-bold">
          Task Manager
        </a>
        <div className="flex items-center space-x-4">
          
          <ThemeToggleButton />
        </div>
      </nav>
    </header>
  );
}