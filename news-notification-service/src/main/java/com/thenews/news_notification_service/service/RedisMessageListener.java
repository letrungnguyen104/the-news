package com.thenews.news_notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisMessageListener implements MessageListener {

  private final SimpMessagingTemplate messagingTemplate;

  @Override
  public void onMessage(Message message, byte[] pattern) {
    try {
      String msgBody = new String(message.getBody());
      log.info("Nhận được sự kiện từ Redis: {}", msgBody);

      // Giả sử message body chính là nội dung thông báo (hoặc JSON)
      // Bắn tin này xuống tất cả client đang subcribe "/topic/news"
      messagingTemplate.convertAndSend("/topic/news", msgBody);

    } catch (Exception e) {
      log.error("Lỗi xử lý tin nhắn Redis", e);
    }
  }
}