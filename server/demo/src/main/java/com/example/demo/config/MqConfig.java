package com.example.demo.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqConfig {
	@Autowired
	private MqProperties mqQueueConfig;
	@Autowired
	private DatrixMqProperties datrixQueueConfig;

	@Bean
	public Queue fileCopyQueueRetry() {
		Map<String, Object> arguments = new HashMap<String, Object>();
		arguments.put("x-dead-letter-exchange", mqQueueConfig.getExchange());
		arguments.put("x-dead-letter-routing-key", mqQueueConfig.getRoutingKey());
		arguments.put("x-message-ttl", mqQueueConfig.getRetryTime()); // 重试时间设置
		return new Queue(mqQueueConfig.getQueueRetry(), true, false, false, arguments);
	}

	@Bean
	public Queue fileCopyQueueFailed() {
		return new Queue(mqQueueConfig.getQueueFailed(), true, false, false);
	}

	@Bean
	public Exchange fileExchange() {
		return ExchangeBuilder.directExchange(mqQueueConfig.getExchange()).build();
	}

	@Bean
	public Binding bindingFileCopyQueueFailed() {
		return BindingBuilder.bind(fileCopyQueueFailed()).to(fileExchange())
				.with(mqQueueConfig.getQueueFailedRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}

	@Bean
	public Binding bindingFileCopyQueueRetry() {
		return BindingBuilder.bind(fileCopyQueueRetry()).to(fileExchange())
				.with(mqQueueConfig.getQueueRetryRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}

	@Bean
	public Queue datrixQueueFailed() {
		return new Queue(datrixQueueConfig.getQueueFailed(), true, false, false);
	}

	@Bean
	public Queue datrixQueueRetry() {
		Map<String, Object> arguments = new HashMap<String, Object>();
		arguments.put("x-dead-letter-exchange", datrixQueueConfig.getExchange());
		arguments.put("x-dead-letter-routing-key", datrixQueueConfig.getRoutingKey());
		arguments.put("x-message-ttl", datrixQueueConfig.getRetryTime()); // 重试时间设置
		return new Queue(datrixQueueConfig.getQueueRetry(), true, false, false, arguments);
	}

	@Bean
	public Exchange datrixExchange() {
		return ExchangeBuilder.directExchange(datrixQueueConfig.getExchange()).build();
	}

	@Bean
	public Binding bindingDatrixQueueFailed() {
		return BindingBuilder.bind(datrixQueueFailed()).to(datrixExchange())
				.with(datrixQueueConfig.getQueueFailedRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}

	@Bean
	public Binding bindingDatrixQueueRetry() {
		return BindingBuilder.bind(datrixQueueRetry()).to(datrixExchange())
				.with(datrixQueueConfig.getQueueRetryRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}
//
//	@Bean
//	public Queue fileCopyQueue(MqQueueConfig mqQueueConfig) {
//		return new Queue(mqQueueConfig.getFileCopyQueue(), true, false, false);
//	}

}
