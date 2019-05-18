package com.example.demo.service;

import java.util.List;
import java.util.Map;

import springfox.documentation.spring.web.json.Json;

public interface UserService {
	Map<String, String> getUserNames(List<String> userIds);
	
}
