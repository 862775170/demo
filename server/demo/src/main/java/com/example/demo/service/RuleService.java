package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleTarget;

public interface RuleService {
	void startCreateProcess(Rule rule, Integer[] userIds);

	List<Map<String, Object>> getTasks(String assignee);

	void confirmRuleProcess(String savePath, String taskId);

	List<Rule> getRules(Integer userId);

	List<Map<String, Object>> getFriends();

	List<Map<String, Object>> getFriendsDetails(Integer ruleId);

	/**
	 * 获得我却认的规则
	 * 
	 * @param userId
	 * @return
	 */
	List<RuleTarget> getMyRuleConfirm(Integer userId);

}
