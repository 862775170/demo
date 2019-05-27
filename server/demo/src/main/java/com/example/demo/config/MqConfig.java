package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class MqConfig {

//	@Bean
//	public Queue datrixQueue(MqQueueConfig mqQueueConfig) {
//		return new Queue(mqQueueConfig.getDatrixQueue(), true, false, false);
//	}
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

		public void setQueue(String queue) {
			this.queue = queue;
		}
	}

}
