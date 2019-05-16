package com.example.demo.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.Result;
import com.example.demo.common.TokenUtils;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rule")
public class RuleController {
	@Autowired
	private RuleService ruleService;

	@PostMapping()
	@ApiOperation("创建规则")
	public Result createRule(@RequestBody Rule rule, String[] userIds) {
		rule.setCreateTime(new Date());
		ruleService.startCreateProcess(rule, userIds);
		return Result.ok();
	}

	@PostMapping("/confirmRule")
	@ApiOperation("接收人却认规则")
	public Result confirmRule(String savePath, String taskId) {
		ruleService.confirmRuleProcess(savePath, taskId);
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

		List<Rule> rules = ruleService.getRules(userId);
		return Result.ok(rules);
	}

	@GetMapping("/my/confirm/rule")
	@ApiOperation("获得我确认的规则")
	public Result getMyRuleConfirm(String userId) {
//		Integer userId = TokenUtils.getUserId();
		List<RuleConfirm> rules = ruleService.getMyRuleConfirm(userId);
		return Result.ok(rules);
	}

	@GetMapping("/getFriends")
	@ApiOperation("获得我的好友")
	public Result getFriends(String userId) {
		List<Map<String, Object>> friends = ruleService.getFriends(userId);
		return Result.ok(friends);
	}

	@GetMapping("/getRule/details")
	@ApiOperation("获得规则下面有多少人")
	public Result getRuleDetails(Integer ruleId) {
		List<Map<String, Object>> friends = ruleService.getFriendsDetails(ruleId);
		return Result.ok(friends);
	}
}
