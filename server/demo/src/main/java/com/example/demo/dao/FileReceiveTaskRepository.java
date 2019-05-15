package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.FileReceiveTask;

public interface FileReceiveTaskRepository extends JpaRepository<FileReceiveTask, Integer> {

}
