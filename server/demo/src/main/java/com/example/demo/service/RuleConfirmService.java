package com.example.demo.service;

import java.util.Map;

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
}
