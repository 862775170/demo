package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "system")
@Configuration
public class SystemProperties {
	/**
	 * 交换目录所属userId
	 */
	private String userId;

	/**
	 * 交换目录文件夹Id
	 */
	private String exchangeFileId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getExchangeFileId() {
		return exchangeFileId;
	}

	public void setExchangeFileId(String exchangeFileId) {
		this.exchangeFileId = exchangeFileId;
	}
}
