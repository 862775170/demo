package com.example.demo.service;

import java.util.List;
import java.util.Map;

import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;

public interface RuleService {
	void startCreateProcess(Rule rule, String[] userIds);

	List<Map<String, Object>> getTasks(String assignee);

	void confirmRuleProcess(String savePath, String rootIds, String taskId);

	List<Rule> getRules(String userId);

	List<Map<String, Object>> getFriends(String userId);

	List<Map<String, Object>> getFriendsDetails(Integer ruleId);

	/**
	 * 获得我却认的规则
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<Object, Object>> getMyRuleConfirm(String userId);

	/**
	 * 规则关系
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<Object, Object>> getRuleRelation(String userId);

	void deleteRule(String userId, Integer ruleId);

	/**
	 * 删除确认规则
	 * 
	 * @param userId
	 * @param ruleId
	 */
	void deleteRuleConfirm(String userId, Integer id);

	void updateRule(Rule rule);

	void updateRuleConfirm(RuleConfirm confirm);

}
