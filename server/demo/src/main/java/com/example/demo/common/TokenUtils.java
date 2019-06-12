package com.example.demo.common;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.example.demo.model.UserInfo;
import com.example.demo.service.UserService;

public class TokenUtils {

	public static String getUserId() {

		return null;
	}

	private static UserInfo getUserInfo() {
//		HttpServletRequest request = getServletRequestAttributes().getRequest();
//		String token = getServletRequestAttributes().getRequest().getHeader("Access-Token");
//		if (token == null) {
//			getServletRequestAttributes().getResponse().setStatus(401);
//			throw new RuntimeException("请登录");
//		}
//
//		
////		UserInfo userInfo = bean.getUserInfoByToken(token);
		return null;
	}

	private static ServletRequestAttributes getServletRequestAttributes() {
		return (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
	}
}
