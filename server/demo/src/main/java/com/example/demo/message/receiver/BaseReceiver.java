package com.example.demo.message.receiver;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.AMQP.BasicProperties;

public class BaseReceiver {

	private static final Logger log = LoggerFactory.getLogger(BaseReceiver.class);

	protected Long getRetryCount(AMQP.BasicProperties properties) {
		Long retryCount = 0L;
		try {
			Map<String, Object> headers = properties.getHeaders();
			if (headers != null) {
				if (headers.containsKey("x-death")) {
					List<Map<String, Object>> deaths = (List<Map<String, Object>>) headers.get("x-death");
					if (deaths.size() > 0) {
						Map<String, Object> death = deaths.get(0);
						retryCount = (Long) death.get("count");
					}
				}
			}
		} catch (Exception e) {
		}

		return retryCount;
	}

	protected void basicPublish(Channel channel, String exchange, String routingKey, BasicProperties props,
			byte[] body) {
		try {
			channel.basicPublish(exchange, routingKey, props, body);
		} catch (IOException e1) {
			log.error(e1.getMessage(), e1);
		}
	}

	protected void ack(Message message, Channel channel) {
		try {
			channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
		} catch (IOException e1) {
			log.error("ack error {},", message.getMessageProperties().getDeliveryTag(), e1);
		}
	}

	protected BasicProperties getBasicProperties(MessageProperties messageProperties) {
		BasicProperties props = new BasicProperties.Builder().headers(messageProperties.getHeaders()).build();
		return props;
	}
}
