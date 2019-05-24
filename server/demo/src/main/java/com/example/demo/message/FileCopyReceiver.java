package com.example.demo.message;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.entity.FileExchangeLog;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;

@Component
public class FileCopyReceiver {

	private static final Logger log = LoggerFactory.getLogger(FileCopyReceiver.class);
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;

	@RabbitListener(queues = "file-copy-queue")
	public void receiveMessage(Message message, Channel channel) {
		String messageRec = new String(message.getBody());
		try {
			FileCopyMessage fileCopyMessage = objectMapper.readValue(message.getBody(), FileCopyMessage.class);
			FileExchangeLog entity = new FileExchangeLog();
			BeanUtils.copyProperties(fileCopyMessage, entity);
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
