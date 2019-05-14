package com.example.demo.service;

import javax.servlet.http.HttpServletResponse;

public interface ProcessDiagram {

	boolean isFinished(String processInstanceId);

	void genProcessDiagram(HttpServletResponse httpServletResponse, String processId);

}
