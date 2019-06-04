package com.example.demo.service;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;

public interface RuleService {
	/**
	 * 创建规则
	 * 
	 * @param rule
	 * @param userIds
	 */
	void startCreateProcess(Rule rule, String[] userIds);

	/**
	 * 获得待确认的规则
	 * 
	 * @param assignee
	 * @return
	 */
	List<Map<String, Object>> getTasks(String assignee);

	/**
	 * 确认规则
	 * 
	 * @param savePath
	 * @param saveFileId
	 * @param rootIds
	 * @param taskId
	 */
	void confirmRuleProcess(String savePath, String saveFileId, String rootIds, String taskId);

	/**
	 * 获得用户下面所有规则
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getRules(String userId);

	/**
	 * 获得我的好友
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getFriends(String userId);

	/**
	 * 获得规则下面的好友
	 * 
	 * @param ruleId
	 * @return
	 */
	List<Map<String, Object>> getFriendsDetails(Integer ruleId);

	/**
	 * 获得我却认的规则
	 * 
	 * @param userId
	 * @return
	 */
	List<Map<String, Object>> getMyRuleConfirm(String userId);

	/**
	 * 获得规则关系
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

	/**
	 * 更新规则
	 * 
	 * @param rule
	 */
	void updateRule(Rule rule);

	/**
	 * 更新确认规则
	 * 
	 * @param confirm
	 */
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
	 * 获得规则id 和name
	 * 
	 * @param arrayList
	 * @return
	 */
	Map<Integer, String> getRuleMap(Collection<Integer> arrayList);

	/**
	 * 获得规则发送了多少文件和接收多少人
	 * 
	 * @param userId
	 * @param pageable
	 * @return
	 */
	Page<Map<String, Object>> getRuleCount(String userId, Pageable pageable);

	Page<Map<String, Object>> getRuleReceiveCount(String userId, Pageable pageable);

	Long countByUserId(String userId);

}
