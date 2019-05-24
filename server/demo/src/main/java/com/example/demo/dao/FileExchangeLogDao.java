package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.FileExchangeLog;

public interface FileExchangeLogDao extends JpaRepository<FileExchangeLog, Integer> {

	List<FileExchangeLog> findBySourceUserId(String userId);

	List<FileExchangeLog> findByTargetUserId(String userId);

	List<FileExchangeLog> findBySourceUserIdAndTargetUserId(String sourceUserId, String targetUserId);

}
