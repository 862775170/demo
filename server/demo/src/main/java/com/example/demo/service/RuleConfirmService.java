package com.example.demo.service;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.entity.RuleConfirm;

public interface RuleConfirmService {

	Long countByUserId(String userId);

	/**
	 * 获得规则发出去的文件个数
	 * 
	 * @param userId
	 * @param targetUserId
	 * @param pageable
	 * @return
	 */
	Page<Map<String, Object>> getRuleConfirmFileCount(String userId, String targetUserId, Pageable pageable);

	/**
	 * 保存确认规则
	 * 
	 * @param confirm
	 */
	void saveRuleConfirm(RuleConfirm confirm);

	/**
	 * 规则用户
	 * 
	 * @param userIds
	 * @param ruleId
	 */
	void updateRuleConfirm(Set<String> userIds, Integer ruleId);

	/**
	 * @param userIds    用户Ids
	 * @param ruleId     规则Id
	 * @param ruleName   规则名称
	 * @param createBy   创建人
	 * @param createTime 创建时间
	 */
	void addRuleConfirm(Collection<String> userIds, Integer ruleId, String ruleName, String createBy, Date createTime);
}
