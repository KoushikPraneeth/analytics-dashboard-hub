import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ChannelSearch } from "./components/ChannelSearch";
import { ChannelDashboard } from "./components/ChannelDashboard";
import ChannelComparison from "./components/ChannelComparison";
import { ChannelBasic } from "./lib/api";
import { Button } from "./components/ui/button";

const App = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelBasic | null>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen bg-background transition-colors duration-300 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {isDarkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <Router>
        <nav className="fixed top-4 left-4 z-50 flex gap-2">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/comparison">Comparison</Link>
          </Button>
        </nav>
        
        <main className="container mx-auto py-4">
          <Routes>
            <Route path="/" element={
              selectedChannel ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ChannelDashboard channelId={selectedChannel.id} />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <ChannelSearch onChannelSelect={setSelectedChannel} />
                </div>
              )
            } />
            <Route path="/comparison" element={<ChannelComparison />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
