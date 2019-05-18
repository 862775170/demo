package com.example.demo.config;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.digest.HmacUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
@ConfigurationProperties(prefix = "http")
public class HttpConfig {

	final static String base = " DATATOM";
	private String accessKey;
	private String secretKey;
	private String host;
	private String prefix;
	private String proxyHost;

	private static final Logger log = LoggerFactory.getLogger(HttpConfig.class);

	private String buildSignKey(String baseUri) {
		String uri = baseUri.replace(prefix, "");
		StringBuffer buffer = new StringBuffer(base);
		buffer.append(" ").append(accessKey);
		log.info("uri=>{},secretKey=>{}", uri, secretKey);
		@SuppressWarnings("deprecation")
		String hmacSha1Hex = HmacUtils.hmacSha1Hex(secretKey, uri);
		System.out.println(hmacSha1Hex);
		String sing = Base64.encodeBase64String(hmacSha1Hex.getBytes());
		buffer.append(":").append(sing);

		return buffer.toString();
	}

	@Bean
	public RestTemplate restTemplate() {
		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
		HttpClient httpClient = httpClientBuilder.build();
		ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);

		RestTemplate restTemplate = new RestTemplate(requestFactory);
		// 解决中文乱码ss
//		restTemplate.getMessageConverters().set(1, new StringHttpMessageConverter(Charsets.UTF_8));
		List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
		interceptors.add((HttpRequest request, byte[] body, ClientHttpRequestExecution execution) -> {
			String path = request.getURI().getPath();
			String buildSignKey = buildSignKey(path);
			request.getHeaders().add("authorization", buildSignKey);
			log.info("request uri =>{} authorization => {}", path, buildSignKey);
			return execution.execute(request, body);
		});
		restTemplate.setInterceptors(interceptors);
		return restTemplate;
	}

	public String getAccessKey() {
		return accessKey;
	}

	public void setAccessKey(String accessKey) {
		this.accessKey = accessKey;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getProxyHost() {
		return proxyHost;
	}

	public void setProxyHost(String proxyHost) {
		this.proxyHost = proxyHost;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}
}
