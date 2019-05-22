package com.example.demo.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.demo.common.HttpClient;
import com.example.demo.common.Result;
import com.example.demo.dao.UserDao;
import com.example.demo.entity.User;
import com.example.demo.service.FileService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/user")
public class UserController {

	private static final Logger log = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private FileService fileService;

	@PostMapping("/reg")
	public Result reg(User user) {
		User save = userDao.save(user);
		return Result.ok(save);
	}

	@PostMapping("/login")
	public Result login(@RequestBody User user) {
		User info = userDao.findByUsernameAndPassword(user.getUsername(), user.getPassword());
		if (info == null) {
			return Result.err("401", "用户名或者密码错误");
		}
		info.setPassword(null);
		return Result.ok(info);
	}

	@GetMapping
	@ApiOperation("获得用户列表")
	public Result userList() {
		List<User> findAll = userDao.findAll();
		return Result.ok(findAll);
	}

	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private HttpClient httpClient;

	@GetMapping("/test")
	public Object test(String uri) throws RestClientException, UnsupportedEncodingException {
		Gson gson = new Gson();

//		String postByJson = fileService.getFileFullPath(uri);

		return null;
	}

}
