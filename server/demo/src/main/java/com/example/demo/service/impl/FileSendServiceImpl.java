package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileSendRepository;
import com.example.demo.service.FileSendService;

@Service
public class FileSendServiceImpl implements FileSendService {

	@Autowired
	private FileSendRepository fileSendRepository;
}
