import { Channel } from '../lib/api';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={channel.thumbnailUrl} 
          alt={channel.title}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold">{channel.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">{channel.description}</p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Subscribers</p>
          <p className="text-lg font-semibold">
            {channel.subscribers.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Views</p>
          <p className="text-lg font-semibold">
            {channel.views.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Videos</p>
          <p className="text-lg font-semibold">
            {channel.videos.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
