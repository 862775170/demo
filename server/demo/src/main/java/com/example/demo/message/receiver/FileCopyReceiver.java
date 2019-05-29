package com.example.demo.message.receiver;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.example.demo.config.MqConfig.MqQueueConfig;
import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.entity.FileExchangeLog;
import com.example.demo.message.FileCopyMessage;
import com.example.demo.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.AMQP.BasicProperties;
import com.rabbitmq.client.Channel;

@Component
public class FileCopyReceiver extends BaseReceiver {

	private static final Logger log = LoggerFactory.getLogger(FileCopyReceiver.class);
	@Autowired
	private Environment env;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;
	@Autowired
	private FileService fileService;
	@Autowired
	private MqQueueConfig mqQueueConfig;

	@RabbitListener(bindings = {
			@QueueBinding(value = @Queue(value = "${mq.queue}"), exchange = @Exchange(value = "${mq.exchange}", type = ExchangeTypes.DIRECT), key = "${mq.routingKey}") })
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		log.info("messageRec => {}", messageRec);
		try {
			message.getMessageProperties().getHeaders();
			FileCopyMessage fileCopyMessage = objectMapper.readValue(message.getBody(), FileCopyMessage.class);
			FileExchangeLog entity = new FileExchangeLog();
			entity.setCreateTime(new Date());
			BeanUtils.copyProperties(fileCopyMessage, entity);
			// 源文件Id,目标文件名,目标目录
			String sourceFileId = fileCopyMessage.getSourceFileId();
			String displayName = fileCopyMessage.getTargetFileName();
			String parentId = fileCopyMessage.getTargerParentId();
			String targetUserId = fileCopyMessage.getTargetUserId();
			fileService.copyObject(sourceFileId, parentId, displayName, targetUserId);
			fileExchangeLogDao.save(entity);
		} catch (IOException e) {
			log.error(e.getMessage(), e);
			MessageProperties messageProperties = message.getMessageProperties();
			BasicProperties props = getBasicProperties(messageProperties);
			byte[] body = message.getBody();
			if (getRetryCount(props) < mqQueueConfig.getRetryCount()) {
				this.basicPublish(channel, mqQueueConfig.getExchange(), mqQueueConfig.getQueueRetryRoutingKey(), props,
						body);
			} else {
				this.basicPublish(channel, mqQueueConfig.getExchange(), mqQueueConfig.getQueueFailedRoutingKey(), props,
						body);
			}
		}
		ack(message, channel);

	}
}
