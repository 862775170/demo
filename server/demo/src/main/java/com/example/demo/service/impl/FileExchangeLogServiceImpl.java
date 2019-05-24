package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.entity.FileExchangeLog;
import com.example.demo.service.FileExchangeLogService;
import com.example.demo.service.RuleService;
import com.example.demo.service.UserService;

@Service
public class FileExchangeLogServiceImpl implements FileExchangeLogService {
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;
	@Autowired
	private UserService userService;
	@Autowired
	private RuleService ruleService;

	@Override
	public List<Map<String, Object>> getSendInLog(String userId) {
		List<FileExchangeLog> exchangeLogs = fileExchangeLogDao.findByTargetUserId(userId);
		Set<String> userIds = new HashSet<>();
		userIds.add(userId);
		Set<Integer> ruleIds = new HashSet<>();
		final Map<Integer, String> ruleMap = new HashMap<>();
		final Map<String, String> userNames = new HashMap<>();
		exchangeLogs.stream().forEach(a -> {
			if (a.getRuleId() != null) {
				ruleIds.add(a.getRuleId());
			}
			if (a.getTargetUserId() != null) {
				userIds.add(a.getTargetUserId());
			}
		});

		if (!ruleIds.isEmpty()) {
			ruleMap.putAll(ruleService.getRuleMap(new ArrayList<>(ruleIds)));
		}
		if (!userIds.isEmpty()) {
			userNames.putAll(userService.getUserNames(new ArrayList<String>(userIds)));
		}

		List<Map<String, Object>> collect = exchangeLogs.stream().map(m -> {
			Map<String, Object> map = new HashMap<>();
			map.put("time", m.getCreateTime());
			map.put("ruleName", ruleMap.get(m.getRuleId()));
			map.put("sourceFileName", m.getSourceFileName());
			map.put("sourceUserName", userNames.get(m.getSourceUserId()));
			map.put("targetUserName", userNames.get(m.getTargetUserId()));
			map.put("targetFileName", m.getTargerFileName());
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public List<Map<String, Object>> getSendOutLog(String userId) {
		List<FileExchangeLog> exchangeLogs = fileExchangeLogDao.findBySourceUserId(userId);
		Set<String> userIds = new HashSet<>();
		userIds.add(userId);
		Set<Integer> ruleIds = new HashSet<>();
		final Map<Integer, String> ruleMap = new HashMap<>();
		final Map<String, String> userNames = new HashMap<>();
		exchangeLogs.stream().forEach(a -> {
			if (a.getRuleId() != null) {
				ruleIds.add(a.getRuleId());
			}
			if (a.getTargetUserId() != null) {
				userIds.add(a.getTargetUserId());
			}

		});

		if (!ruleIds.isEmpty()) {
			ruleMap.putAll(ruleService.getRuleMap(new ArrayList<>(ruleIds)));
		}
		if (!userIds.isEmpty()) {
			userNames.putAll(userService.getUserNames(new ArrayList<String>(userIds)));
		}

		List<Map<String, Object>> collect = exchangeLogs.stream().map(m -> {
			Map<String, Object> map = new HashMap<>();
			map.put("time", m.getCreateTime());
			map.put("ruleName", ruleMap.get(m.getRuleId()));
			map.put("sourceFileName", m.getSourceFileName());
			map.put("sourceUserName", userNames.get(m.getSourceUserId()));
			map.put("targetUserName", userNames.get(m.getTargetUserId()));
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public List<Map<String, Object>> getFileLog(String sourceUserId, String targetUserId) {
		List<FileExchangeLog> exchangeLogs = fileExchangeLogDao.findBySourceUserIdAndTargetUserId(sourceUserId,
				targetUserId);
		Set<String> userIds = new HashSet<>();
		userIds.add(sourceUserId);
		userIds.add(targetUserId);
		Set<Integer> ruleIds = new HashSet<>();
		final Map<Integer, String> ruleMap = new HashMap<>();
		final Map<String, String> userNames = new HashMap<>();
		exchangeLogs.stream().forEach(a -> {
			if (a.getRuleId() != null) {
				ruleIds.add(a.getRuleId());
			}
			if (a.getTargetUserId() != null) {
				userIds.add(a.getTargetUserId());
			}

		});

		if (!ruleIds.isEmpty()) {
			ruleMap.putAll(ruleService.getRuleMap(new ArrayList<>(ruleIds)));
		}
		if (!userIds.isEmpty()) {
			userNames.putAll(userService.getUserNames(new ArrayList<String>(userIds)));
		}
		List<Map<String, Object>> collect = exchangeLogs.stream().map(m -> {
			Map<String, Object> map = new HashMap<>();
			map.put("time", m.getCreateTime());
			map.put("ruleName", ruleMap.get(m.getRuleId()));
			map.put("sourceFileName", m.getSourceFileName());
			map.put("sourceUserName", userNames.get(m.getSourceUserId()));
			map.put("targetUserName", userNames.get(m.getTargetUserId()));
			map.put("targerFileName", m.getTargerFileName());
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

}
