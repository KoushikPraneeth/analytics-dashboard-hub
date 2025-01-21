import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Users, Eye, Video, Clock } from 'lucide-react';
import { ChannelStatistics, VideoStatistics, getChannelStatistics, getChannelVideos } from '../lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface ChannelDashboardProps {
  channelId: string;
}

export const ChannelDashboard = ({ channelId }: ChannelDashboardProps) => {
  const [channelStats, setChannelStats] = useState<ChannelStatistics | null>(null);
  const [videos, setVideos] = useState<VideoStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, videosData] = await Promise.all([
          getChannelStatistics(channelId),
          getChannelVideos(channelId)
        ]);
        setChannelStats(statsData);
        setVideos(videosData.videos);
      } catch (err) {
        setError('Failed to fetch channel data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!channelStats) return <div className="p-8 text-center">No data available</div>;

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toString();
  };

  // Prepare chart data from recent videos
  const chartData = videos.slice(0, 10).map(video => ({
    name: video.title.substring(0, 20) + '...',
    views: parseInt(video.viewCount),
    likes: parseInt(video.likeCount),
    comments: parseInt(video.commentCount)
  })).reverse();

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Channel Overview */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={channelStats.details.thumbnailUrl}
          alt={channelStats.details.title}
          className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div>
          <h1 className="text-2xl font-bold">{channelStats.details.title}</h1>
          <p className="text-muted-foreground">
            Joined {new Date(channelStats.details.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(channelStats.statistics.subscriberCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(channelStats.statistics.viewCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(channelStats.statistics.videoCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Views</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                Math.round(
                  parseInt(channelStats.statistics.viewCount) /
                  parseInt(channelStats.statistics.videoCount)
                ).toString()
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Video Performance</CardTitle>
          <CardDescription>
            Views, likes, and comments for recent videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="views"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="comments"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Videos Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Videos</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.viewCount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👍</span>
                    {formatNumber(video.likeCount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    {formatNumber(video.commentCount)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};