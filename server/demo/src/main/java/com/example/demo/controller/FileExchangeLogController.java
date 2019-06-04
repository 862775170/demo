package com.example.demo.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.PageUtils;
import com.example.demo.common.Pages;
import com.example.demo.common.Result;
import com.example.demo.entity.FileExchangeLog;
import com.example.demo.service.FileExchangeLogService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/file/exchage")
public class FileExchangeLogController {
	@Autowired
	private FileExchangeLogService fileExchangeLogService;

//	@GetMapping("/send/in")
//	@ApiOperation("接收文件记录")
//	public Result getSendInLog(String userId) {
//		List<Map<String, Object>> result = fileExchangeLogService.getSendInLog(userId);
//		return Result.ok(result);
//	}

	@GetMapping("/getFileCount")
	@ApiOperation("获得文件收发数")
	public Result getFileCount(String userId) {
		Map<String, Object> result = fileExchangeLogService.getFileCount(userId);
		return Result.ok(result);
	}

//	@GetMapping("/send/out")
//	@ApiOperation("发出文件记录")
//	public Result getSendOutLog(String userId) {
//		List<Map<String, Object>> result = fileExchangeLogService.getSendOutLog(userId);
//		return Result.ok(result);
//	}

	@GetMapping()
	@ApiOperation("条件查询文件发送记录")
	public Result getFileLog(String sourceUserId, String targetUserId) {
		List<Map<String, Object>> result = fileExchangeLogService.getFileLog(sourceUserId, targetUserId);
		return Result.ok(result);
	}

	@GetMapping("/search")
	@ApiOperation("多条件查询文件发送记录")
	public Result searchFile(FileExchangeLog fileExchangeLog, Date startTime, Date endTime, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Map<String, Object>> result = fileExchangeLogService.searchFile(fileExchangeLog, startTime, endTime,
				pageable);
		return Result.ok(result);
	}

	@GetMapping("/toDay/send/lately/100")
	@ApiOperation("获得最近发送的100条记录")
	public Result getToDaySendLately100(String userId) {
		List<Map<String, Object>> list = fileExchangeLogService.getToDaySendLately100(userId);
		return Result.ok(list);
	}
}
