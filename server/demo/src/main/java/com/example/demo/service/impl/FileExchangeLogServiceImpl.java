package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.ExampleMatcher.GenericPropertyMatcher;
import org.springframework.data.domain.ExampleMatcher.GenericPropertyMatchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
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
			if (a.getSourceUserId() != null) {
				userIds.add(a.getSourceUserId());
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
			map.put("targetFileName", m.getTargetFileName());
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
			if (a.getSourceUserId() != null) {
				userIds.add(a.getSourceUserId());
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
			map.put("targerFileName", m.getTargetFileName());
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public Page<Map<String, Object>> searchFile(FileExchangeLog fileExchangeLog, Date startTime, Date endTime,
			Pageable pageable) {
		Specification<FileExchangeLog> specification = new Specification<FileExchangeLog>() {

			/**
			 * 
			 */
			private static final long serialVersionUID = 5072176818979955794L;

			@Override
			public Predicate toPredicate(Root<FileExchangeLog> root, CriteriaQuery<?> query,
					CriteriaBuilder criteriaBuilder) {
				List<Predicate> predicates = new ArrayList<>();
				if (fileExchangeLog.getRuleId() != null) {
					predicates.add(
							criteriaBuilder.equal(root.get("ruleId").as(Integer.class), fileExchangeLog.getRuleId()));
				}
				if (StringUtils.isNotEmpty(fileExchangeLog.getTargetFileName())) {
					predicates.add(criteriaBuilder.like(root.get("targetFileName").as(String.class),
							"%" + fileExchangeLog.getTargetFileName() + "%"));
				}
				if (StringUtils.isNotEmpty(fileExchangeLog.getSourceFileName())) {
					predicates.add(criteriaBuilder.like(root.get("sourceFileName").as(String.class),
							"%" + fileExchangeLog.getSourceFileName() + "%"));
				}
				if (StringUtils.isNotEmpty(fileExchangeLog.getTargetUserId())) {
					predicates.add(criteriaBuilder.equal(root.get("targetUserId").as(String.class),
							fileExchangeLog.getTargetUserId()));
				}
				if (StringUtils.isNotEmpty(fileExchangeLog.getSourceUserId())) {
					predicates.add(criteriaBuilder.equal(root.get("sourceUserId").as(String.class),
							fileExchangeLog.getSourceUserId()));
				}
				if (startTime != null) {
					predicates.add(
							criteriaBuilder.greaterThanOrEqualTo(root.get("createTime").as(Date.class), startTime));
				}
				if (endTime != null) {
					predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createTime").as(Date.class), endTime));
				}

				return query.where(criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()])))
						.getRestriction();
			}
		};
		Page<FileExchangeLog> findAll = fileExchangeLogDao.findAll(specification, pageable);
		HashSet<Integer> ruleIds = new HashSet<>();
		HashSet<String> userIds = new HashSet<>();
		findAll.forEach(f -> {
			if (f.getRuleId() != null)
				ruleIds.add(f.getRuleId());
			if (f.getTargetUserId() != null)
				userIds.add(f.getTargetUserId());
			if (f.getSourceUserId() != null)
				userIds.add(f.getSourceUserId());
		});
		Map<String, String> userNames = userService.getUserNames(new ArrayList<>(userIds));
		Map<Integer, String> ruleMap = ruleService.getRuleMap(new ArrayList<>(ruleIds));
		Page<Map<String, Object>> map = findAll.map(m -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(m);
			objectToMap.put("ruleName", ruleMap.get(m.getRuleId()));
			objectToMap.put("sourceUserName", userNames.get(m.getSourceUserId()));
			objectToMap.put("targetUserName", userNames.get(m.getTargetUserId()));
			return objectToMap;
		});
//		ExampleMatcher matcher = ExampleMatcher.matching()
//				.withMatcher("ruleId", ExampleMatcher.GenericPropertyMatchers.exact())
//				.withMatcher("sourceFileName", ExampleMatcher.GenericPropertyMatchers.contains())
//				.withMatcher("targetFileName", GenericPropertyMatchers.contains())
//				.withMatcher("sourceUserId", GenericPropertyMatchers.contains())
//				.withMatcher("targetUserId", GenericPropertyMatchers.contains());
//		Example<FileExchangeLog> example = Example.of(fileExchangeLog, matcher);
//		Page<FileExchangeLog> page = fileExchangeLogDao.findAll(example, pageable);
		return map;
	}
}
