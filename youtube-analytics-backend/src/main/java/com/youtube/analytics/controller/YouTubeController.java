package com.youtube.analytics.controller;

import com.youtube.analytics.service.YouTubeService;
import com.google.api.services.youtube.model.*;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class YouTubeController {

    private final YouTubeService youTubeService;

    public YouTubeController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    @GetMapping("/channels/search")
    public Object searchChannels(@RequestParam String query) {
        try {
            SearchListResponse response = youTubeService.searchChannels(query);
            List<Map<String, String>> channels = new ArrayList<>();

            response.getItems().forEach(item -> {
                Map<String, String> channel = new HashMap<>();
                channel.put("id", item.getId().getChannelId());
                channel.put("title", item.getSnippet().getTitle());
                channel.put("description", item.getSnippet().getDescription());
                channel.put("thumbnailUrl", item.getSnippet().getThumbnails().getDefault().getUrl());
                channels.add(channel);
            });

            return Map.of("channels", channels);
        } catch (Exception e) {
            return new ErrorResponse(e.getMessage());
        }
    }

    @GetMapping("/channels/{channelId}")
    public Object getChannelStatistics(@PathVariable String channelId) {
        try {
            Channel channel = youTubeService.getChannelStatistics(channelId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", channel.getId());
            
            // Add channel statistics
            Map<String, String> statistics = new HashMap<>();
            if (channel.getStatistics() != null) {
                statistics.put("subscriberCount", String.valueOf(channel.getStatistics().getSubscriberCount()));
                statistics.put("videoCount", String.valueOf(channel.getStatistics().getVideoCount()));
                statistics.put("viewCount", String.valueOf(channel.getStatistics().getViewCount()));
            } else {
                statistics.put("subscriberCount", "0");
                statistics.put("videoCount", "0");
                statistics.put("viewCount", "0");
            }
            response.put("statistics", statistics);
            
            // Add channel details
            Map<String, Object> details = new HashMap<>();
            if (channel.getSnippet() != null) {
                details.put("title", channel.getSnippet().getTitle());
                details.put("description", channel.getSnippet().getDescription());
                details.put("publishedAt", channel.getSnippet().getPublishedAt().toString());
                details.put("thumbnailUrl", channel.getSnippet().getThumbnails().getDefault().getUrl());
            } else {
                details.put("title", "");
                details.put("description", "");
                details.put("publishedAt", "");
                details.put("thumbnailUrl", "");
            }
            response.put("details", details);
            
            return response;
        } catch (Exception e) {
            return new ErrorResponse(e.getMessage());
        }
    }

    @GetMapping("/channels/{channelId}/videos")
    public Object getChannelVideos(
            @PathVariable String channelId,
            @RequestParam(required = false) String pageToken) {
        try {
            SearchListResponse searchResponse = youTubeService.getChannelVideos(channelId, pageToken);
            List<String> videoIds = searchResponse.getItems().stream()
                .map(item -> item.getId().getVideoId())
                .toList();

            Map<String, Object> response = new HashMap<>();
            
            if (!videoIds.isEmpty()) {
                VideoListResponse videosResponse = youTubeService.getVideosDetails(videoIds);
                List<Video> videos = videosResponse.getItems();
                List<Map<String, Object>> videosList = new ArrayList<>();
                
                for (Video video : videos) {
                    Map<String, Object> videoData = new HashMap<>();
                    videoData.put("id", video.getId());
                    
                    if (video.getSnippet() != null) {
                        videoData.put("title", video.getSnippet().getTitle());
                        videoData.put("description", video.getSnippet().getDescription());
                        videoData.put("publishedAt", video.getSnippet().getPublishedAt().toString());
                        videoData.put("thumbnailUrl", video.getSnippet().getThumbnails().getDefault().getUrl());
                    }
                    
                    if (video.getStatistics() != null) {
                        videoData.put("viewCount", String.valueOf(video.getStatistics().getViewCount()));
                        videoData.put("likeCount", String.valueOf(video.getStatistics().getLikeCount()));
                        videoData.put("commentCount", String.valueOf(video.getStatistics().getCommentCount()));
                    }
                    
                    if (video.getContentDetails() != null) {
                        videoData.put("duration", video.getContentDetails().getDuration());
                    }
                    
                    videosList.add(videoData);
                }
                
                response.put("videos", videosList);
            } else {
                response.put("videos", new ArrayList<>());
            }
            
            response.put("nextPageToken", searchResponse.getNextPageToken());
            response.put("totalResults", searchResponse.getPageInfo().getTotalResults());
            
            return response;
        } catch (Exception e) {
            return new ErrorResponse(e.getMessage());
        }
    }

    @GetMapping("/videos/{videoId}")
    public Object getVideoStatistics(@PathVariable String videoId) {
        try {
            Video video = youTubeService.getVideoStatistics(videoId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", video.getId());
            
            Map<String, String> statistics = new HashMap<>();
            if (video.getStatistics() != null) {
                statistics.put("viewCount", String.valueOf(video.getStatistics().getViewCount()));
                statistics.put("likeCount", String.valueOf(video.getStatistics().getLikeCount()));
                statistics.put("commentCount", String.valueOf(video.getStatistics().getCommentCount()));
            }
            response.put("statistics", statistics);
            
            if (video.getSnippet() != null) {
                response.put("title", video.getSnippet().getTitle());
                response.put("description", video.getSnippet().getDescription());
                response.put("publishedAt", video.getSnippet().getPublishedAt().toString());
                response.put("thumbnailUrl", video.getSnippet().getThumbnails().getDefault().getUrl());
            }
            
            if (video.getContentDetails() != null) {
                response.put("duration", video.getContentDetails().getDuration());
            }
            
            return response;
        } catch (Exception e) {
            return new ErrorResponse(e.getMessage());
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }
}
