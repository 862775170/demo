package com.example.demo.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.common.HttpClient;
import com.example.demo.service.UserService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Service
public class UserServiceImpl implements UserService {

	private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private HttpClient httpClient;

	@Override
	public Map<String, String> getUserNames(List<String> userIds) {
		Map<String, String> result = new HashMap<>();
		if (userIds.isEmpty()) {
			return result;
		} else {
			Map<String, Object> body = new HashMap<>();
			body.put("userIds", userIds);
			ResponseEntity<JsonObject> json = httpClient.postByJson("/user/multiGetUserInfo", body, JsonObject.class);
			log.debug("http: /user/multiGetUserInfo result => {}", json);
			if (json.getBody().has("result")) {
				json.getBody().get("result").getAsJsonArray().forEach(el -> {
					if (!el.isJsonNull()) {
						JsonObject elobj = el.getAsJsonObject();
						result.put(elobj.get("id").getAsString(), elobj.get("nick_name").getAsString());
					}
				});
			}
			return result;
		}
	}

}
