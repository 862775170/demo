package com.example.demo.common;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageUtils {
	public static Pageable build(Integer pageNumber, Integer pageSize, Sort sort) {
		if (pageNumber == null) {
			pageNumber = 1;
		}
		if (pageSize == null) {
			pageSize = 10;
		}
		if (pageNumber < 0) {
			throw new ParamException("400", "Page index must not be less than zero!");
		}

		if (pageSize < 1) {
			throw new ParamException("400", "Page size must not be less than one!");
		}
		return PageRequest.of(pageNumber, pageSize, sort);
	}
}
