package com.example.demo.common;

public class ParamException extends RuntimeException {

	public ParamException(String code, String msg) {
		super(msg);
		this.code = code;
		this.msg = msg;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -1259775478040849333L;

	public String msg;

	public String code;

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

}
