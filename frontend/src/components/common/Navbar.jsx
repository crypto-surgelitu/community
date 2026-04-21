import { Bell, Search } from 'lucide-react';

export function Navbar() {
  return (
    <header className="glass-nav h-20 flex items-center justify-between px-8 z-40">
      <div className="max-w-md w-full relative hidden sm:block">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="block w-full pl-11 pr-4 py-2.5 rounded-full text-sm bg-surface-low border-transparent focus:bg-surface-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <button className="relative p-2.5 text-on-surface-variant hover:bg-surface-low rounded-full transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-surface-lowest"></span>
        </button>
      </div>
    </header>
  );
}
