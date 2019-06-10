package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.dao.RuleDao;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleConfirmService;
import com.example.demo.service.RuleService;

@Service
public class RuleConfirmServiceImpl implements RuleConfirmService {
	@Autowired
	private RuleConfirmDao ruleConfirmDao;
	@Autowired
	private RuleDao ruleDao;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;

	@Override
	public Long countByUserId(String userId) {
		return ruleConfirmDao.countByUserIdAndDeleteTimeIsNull(userId);
	}

	@Override
	public Page<Map<String, Object>> getRuleConfirmFileCount(String userId, String targetUserId, Pageable pageable) {
		List<Integer> ruleIds = new ArrayList<Integer>();
		Map<Integer, String> rulenameMap = new HashMap<Integer, String>();
		ruleDao.findByUserId(targetUserId).forEach(action -> {
			ruleIds.add(action.getRuleId());
			rulenameMap.put(action.getRuleId(), action.getRuleName());
		});

		Page<RuleConfirm> page = ruleConfirmDao.findByRuleIdInAndUserId(ruleIds, userId, pageable);
		Page<Map<String, Object>> page2 = page.map(f -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(f);
			Long countFile = fileExchangeLogDao.countByRuleConfirmId(f.getId());
			objectToMap.put("count", countFile);
			objectToMap.put("ruleName", rulenameMap.get(f.getRuleId()));
			return objectToMap;
		});
		return page2;
	}

}
