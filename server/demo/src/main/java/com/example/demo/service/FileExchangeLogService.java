package com.example.demo.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.entity.FileExchangeLog;

public interface FileExchangeLogService {
	/**
	 * 获得用户收的文件
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getSendInLog(String userId);

	/**
	 * 获得用户发送出去的文件
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getSendOutLog(String userId);

	List<Map<String, Object>> getFileLog(String sourceUserId, String targetUserId);

	Page<Map<String, Object>> searchFile(FileExchangeLog fileExchangeLog, Date startTime, Date endTime,
			Pageable pageable);

}
