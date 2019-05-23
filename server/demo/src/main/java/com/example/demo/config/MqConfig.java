package com.example.demo.config;

import org.springframework.amqp.core.Queue;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class MqConfig {

	@Bean
	public Queue datrixQueue(MqQueueConfig mqQueueConfig) {
		return new Queue(mqQueueConfig.getDatrixQueue(), true, false, false);
	}

	@Bean
	public Queue fileCopyQueue(MqQueueConfig mqQueueConfig) {
		return new Queue(mqQueueConfig.getFileCopyQueue(), true, false, false);
	}

	@ConfigurationProperties(prefix = "mq")
	@Component
	class MqQueueConfig {
		private String datrixQueue;

		private String fileCopyQueue;

		public String getDatrixQueue() {
			return datrixQueue;
		}

		public void setDatrixQueue(String datrixQueue) {
			this.datrixQueue = datrixQueue;
		}

		public String getFileCopyQueue() {
			return fileCopyQueue;
		}

		public void setFileCopyQueue(String fileCopyQueue) {
			this.fileCopyQueue = fileCopyQueue;
		}
	}

}
