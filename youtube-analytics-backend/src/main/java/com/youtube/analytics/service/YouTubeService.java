package com.youtube.analytics.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.*;
import com.youtube.analytics.config.YouTubeConfig;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
public class YouTubeService {

    private final YouTube youTube;
    private final String apiKey;

    public YouTubeService(YouTubeConfig config) throws GeneralSecurityException, IOException {
        this.apiKey = config.getApiKey();
        this.youTube = new YouTube.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            JacksonFactory.getDefaultInstance(),
            null)
            .setApplicationName("youtube-analytics")
            .build();
    }

    public SearchListResponse searchChannels(String query) throws IOException {
        YouTube.Search.List request = youTube.search()
            .list("snippet")
            .setQ(query)
            .setType("channel")
            .setMaxResults(5L)
            .setKey(apiKey);

        return request.execute();
    }

    public Channel getChannelStatistics(String channelId) throws IOException {
        YouTube.Channels.List request = youTube.channels()
            .list("snippet,statistics,brandingSettings")
            .setId(channelId)
            .setKey(apiKey);

        ChannelListResponse response = request.execute();
        if (response.getItems().isEmpty()) {
            throw new IOException("Channel not found");
        }

        return response.getItems().get(0);
    }

    public SearchListResponse getChannelVideos(String channelId, String pageToken) throws IOException {
        YouTube.Search.List request = youTube.search()
            .list("snippet")
            .setChannelId(channelId)
            .setOrder("date")
            .setType("video")
            .setMaxResults(50L)
            .setKey(apiKey);

        if (pageToken != null && !pageToken.isEmpty()) {
            request.setPageToken(pageToken);
        }

        return request.execute();
    }

    public VideoListResponse getVideosDetails(List<String> videoIds) throws IOException {
        if (videoIds.isEmpty()) {
            return new VideoListResponse();
        }

        YouTube.Videos.List request = youTube.videos()
            .list("statistics,snippet,contentDetails")
            .setId(String.join(",", videoIds))
            .setKey(apiKey);

        return request.execute();
    }

    public Video getVideoStatistics(String videoId) throws IOException {
        YouTube.Videos.List request = youTube.videos()
            .list("statistics,snippet,contentDetails")
            .setFields("items(id,snippet(title,description,publishedAt,thumbnails(maxres,high)),statistics(viewCount,likeCount,commentCount),contentDetails(duration))")
            .setId(videoId)
            .setKey(apiKey);

        VideoListResponse response = request.execute();
        if (response.getItems().isEmpty()) {
            throw new IOException("Video not found");
        }
        
        return response.getItems().get(0);
    }
}
