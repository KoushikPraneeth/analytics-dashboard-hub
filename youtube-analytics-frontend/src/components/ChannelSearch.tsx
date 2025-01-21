import { useState } from 'react';
import { Search, Youtube } from 'lucide-react';
import { ChannelBasic, searchChannels } from '../lib/api';
import { Button } from './ui/button';

interface ChannelSearchProps {
  onChannelSelect: (channel: ChannelBasic) => void;
}

export const ChannelSearch = ({ onChannelSelect }: ChannelSearchProps) => {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState<ChannelBasic[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchChannels(query);
      setChannels(results);
    } catch (error) {
      console.error('Error searching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Youtube className="w-10 h-10 text-red-600 mr-2" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            YouTube Analytics
          </h1>
        </div>
        <p className="text-muted-foreground">
          Search for a YouTube channel to view detailed analytics and insights
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter channel name..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            disabled={loading}
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          disabled={loading}
          size="sm"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {channels.length > 0 && (
        <div className="space-y-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onChannelSelect(channel)}
              className="flex items-center p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <img
                src={channel.thumbnailUrl}
                alt={channel.title}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg">{channel.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {channel.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {channels.length === 0 && query && !loading && (
        <div className="text-center text-muted-foreground py-8">
          No channels found matching your search
        </div>
      )}
    </div>
  );
};