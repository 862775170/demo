package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
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
		return findByUserId;
//		List<Map<String, Object>> maps = list.stream().map(r -> {
//			Map<String, Object> map = new HashMap<>();
//			map.put("ruleId", r.getRuleId());
//			map.put("ruleName", r.getRuleName());
//			map.put("sourcePath", r.getSourcePath());
//			map.put("userId", r.getUserId());
//			return map;
//		}).collect(Collectors.toList());
//		return maps;
	}

	@Override
	public List<Map<String, Object>> getFriends(String userId) {
//		Integer userId = TokenUtils.getUserId();
		List<Rule> rules = ruleDao.findByUserId(userId);
		List<Map<String, Object>> collect = null;
		HashSet<String> hashSet = new HashSet<>();
		List<RuleConfirm> findInRuleId = ruleTargetDao
				.findByRuleIdIn(rules.stream().map(s -> s.getRuleId()).collect(Collectors.toList()));
		collect = findInRuleId.stream().filter(f -> hashSet.add(f.getUserId())).map(r -> {
			Map<String, Object> hashMap = new HashMap<>();
//			User targetUser = userDao.findById(r.getUserId()).get();
			hashMap.put("userId", r.getUserId());
//			hashMap.put("username", targetUser.getUsername());s
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
}
