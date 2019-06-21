package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.dao.RuleDao;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.entity.Trends;
import com.example.demo.model.UserInfo;
import com.example.demo.service.RuleConfirmService;
import com.example.demo.service.TrendsService;
import com.example.demo.service.UserService;

@Service
public class RuleConfirmServiceImpl implements RuleConfirmService {
	@Autowired
	private RuleConfirmDao ruleConfirmDao;
	@Autowired
	private RuleDao ruleDao;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;
	@Autowired
	private UserService userService;
	@Autowired
	private TrendsService trendsService;

	private static final Logger log = LoggerFactory.getLogger(RuleConfirmServiceImpl.class);

	@Override
	public Long countByUserId(String userId) {
		return ruleConfirmDao.countByUserIdAndDeleteTimeIsNull(userId);
	}

	@Override
	public Page<Map<String, Object>> getRuleConfirmFileCount(String userId, String targetUserId, Pageable pageable) {
		List<Integer> ruleIds = new ArrayList<Integer>();
		Map<Integer, String> rulenameMap = new HashMap<Integer, String>();
		ruleDao.findByUserIdAndDeleteTimeIsNull(targetUserId).forEach(action -> {
			ruleIds.add(action.getRuleId());
			rulenameMap.put(action.getRuleId(), action.getRuleName());
		});

		Page<RuleConfirm> page = ruleConfirmDao.findByRuleIdInAndUserIdAndDeleteTimeIsNull(ruleIds, userId, pageable);
		Page<Map<String, Object>> page2 = page.map(f -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(f);
			Long countFile = fileExchangeLogDao.countByRuleConfirmId(f.getId());
			objectToMap.put("count", countFile);
			objectToMap.put("ruleName", rulenameMap.get(f.getRuleId()));
			return objectToMap;
		});
		return page2;
	}

	@Override
	public void saveRuleConfirm(RuleConfirm confirm) {
		ruleConfirmDao.save(confirm);
	}

	@Override
	public void updateRuleConfirm(Set<String> userIds, Integer ruleId) {
		log.info("userIds {},ruleId=>{}", userIds, ruleId);
		Rule rule = ruleDao.findById(ruleId).get();
		Iterator<String> iterator = userIds.iterator();
		Set<String> userIdsL = new HashSet<>();
		while (iterator.hasNext()) {
			String userId = iterator.next();
			RuleConfirm ruleConfirm = ruleConfirmDao.findByRuleIdAndUserIdAndDeleteTimeIsNull(ruleId, userId);
			if (ruleConfirm == null) {
				userIdsL.add(userId);
			}
		}
		this.addRuleConfirm(userIdsL, ruleId, rule.getRuleName(), rule.getUserId(), new Date());
		List<RuleConfirm> confirms = ruleConfirmDao.findByRuleIdAndUserIdNotIn(ruleId, userIds);
		removeRuleConfirm(confirms, rule.getRuleName());
	}

	private void removeRuleConfirm(List<RuleConfirm> ruleConfirms, String ruleName) {
		Date deleteTime = new Date();
		List<Trends> trendsList = new ArrayList<>();
		for (RuleConfirm ruleConfirm : ruleConfirms) {
			ruleConfirm.setDeleteTime(deleteTime);
			Trends e = new Trends();
			e.setCreateTime(deleteTime);
			e.setDesc("您被移除规则:" + ruleName);
			e.setEvent("移出规则");
			e.setUserId(ruleConfirm.getUserId());
			trendsList.add(e);
		}
		ruleConfirmDao.saveAll(ruleConfirms);
		trendsService.saveBatch(trendsList);
	}

	@Override
	public void addRuleConfirm(Collection<String> userIds, Integer ruleId, String ruleName, String createBy,
			Date createTime) {
		List<RuleConfirm> ruleConfirmList = new ArrayList<>();
		for (String userId : userIds) {
			UserInfo user = userService.getUserInfo(userId);
			RuleConfirm ruleConfirm = new RuleConfirm();
			ruleConfirm.setCreateBy(createBy);
			ruleConfirm.setUserId(user.getUserId());
			ruleConfirm.setCreateTime(createTime);
			ruleConfirm.setRootIds(user.getRootIds());
			ruleConfirm.setSaveFileId(user.getRootIds());
			ruleConfirm.setSavePathName("/");
			ruleConfirm.setRuleId(ruleId);
			ruleConfirmList.add(ruleConfirm);
		}
		ruleConfirmDao.saveAll(ruleConfirmList);

		List<Trends> trendList = new ArrayList<>();

		for (String userId : userIds) {
			Trends trends = new Trends();
			trends.setUserId(userId);
			trends.setEvent("确认规则");
			trends.setDesc(ruleName);
			trends.setCreateTime(createTime);
			trendList.add(trends);
		}
		trendsService.saveBatch(trendList);
	}

}
