package com.example.demo.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.demo.common.HttpClient;
import com.example.demo.common.Result;
import com.example.demo.entity.Rule;
import com.example.demo.message.DatrixActionMessage;
import com.example.demo.service.FileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

@RestController
@RequestMapping("/user")
public class UserController {

	private static final Logger log = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private FileService fileService;

	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private HttpClient httpClient;

	@Autowired
	private RabbitTemplate rabbitTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	@GetMapping("/test")
	public Object test(String uri) throws RestClientException, UnsupportedEncodingException {
		Gson gson = new Gson();

//		String postByJson = fileService.getFileFullPath(uri);

		return null;
	}

	@PostMapping("/send/message")
	public Object sendMessage(@RequestBody() DatrixActionMessage datrixMessage) throws JsonProcessingException {
		String writeValueAsString = objectMapper.writeValueAsString(datrixMessage);
		rabbitTemplate.convertAndSend("datrix-queue", writeValueAsString);
		return Result.ok(datrixMessage);
	}
}
