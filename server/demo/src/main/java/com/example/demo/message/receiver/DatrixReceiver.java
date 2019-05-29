package com.example.demo.message.receiver;

import java.io.IOException;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.config.MqConfig.DatrixQueueConfig;
import com.example.demo.message.DatrixActionMessage;
import com.example.demo.service.FileService;
import com.example.demo.service.RuleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;

@Component
public class DatrixReceiver extends BaseReceiver {

	private static final Logger log = LoggerFactory.getLogger(DatrixReceiver.class);
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private RuleService ruleService;
	@Autowired
	private FileService fileService;
	@Autowired
	private DatrixQueueConfig datrixQueueConfig;

	@RabbitListener(bindings = {
			@QueueBinding(exchange = @Exchange(value = "${datrix.mq.exchange}", type = ExchangeTypes.DIRECT), key = "${datrix.mq.routingKey}", value = @Queue(value = "${datrix.mq.queue}")) })
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		byte[] body = message.getBody();
		MessageProperties messageProperties = message.getMessageProperties();
		BasicProperties props = getBasicProperties(messageProperties);
		try {
			DatrixActionMessage datrixMessage = objectMapper.readValue(message.getBody(), DatrixActionMessage.class);
			Date sendTime = datrixMessage.getTime();
			if (datrixMessage.getAction() == null) {
				log.warn("action is empty msg=>{}", messageRec);
				this.basicPublish(channel, datrixQueueConfig.getExchange(),
						datrixQueueConfig.getQueueFailedRoutingKey(), props, body);
			} else {
				ruleService.matchingRule(datrixMessage.getFileId(), datrixMessage.getUserId(), sendTime);
			}
		} catch (IOException e) {
			log.error(e.getMessage() + "{}", messageRec, e);

			if (getRetryCount(props) < datrixQueueConfig.getRetryCount()) {
				this.basicPublish(channel, datrixQueueConfig.getExchange(), datrixQueueConfig.getQueueRetryRoutingKey(),
						props, body);
			} else {
				this.basicPublish(channel, datrixQueueConfig.getExchange(),
						datrixQueueConfig.getQueueFailedRoutingKey(), props, body);
			}
		}
		ack(message, channel);
	}
}
