package com.example.demo.common;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.demo.model.UserInfo;
import com.example.demo.service.UserService;

public class TokenUtils {

	private static final String secret = "scasdasdccvwq";

	private static final String issuer = "fileX";

	public static String getUserId() {
		return getUserInfo().getUserId();
	}

	public static UserInfo getUserInfo() {
		String token = getServletRequestAttributes().getRequest().getHeader(HttpClient.AUTH_TOKEN);
		if (token == null) {
			getServletRequestAttributes().getResponse().setStatus(401);
			throw new RuntimeException("请登录");
		}
		UserService bean = SpringUtils.getBean(UserService.class);
		UserInfo userinfo = bean.getUserInfoByToken(token);
		return userinfo;
	}

	private static ServletRequestAttributes getServletRequestAttributes() {
		return (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
	}

	private static String createToken(UserInfo userInfo, String accessToken) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.create().withIssuer(issuer).sign(algorithm);
		} catch (JWTCreationException exception) {
			throw new RuntimeException(exception);
		}
	}

	private static void verifyToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			JWTVerifier verifier = JWT.require(algorithm).withIssuer(issuer).build(); // Reusable verifier instance
			DecodedJWT jwt = verifier.verify(token);
		} catch (JWTVerificationException exception) {
			throw new RuntimeException("请重新登录");
		}
	}
}
