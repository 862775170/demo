package com.example.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.PageUtils;
import com.example.demo.common.Pages;
import com.example.demo.common.Result;
import com.example.demo.entity.Trends;
import com.example.demo.service.TrendsService;

@RestController
@RequestMapping("/trends")
public class TrendsController {
	private TrendsService trendsService;

	@GetMapping
	public Result getTrendsPage(String userId, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Trends> pag = trendsService.getTrendsPage(userId, pageable);
		return Result.ok(pag);
	}
}
