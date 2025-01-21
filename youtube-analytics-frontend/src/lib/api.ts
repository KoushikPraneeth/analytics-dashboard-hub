import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ChannelBasic {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export interface ChannelStatistics {
  id: string;
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  details: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnailUrl: string;
  };
}

export interface VideoStatistics {
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

export interface ChannelVideosResponse {
  videos: VideoStatistics[];
  nextPageToken?: string;
  totalResults: number;
}

export const searchChannels = async (query: string): Promise<ChannelBasic[]> => {
  try {
    const response = await axios.get<{ channels: ChannelBasic[] }>(
      `${API_BASE_URL}/channels/search`,
      { params: { query } }
    );
    return response.data.channels;
  } catch (error) {
    console.error('Error searching channels:', error);
    throw error;
  }
};

export const getChannelStatistics = async (channelId: string): Promise<ChannelStatistics> => {
  try {
    const response = await axios.get<ChannelStatistics>(
      `${API_BASE_URL}/channels/${channelId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching channel statistics:', error);
    throw error;
  }
};

export const getChannelVideos = async (
  channelId: string,
  pageToken?: string
): Promise<ChannelVideosResponse> => {
  try {
    const response = await axios.get<ChannelVideosResponse>(
      `${API_BASE_URL}/channels/${channelId}/videos`,
      { params: { pageToken } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
};

export const getVideoStatistics = async (videoId: string): Promise<VideoStatistics> => {
  try {
    const response = await axios.get<{
      id: string;
      statistics: {
        viewCount: string;
        likeCount: string;
        dislikeCount: string;
        favoriteCount: string;
        commentCount: string;
      };
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: {
          default: {
            url: string;
          };
        };
      };
      duration: string;
    }>(`${API_BASE_URL}/videos/${videoId}`);
    
    const video = response.data;
    
    if (!video || !video.statistics || !video.snippet) {
      throw new Error('Invalid video data structure received from API');
    }

    return {
      id: video.id || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      thumbnailUrl: video.snippet?.thumbnails?.default?.url || '',
      duration: video.duration || ''
    };
  } catch (error) {
    console.error('Error fetching video statistics:', error);
    throw error;
  }
};
