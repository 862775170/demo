package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileSendTaskRepository;
import com.example.demo.service.FileSendTaskService;

@Service
public class FileSendTaskServiceImpl implements FileSendTaskService {

	@Autowired
	private FileSendTaskRepository fileSendTaskRepository;
}
