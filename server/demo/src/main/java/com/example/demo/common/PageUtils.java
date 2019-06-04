package com.example.demo.common;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

public class PageUtils {
//	public static Pageable build(Integer pageNumber, Integer pageSize, Sort sort) {
//		if (pageNumber == null) {
//			pageNumber = 1;
//		}
//		if (pageSize == null) {
//			pageSize = 10;
//		}
//		if (pageNumber < 0) {
//			throw new ParamException("400", "Page index must not be less than zero!");
//		}
//
//		if (pageSize < 1) {
//			throw new ParamException("400", "Page size must not be less than one!");
//		}
//		return PageRequest.of(pageNumber, pageSize, sort);
//	}

	// 分页大小
	private final static Integer SIZE = 5;
	// 默认页数 0开头
	private final static Integer PAGE = 0;
	// 默认排序字段
	private final static String ID = "id";

	@SuppressWarnings("deprecation")
	public static Pageable createPageRequest(Pages pages) {
		if (StringUtils.isEmpty(pages.getSortColumn())) {
			return new PageRequest(pages.getPage() <= 0 ? PAGE : pages.getPage(),
					pages.getSize() <= 0 ? SIZE : pages.getSize());
		} else {
			return new PageRequest(pages.getPage() <= 0 ? PAGE : pages.getPage(),
					pages.getSize() <= 0 ? SIZE : pages.getSize(),
					new Sort(
							null != pages.getDirection() && !"".equals(pages.getDirection())
									&& pages.getDirection().equals("desc") ? Direction.DESC : Direction.ASC,
							StringUtils.isEmpty(pages.getSortColumn()) ? ID : pages.getSortColumn()));
		}

	}

}
