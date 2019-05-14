package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.Result;
import com.example.demo.dao.UserDao;
import com.example.demo.entity.User;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserDao userDao;

	@PostMapping("/reg")
	public Result reg(User user) {
		User save = userDao.save(user);
		return Result.ok(save);
	}

	@PostMapping("/login")
	public Result login(@RequestBody User user) {
		User info = userDao.findByUsernameAndPassword(user.getUsername(), user.getPassword());
		if (info == null) {
			return Result.err("401", "用户名或者密码错误");
		}
		info.setPassword(null);
		return Result.ok(info);
	}

	@GetMapping
	@ApiOperation("获得用户列表")
	public Result userList() {
		List<User> findAll = userDao.findAll();
		return Result.ok(findAll);
	}
	
	
}
