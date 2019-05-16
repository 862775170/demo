package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileSendHisRepository;
import com.example.demo.service.FileSendHisService;

@Service
public class FileSendHisServiceImpl implements FileSendHisService {
	@Autowired
	private FileSendHisRepository fileSendHisRepository;
}
