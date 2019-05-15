package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.FileSendTask;

public interface FileSendTaskRepository extends JpaRepository<FileSendTask, Integer> {

}
