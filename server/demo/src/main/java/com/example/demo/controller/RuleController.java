package com.example.demo.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.ConfirmSyncModel;
import com.example.demo.common.PageUtils;
import com.example.demo.common.Pages;
import com.example.demo.common.ParamException;
import com.example.demo.common.Result;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleConfirmService;
import com.example.demo.service.RuleService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rule")
public class RuleController {
	@Autowired
	private RuleService ruleService;

	@Autowired
	private RuleConfirmService ruleConfirmService;

	@PostMapping()
	@ApiOperation("创建规则")
	public Result createRule(@RequestBody Rule rule, String[] userIds) {
		rule.setCreateTime(new Date());
		ruleService.startCreateProcess(rule, userIds);
		return Result.ok();
	}

	@PostMapping("/update")
	@ApiOperation("修改发送规则")
	public Result updateRule(@RequestBody Rule rule) {
		if (rule.getRuleId() == null) {
			throw new ParamException("400", "rule 为空");
		}
		ruleService.updateRule(rule);
		return Result.ok(rule);
	}

	@PostMapping("/ruleConfirm/update")
	@ApiOperation("修改确认规则")
	public Result updateRuleConfirm(@RequestBody RuleConfirm confirm) {
		if (confirm.getId() == null) {
			throw new ParamException("400", "[id] 为空");
		}
		ruleService.updateRuleConfirm(confirm);
		return Result.ok();
	}

	@PostMapping("/addRuleUser")
	@ApiOperation("修改确认规则")
	public Result addRuleUser(String userId, Integer ruleId) {
//		if (confirm.getRuleId() == null) {
//			throw new ParamException("400", "[id] 为空");
//		}
//		ruleConfirmService.saveRuleConfirm(confirm);
		return Result.ok();
	}

	@PostMapping("/delete")
	@ApiOperation("删除规则")
	public Result deleteRule(String userId, Integer ruleId) {
		ruleService.deleteRule(userId, ruleId);
		return Result.ok();
	}

	@PostMapping("/ruleConfirm/delete")
	@ApiOperation("删除文件接收人")
	public Result deleteRuleConfirm(String userId, @RequestBody Integer[] ids) {
		ruleService.deleteRuleConfirm(userId, Arrays.asList(ids));
		return Result.ok();
	}

	@PostMapping("/confirmRule")
	@ApiOperation("接收人却认规则")
	public Result confirmRule(String savePath, String saveFildId, String rootIds, Integer taskId,
			ConfirmSyncModel model) {
		if (model == null) {
			model = ConfirmSyncModel.current;
		}
		ruleService.confirmRuleProcess(savePath, saveFildId, rootIds, taskId, model);
		return Result.ok();
	}

	@GetMapping("/tasks")
	@ApiOperation("获得待确认规则列表")
	public Result getTasks(String userId) {
		List<Map<String, Object>> tasks = ruleService.getTasks(userId);
		return Result.ok(tasks);
	}

	@GetMapping("/myRule")
	@ApiOperation("获得我发起规则")
	public Result getMyRule(String userId) {
		List<Map<String, Object>> rules = ruleService.getRules(userId);
		return Result.ok(rules);
	}

	@GetMapping("/my/confirm/rule")
	@ApiOperation("获得确认的规则")
	public Result getMyRuleConfirm(String userId) {
//		Integer userId = TokenUtils.getUserId();
		List<Map<String, Object>> rules = ruleService.getMyRuleConfirm(userId);
		return Result.ok(rules);
	}

	@GetMapping("/getFriends")
	@ApiOperation("获得我的好友")
	public Result getFriends(String userId) {
		List<Map<String, Object>> friends = ruleService.getFriends(userId);
		return Result.ok(friends);
	}

	/**
	 * @param userId
	 * @return
	 */
	@GetMapping("rule/relation")
	@ApiOperation("获得与我相关的规则")
	public Result getRuleRelation(String userId, String targetUserId) {
		List<Map<Object, Object>> rules = ruleService.getRuleRelation(userId, targetUserId);

		return Result.ok(rules);
	}

	@GetMapping("/getRule/details")
	@ApiOperation("获得规则下面有多少人")
	public Result getRuleDetails(Integer ruleId) {
		List<Map<String, Object>> friends = ruleService.getFriendsDetails(ruleId);
		return Result.ok(friends);
	}

	@GetMapping("/getRuleCount")
	@ApiOperation("获得规则发送了多少文件和接收人数")
	public Result getRuleSendCount(String userId, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Map<String, Object>> page = ruleService.getRuleCount(userId, pageable);
		return Result.ok(page);
	}

	@GetMapping("/getMyRuleReceiveCount")
	@ApiOperation("获得我确认的规则分别接收了多少文件")
	public Result getRuleReceiveCount(String userId, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Map<String, Object>> page = ruleService.getRuleReceiveCount(userId, pageable);
		return Result.ok(page);
	}

	/**
	 * 获得我给目标用户发送的文件数 规则分组
	 * 
	 * @param userId       当前登录用户
	 * @param targetUserId 接收规则用户
	 * @param pages
	 * @return
	 */
	@GetMapping("/{userId}/{targetUserId}")
	@ApiOperation("获得我给目标用户发送的文件数")
	public ResponseEntity<?> getUserIdAndTargetUserId(@PathVariable("userId") String userId,
			@PathVariable("targetUserId") String targetUserId, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Map<String, Object>> page = ruleService.getRuleOutCount(userId, targetUserId, pageable);
		return new ResponseEntity<>(page, HttpStatus.OK);
	}

	@GetMapping("/receive/{userId}/{targetUserId}")
	@ApiOperation("获得我接收文件的个数 规则 分组")
	public ResponseEntity<?> getRuleConfirmFileCount(@PathVariable("userId") String userId,
			@PathVariable("targetUserId") String targetUserId, Pages pages) {
		Pageable pageable = PageUtils.createPageRequest(pages);
		Page<Map<String, Object>> page = ruleConfirmService.getRuleConfirmFileCount(userId, targetUserId, pageable);
		return new ResponseEntity<>(page, HttpStatus.OK);
	}
//	@GetMapping("/getMyRuleReceiveCount/chart")
//	@ApiOperation("获得我确认的规则分别接收了多少文件")
//	public Result getRuleReceiveCountByChart(String userId) {
//		List<Map<String, Object>> page = ruleService.getRuleReceiveCountByChart(userId);
//		return Result.ok(page);
//	}
//
//	@GetMapping("/getRuleCount/chart")
//	@ApiOperation("获得规则发送了多少文件和接收人数")
//	public Result getRuleSendCountBychart(String userId) {
//		List<Map<String, Object>> page = ruleService.getRuleCountByChart(userId);
//		return Result.ok(page);
//	}
}
