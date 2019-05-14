package com.example.demo.common;

public class Result {
	private Object data;

	private String msg;

	private String code;

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public static Result ok(Object object) {
		Result result = new Result();
		result.setData(object);
		result.setCode("200");
		result.setMsg("ok");
		return result;
	}

	public static Result ok() {
		return ok(null);
	}

	public static Result err(String code, String msg) {
		Result result = new Result();
		result.setCode(code);
		result.setMsg(msg);
		return result;
	}

	public static Result err() {
		Result result = new Result();
		result.setCode("500");
		result.setMsg("错误");
		return result;
	}
}
