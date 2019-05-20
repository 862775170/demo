package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.dao.RuleDao;
import com.example.demo.dao.UserDao;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleService;

@Service
public class RuleServiceImpl implements RuleService {

	private static final Logger log = LoggerFactory.getLogger(RuleServiceImpl.class);

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	@Autowired
	private RuleDao ruleDao;
	@Autowired
	private RuleConfirmDao ruleTargetDao;
	@Autowired
	private UserDao userDao;

	@Override
	public void startCreateProcess(Rule rule, String[] userIds) {
		log.info("create from => {}", rule.toString(), Arrays.toString(userIds));
		Map<String, Object> variables = new HashMap<>();
		variables.put("userIds", userIds);
		variables.put("createBy", rule.getCreateBy());
		variables.put("ruleName", rule.getRuleName());
		variables.put("userId", rule.getUserId());
		variables.put("sourcePath", rule.getSourcePath());
		variables.put("createTime", rule.getCreateTime());
		runtimeService.startProcessInstanceByKey("CreateRuleProcess", variables);
	}

	@Override
	public List<Map<String, Object>> getTasks(String assignee) {
		List<Task> list = taskService.createTaskQuery().taskAssignee(assignee).list();
		List<Map<String, Object>> list2 = new ArrayList<>();
		for (Task task : list) {
			Map<String, Object> map = new HashMap<>();
			map.put("id", task.getId());
			map.put("name", task.getName());
			map.put("processInstanceId", task.getProcessInstanceId());
//			map.put("processVariables", task.getProcessVariables());
//			map.put("taskLocalVariables", task.getTaskLocalVariables());
			map.put("variables", taskService.getVariables(task.getId()));
			list2.add(map);
		}
		return list2;
	}

	@Override
	public void confirmRuleProcess(String savePath, String taskId) {
		Map<String, Object> variables = new HashMap<>();
		variables.put("savePath", savePath);
		taskService.complete(taskId, variables);
	}

	@Override
	public List<Rule> getRules(String userId) {
		List<Rule> findByUserId = ruleDao.findByUserId(userId);
//		findByUserId.forEach(action -> {
//			List<RuleConfirm> ruleConfirms = ruleTargetDao.findByRuleId(action.getRuleId());
//		});
		return findByUserId.stream().filter(r -> r.getIsDelete() == null ? true : !r.getIsDelete())
				.collect(Collectors.toList());
	}

	@Override
	public List<Map<String, Object>> getFriends(String userId) {
//		Integer userId = TokenUtils.getUserId();
		List<Rule> rules = ruleDao.findByUserId(userId);
		List<RuleConfirm> ruleConfirms = ruleTargetDao.findByUserId(userId);
		List<Map<String, Object>> collect = null;
		HashSet<String> hashSet = new HashSet<>();
		List<RuleConfirm> findInRuleId = ruleTargetDao
				.findByRuleIdIn(rules.stream().map(s -> s.getRuleId()).collect(Collectors.toList()));
		ruleConfirms.addAll(findInRuleId);
		collect = ruleConfirms.stream().filter(f -> hashSet.add(f.getUserId())).map(r -> {
			Map<String, Object> hashMap = new HashMap<>();
//			User targetUser = userDao.findById(r.getUserId()).get();
			hashMap.put("userId", r.getUserId());
			hashMap.put("userName", r.getUserId());
			return hashMap;
		}).collect(Collectors.toList());

		return collect;
	}

	@Override
	public List<Map<String, Object>> getFriendsDetails(Integer ruleId) {
		List<RuleConfirm> ruleTargets = ruleTargetDao.findByRuleId(ruleId);
		List<Map<String, Object>> collect = ruleTargets.stream().map(r -> {
			Map<String, Object> hashMap = new HashMap<>();
//			User targetUser = userDao.findById(r.getUserId()).get();
			Rule rule = ruleDao.findById(r.getRuleId()).get();
			hashMap.put("id", r.getId());
			hashMap.put("ruleId", r.getRuleId());
			hashMap.put("ruleName", rule.getRuleName());
			hashMap.put("savePath", r.getSavePath());
			hashMap.put("userId", r.getUserId());
//			hashMap.put("username", targetUser.getUsername());
			return hashMap;
		}).collect(Collectors.toList());

		return collect;
	}

	@Override
	public List<Map<Object, Object>> getMyRuleConfirm(String userId) {
		List<RuleConfirm> findByUserId = ruleTargetDao.findByUserId(userId);
		List<Map<Object, Object>> collect = findByUserId.stream().map(m -> {
			Integer ruleId = m.getRuleId();
			Rule one = ruleDao.findByRuleId(ruleId);
			Map<Object, Object> objectToMap = ObjectUtils.objectToMap(m);
			objectToMap.put("rule", ObjectUtils.objectToMap(one));
			return objectToMap;
		}).collect(Collectors.toList());
		return collect;
//		List<Map<String, Object>> collect = ruleTargets.stream().map(m -> {
//			Map<String, Object> obj = new HashMap<>();
//			obj.put("savePath", m.getSavePath());
//			obj.put("createTime", m.getCreateTime());
//			obj.put("ruleId", m.getRuleId());
//			return obj;
//		}).collect(Collectors.toList());
//		return collect;
	}

	@Override
	public List<Map<Object, Object>> getRuleRelation(String userId) {
		List<RuleConfirm> ruleConfirm = ruleTargetDao.findByUserId(userId);
		List<Map<Object, Object>> collect = ruleConfirm.stream().map(m -> {
			Rule rule = ruleDao.findByRuleId(m.getRuleId());
			Map<Object, Object> map = new HashMap<>();
			map.put("id", m.getId());
			map.put("sendUserName", rule.getUserId());
			map.put("receiveUserName", m.getUserId());
			map.put("ruleName", rule.getRuleName());
			map.put("isDelete", rule.getIsDelete());
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public void deleteRule(String userId, Integer ruleId) {
		Rule rule = ruleDao.findById(ruleId).get();
		rule.setIsDelete(true);
		ruleDao.save(rule);
	}
}
