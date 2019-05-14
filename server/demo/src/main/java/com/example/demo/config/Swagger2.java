package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
/*
 * 连接特定的 DNS 后缀: 
描述: vmxnet3 Ethernet Adapter #3
物理地址: ‎00-50-56-B1-D2-10
已启用 DHCP: 是
IPv4 地址: 192.168.218.71
IPv4 子网掩码: 255.255.255.0
获得租约的时间: 2018年12月25日 17:13:10
租约过期的时间: 2019年5月14日 17:14:14
IPv4 默认网关: 192.168.218.254
IPv4 DHCP 服务器: 172.20.1.5
IPv4 DNS 服务器: 172.20.1.3, 172.20.1.4
IPv4 WINS 服务器: 
已启用 NetBIOS over Tcpip: 是
 * 
 * 
 * */
@Configuration
@EnableSwagger2
public class Swagger2 {
	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).select()
				.apis(RequestHandlerSelectors.basePackage("com.example.demo")).paths(PathSelectors.any()).build();
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("demo").description("数据库地址: http://http://192.168.20.118:8088/h2-console <br/> 用户名: root<br/>密码: fcbss@123").termsOfServiceUrl("http://192.168.218.71:8088/h2-console").version("1.0").build();
	}
}
