package com.example.demo.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;

public interface RuleService {
	void startCreateProcess(Rule rule, String[] userIds);

	List<Map<String, Object>> getTasks(String assignee);

	void confirmRuleProcess(String savePath, String saveFileId, String rootIds, String taskId);

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
	void deleteRuleConfirm(String userId, List<Integer> ids);

	void updateRule(Rule rule);

	void updateRuleConfirm(RuleConfirm confirm);

	/**
	 * 获得给我发送文件的用户
	 * 
	 * @param userId
	 * @return
	 */
	List<String> getSendInUserId(String userId);

	/**
	 * 获得接收我发送的文件的用户
	 * 
	 * @param userId
	 * @return
	 */
	List<String> getSendOutUserId(String userId);

	/**
	 * 匹配规则
	 * 
	 * @param fullPath
	 * @param userId
	 * @param sendTime 
	 */
	void matchingRule(String fileId, String userId, Date sendTime);

	/**
	 * 
	 * @param arrayList
	 * @return
	 */
	Map<Integer, String> getRuleMap(List<Integer> arrayList);

}
