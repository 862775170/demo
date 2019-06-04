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

	/**
	 * 文件发送日志 多条件查询日志
	 * 
	 * @param fileExchangeLog 条件
	 * @param startTime       开始时间
	 * @param endTime         结束时间
	 * @param pageable        分页
	 * @return
	 */
	Page<Map<String, Object>> searchFile(FileExchangeLog fileExchangeLog, Date startTime, Date endTime,
			Pageable pageable);

	/**
	 * 获得用户收发文件个数
	 * 
	 * @param userId
	 * @return
	 */
	Map<String, Object> getFileCount(String userId);

	/**
	 * 获得当天最近100 条记录
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getToDaySendLately100(String userId);

}
