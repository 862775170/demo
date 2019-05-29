package com.example.demo.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class MqConfig {
	@Autowired
	private MqQueueConfig mqQueueConfig;
	@Autowired
	private DatrixQueueConfig datrixQueueConfig;

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
		return BindingBuilder.bind(datrixQueueRetry()).to(datrixExchange())
				.with(datrixQueueConfig.getQueueFailedRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}

	@Bean
	public Binding bindingDatrixQueueRetry() {
		return BindingBuilder.bind(fileCopyQueueRetry()).to(fileExchange())
				.with(datrixQueueConfig.getQueueRetryRoutingKey()).noargs();// *表示一个词,#表示零个或多个词
	}
//
//	@Bean
//	public Queue fileCopyQueue(MqQueueConfig mqQueueConfig) {
//		return new Queue(mqQueueConfig.getFileCopyQueue(), true, false, false);
//	}

	@ConfigurationProperties(prefix = "mq")
	@Component
	public class MqQueueConfig {
		private String routingKey;

		private String exchange;

		private String queue;

		private Integer retryTime = 30000;

		private Integer retryCount = 3;

		public String getRoutingKey() {
			return routingKey;
		}

		public void setRoutingKey(String routingKey) {
			this.routingKey = routingKey;
		}

		public String getExchange() {
			return exchange;
		}

		public void setExchange(String exchange) {
			this.exchange = exchange;
		}

		public String getQueue() {
			return queue;
		}

		public String getQueueRetry() {
			return queue + ".retry";
		}

		public String getQueueRetryRoutingKey() {
			return queue + ".retry.key";
		}

		public String getQueueFailed() {
			return queue + ".failed";
		}

		public String getQueueFailedRoutingKey() {
			return queue + ".failed.key";
		}

		public void setQueue(String queue) {
			this.queue = queue;
		}

		public Integer getRetryTime() {
			return retryTime;
		}

		public void setRetryTime(Integer retryTime) {
			this.retryTime = retryTime;
		}

		public Integer getRetryCount() {
			return retryCount;
		}

		public void setRetryCount(Integer retryCount) {
			this.retryCount = retryCount;
		}
	}

	@ConfigurationProperties(prefix = "datrix.mq")
	@Component
	public class DatrixQueueConfig {
		private String routingKey;

		private String exchange;

		private String queue;

		private Integer retryTime = 30000;

		private Integer retryCount = 3;

		public String getRoutingKey() {
			return routingKey;
		}

		public void setRoutingKey(String routingKey) {
			this.routingKey = routingKey;
		}

		public String getExchange() {
			return exchange;
		}

		public void setExchange(String exchange) {
			this.exchange = exchange;
		}

		public String getQueue() {
			return queue;
		}

		public String getQueueRetry() {
			return queue + ".retry";
		}

		public String getQueueRetryRoutingKey() {
			return queue + ".retry.key";
		}

		public String getQueueFailed() {
			return queue + ".failed";
		}

		public String getQueueFailedRoutingKey() {
			return queue + ".failed.key";
		}

		public void setQueue(String queue) {
			this.queue = queue;
		}

		public Integer getRetryTime() {
			return retryTime;
		}

		public void setRetryTime(Integer retryTime) {
			this.retryTime = retryTime;
		}

		public Integer getRetryCount() {
			return retryCount;
		}

		public void setRetryCount(Integer retryCount) {
			this.retryCount = retryCount;
		}
	}
}
