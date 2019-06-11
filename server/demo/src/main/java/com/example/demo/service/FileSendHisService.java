package com.example.demo.service;

import java.util.Date;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.entity.FileSendHis;

public interface FileSendHisService {
	void addFileSendHis(String userId, Integer ruleId, Integer fileNumber, String fileId, String fileName, Date uploadTime);

	Page<Map<String, Object>> getFileSendHis(FileSendHis probe, Pageable pageable);
}
