package com.example.demo.message;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
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

	@RabbitListener(queues = "${mq.queue.action}")
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		try {
			DatrixActionMessage datrixMessage = objectMapper.readValue(message.getBody(), DatrixActionMessage.class);
			if (datrixMessage.getAction() == null) {
				log.warn("action is empty msg=>{}", messageRec);
			} else {
				ruleService.matchingRule(datrixMessage.getFileId(), datrixMessage.getUserId());
				channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
			}
		} catch (IOException e) {
			log.error(e.getMessage(), e);
			log.error("ack error {},", message.getMessageProperties().getDeliveryTag(), e);
		}
		// channel.basicNack(message.getMessageProperties().getDeliveryTag(), false,
		// true);

	}
}
