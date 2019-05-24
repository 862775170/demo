package com.example.demo.message;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.service.RuleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;

@Component
public class DatrixReceiver {

	private static final Logger log = LoggerFactory.getLogger(DatrixReceiver.class);

	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private RuleService ruleService;

	@RabbitListener(queues = "datrix-queue")
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		try {
			DatrixMessage datrixMessage = objectMapper.readValue(message.getBody(), DatrixMessage.class);
			if (StringUtils.isNotEmpty(datrixMessage.getEventType()) && "add".equals(datrixMessage.getEventType())) {
				ruleService.matchingRule(datrixMessage.getFullPath(), datrixMessage.getUserId());
			}
		} catch (IOException e) {
			log.error(e.getMessage(), e);
			try {
				channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
			} catch (IOException e1) {
				log.error("ack error {},", message.getMessageProperties().getDeliveryTag(), e1);
			}
		}
		System.out.println("接收到的字符串消息是 => " + messageRec);
		// channel.basicNack(message.getMessageProperties().getDeliveryTag(), false,
		// true);

	}
}