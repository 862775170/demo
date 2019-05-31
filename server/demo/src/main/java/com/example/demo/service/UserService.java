package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.model.UserInfo;

public interface UserService {
	/**
	 * 获得用户Map
	 * 
	 * @param userIds
	 * @return
	 */
	Map<String, String> getUserNames(List<String> userIds);

	/**
	 * 获得用户详情
	 * 
	 * @param userId
	 * @return
	 */
	UserInfo getUserInfo(String userId);

}
