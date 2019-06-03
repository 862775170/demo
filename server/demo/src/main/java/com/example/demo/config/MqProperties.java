package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "mq")
@Configuration
public class MqProperties {
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
