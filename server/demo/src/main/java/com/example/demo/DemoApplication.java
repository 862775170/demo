package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example")
public class DemoApplication {

	public static void main(String[] args) {
		new Long(1).intValue();
		SpringApplication.run(DemoApplication.class, args);
	}

	public static int passInt(long value) {
		if (Integer.MAX_VALUE <= value && value >= Integer.MIN_VALUE) {
			return (int) value;
		} else {
			throw new ClassCastException("");
		}
	}
}
