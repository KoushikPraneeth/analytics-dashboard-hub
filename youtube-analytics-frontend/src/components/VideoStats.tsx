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
    <div className="video-stats">
      <div className="video-thumbnail">
        <img src={stats.thumbnailUrl} alt={stats.title} />
      </div>
      <div className="video-info">
        <h2>{stats.title}</h2>
        <p>{stats.description}</p>
        <div className="stats-grid">
          <div className="stat-item">
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
