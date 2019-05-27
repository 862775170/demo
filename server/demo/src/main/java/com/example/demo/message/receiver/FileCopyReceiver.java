package com.example.demo.message.receiver;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.entity.FileExchangeLog;
import com.example.demo.message.FileCopyMessage;
import com.example.demo.model.FileInfo;
import com.example.demo.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;

@Component
public class FileCopyReceiver {

	private static final Logger log = LoggerFactory.getLogger(FileCopyReceiver.class);
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;
	@Autowired
	private FileService fileService;

	@RabbitListener(bindings = {
			@QueueBinding(value = @Queue(value = "${mq.queue}"), exchange = @Exchange(value = "${mq.exchange}", type = ExchangeTypes.DIRECT), key = "${mq.routingKey}") })
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		try {
			FileCopyMessage fileCopyMessage = objectMapper.readValue(message.getBody(), FileCopyMessage.class);
			FileExchangeLog entity = new FileExchangeLog();
			BeanUtils.copyProperties(fileCopyMessage, entity);
			// 源文件Id,目标文件名,目标目录
			Map<String, Object> meta = new HashMap<String, Object>();

			String sourceFileId = fileCopyMessage.getSourceFileId();
			String displayName = fileCopyMessage.getTargetFileName();
			String targetFileId = fileCopyMessage.getTargerFileId();
			meta.put("parent_id", fileCopyMessage.getTargerParentId());
			meta.put("fullpath", fileCopyMessage.getTargetFullPath());
			fileService.copyObject(sourceFileId, targetFileId, displayName, meta);
			fileExchangeLogDao.save(entity);
			try {
				channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
			} catch (IOException e1) {
				log.error("ack error {},", message.getMessageProperties().getDeliveryTag(), e1);
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
