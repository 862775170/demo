package com.example.demo.common;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.demo.config.HttpConfig;
import com.google.gson.JsonObject;

@Component
public class HttpClient {

	private static final Logger log = LoggerFactory.getLogger(HttpClient.class);

	@Autowired
	private HttpConfig config;
	@Autowired
	private RestTemplate restTemplate;

	public <T> ResponseEntity<T> postByFormData(String url, Map<String, Object> formData, Class<T> t) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.MULTIPART_FORM_DATA);
		MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
		formData.forEach((k, v) -> {
			multiValueMap.add(k, v);
		});

		HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<MultiValueMap<String, Object>>(multiValueMap,
				headers);
		String requestUrl = config.getHost() + config.getPrefix() + url;
		log.debug("request url =>{},reqeust headers => {},request body => {},request => {}", requestUrl, headers,
				formData, request);
		return restTemplate.postForEntity(requestUrl, request, t);

	}

	public <T> ResponseEntity<T> postByJson(String url, Object body, Class<T> t) {
		String requestUrl = config.getHost() + config.getPrefix() + url;
		log.debug("request url => {},reqeust body => {}", url, body);
		ResponseEntity<T> postForEntity = restTemplate.postForEntity(requestUrl, body, t);
		log.debug("request url => {},responese body => {}", url, postForEntity.getBody());
		return postForEntity;

	}
}
