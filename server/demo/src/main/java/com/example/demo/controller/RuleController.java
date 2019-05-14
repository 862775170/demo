package com.example.demo.controller;

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
import com.example.demo.entity.RuleTarget;
import com.example.demo.service.RuleService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rule")
public class RuleController {
	@Autowired
	private RuleService ruleService;

	@PostMapping()
	@ApiOperation("创建规则")
	public Result createRule(@RequestBody Rule rule, Integer[] userIds) {
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
	public Result getTasks() {
		List<Map<String, Object>> tasks = ruleService.getTasks(TokenUtils.getUserId().toString());
		return Result.ok(tasks);
	}

	@GetMapping("/myRule")
	@ApiOperation("获得我发起规则")
	public Result getMyRule() {
		Integer userId = TokenUtils.getUserId();
		List<Rule> rules = ruleService.getRules(userId);
		return Result.ok(rules);
	}

	@GetMapping("/my/confirm/rule")
	@ApiOperation("获得我确认的规则")
	public Result getMyRuleConfirm() {
		Integer userId = TokenUtils.getUserId();
		List<RuleTarget> rules = ruleService.getMyRuleConfirm(userId);
		return Result.ok(rules);
	}

	@GetMapping("/getFriends")
	@ApiOperation("获得我的好友")
	public Result getFriends() {
		List<Map<String, Object>> friends = ruleService.getFriends();
		return Result.ok(friends);
	}

	@GetMapping("/getRule/details")
	@ApiOperation("获得规则下面有多少人")
	public Result getRuleDetails(Integer ruleId) {
		List<Map<String, Object>> friends = ruleService.getFriendsDetails(ruleId);
		return Result.ok(friends);
	}
}
