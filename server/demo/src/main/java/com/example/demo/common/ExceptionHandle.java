package com.example.demo.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandle {

	private static final Logger log = LoggerFactory.getLogger(ExceptionHandle.class);

	@ExceptionHandler(ParamException.class)
	public Result handler(ParamException e) {
		log.info("{}", e.getMsg(), e);
		return Result.err(e.getCode(), e.getMsg());
	}
}
