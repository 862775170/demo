package com.example.demo.common;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class TokenUtils {

	public static Integer getUserId() {
		String userId = getServletRequestAttributes().getRequest().getHeader("Authorization");
		if (userId == null) {
			getServletRequestAttributes().getResponse().setStatus(401);
			throw new RuntimeException("请登录");
		}

		return Integer.parseInt(userId);
	}

	private static ServletRequestAttributes getServletRequestAttributes() {
		return (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
	}
}
