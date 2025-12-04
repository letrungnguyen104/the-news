import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const NotificationPopup = () => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost/ws');
    const client = Stomp.over(socket);
    client.debug = null;
    stompClientRef.current = client;
    const onConnect = () => {
      console.log('Connected to WebSocket');
      client.subscribe('/topic/news', (msg) => {
        if (msg.body) {
          try {
            const article = JSON.parse(msg.body);
            notification.info({
              message: 'TIN NÓNG VỪA XUẤT BẢN',
              description: article.title,
              placement: 'topRight',
              duration: 5,
              onClick: () => {
                window.location.href = `/article/${article.slug}`;
              },
              style: { cursor: 'pointer', borderLeft: '5px solid red' }
            });
          } catch (e) {
            console.error("Lỗi parse tin nhắn socket", e);
          }
        }
      });
    };
    const onError = (err) => {
      console.error('WebSocket error:', err);
    };
    client.connect({}, onConnect, onError);

    return () => {
      if (client && client.connected) {
        try {
          client.disconnect(() => {
            console.log('❌ Disconnected from WebSocket');
          });
        } catch (e) {
        }
      }
    };
  }, []);

  return null;
};

export default NotificationPopup;