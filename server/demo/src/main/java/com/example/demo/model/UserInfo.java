package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class UserInfo {
	@JsonAlias("id")
	private String userId;
	@JsonAlias("root_ids")
	private String rootIds;
	@JsonAlias("user_name")
	private String userName;
	@JsonAlias("nick_name")
	private String nickName;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getRootIds() {
		return rootIds;
	}

	public void setRootIds(String rootIds) {
		this.rootIds = rootIds;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}
