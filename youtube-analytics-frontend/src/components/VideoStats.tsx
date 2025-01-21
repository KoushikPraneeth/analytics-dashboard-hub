import { useEffect, useState } from 'react';
import { getVideoStatistics } from '../lib/api';

interface VideoStatsProps {
  videoId: string;
}

interface VideoStatistics {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  videoUrl: string;
}

export const VideoStats = ({ videoId }: VideoStatsProps) => {
  const [stats, setStats] = useState<VideoStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getVideoStatistics(videoId);
        setStats(data);
      } catch (err) {
        setError('Failed to fetch video statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div 
      className="video-stats cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden bg-white"
      onClick={() => window.open(stats.videoUrl, '_blank')}
    >
      <div className="video-thumbnail">
        <img 
          src={stats.thumbnailUrl} 
          alt={stats.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="video-info p-4">
        <h2 className="text-lg font-semibold mb-2">{stats.title}</h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{stats.description}</p>
        <div className="stats-grid grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="stat-item bg-gray-50 p-2 rounded-lg text-center">
            <span>Views</span>
            <span>{stats.viewCount}</span>
          </div>
          <div className="stat-item">
            <span>Likes</span>
            <span>{stats.likeCount}</span>
          </div>
          <div className="stat-item">
            <span>Comments</span>
            <span>{stats.commentCount}</span>
          </div>
          <div className="stat-item">
            <span>Duration</span>
            <span>{stats.duration}</span>
          </div>
          <div className="stat-item">
            <span>Published</span>
            <span>{new Date(stats.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
