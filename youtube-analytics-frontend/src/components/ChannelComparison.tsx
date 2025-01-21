import { useState } from 'react';
import { searchChannels, getChannelStatistics } from '../lib/api';
import ChannelCard from './ChannelCard';

interface ChannelBasic {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

import { Channel } from '../lib/api';

export default function ChannelComparison() {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState<ChannelBasic[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchChannels(query);
      setChannels(results);
    } catch (err) {
      setError('Failed to search channels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChannel = async (channelId: string) => {
    if (selectedChannels.length >= 2) return;
    
    try {
      const stats = await getChannelStatistics(channelId);
      const channelData: Channel = {
        id: stats.id,
        title: stats.details.title,
        description: stats.details.description,
        thumbnailUrl: stats.details.thumbnailUrl,
        subscribers: parseInt(stats.statistics.subscriberCount),
        views: parseInt(stats.statistics.viewCount),
        videos: parseInt(stats.statistics.videoCount)
      };
      setSelectedChannels(prev => [...prev, channelData]);
    } catch (err) {
      setError('Failed to get channel statistics');
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Channel Comparison</h1>
      
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for YouTube channels..."
          className="flex-1 p-2 border rounded"
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {selectedChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>

      {channels.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleSelectChannel(channel.id)}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.title}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{channel.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {channel.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
