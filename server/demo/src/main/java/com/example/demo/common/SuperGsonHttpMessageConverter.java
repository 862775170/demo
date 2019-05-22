package com.example.demo.common;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.converter.json.GsonHttpMessageConverter;

public class SuperGsonHttpMessageConverter extends GsonHttpMessageConverter {

	public SuperGsonHttpMessageConverter() {
		super();
		List<MediaType> mediaTypes = new ArrayList<>();
		mediaTypes.add(MediaType.TEXT_PLAIN);
		mediaTypes.add(MediaType.TEXT_HTML); // 加入text/html类型的支持
		mediaTypes.add(MediaType.APPLICATION_JSON);
		mediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
		setSupportedMediaTypes(mediaTypes);// tag6

	}
}
