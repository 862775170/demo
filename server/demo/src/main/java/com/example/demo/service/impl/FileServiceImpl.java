package com.example.demo.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.common.ApiConstants;
import com.example.demo.common.HttpClient;
import com.example.demo.common.ParamException;
import com.example.demo.config.SystemProperties;
import com.example.demo.model.FileInfo;
import com.example.demo.model.UserInfo;
import com.example.demo.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Service
public class FileServiceImpl implements FileService {

	private static final Logger log = LoggerFactory.getLogger(FileServiceImpl.class);

	@Autowired
	private HttpClient httpClient;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private SystemProperties systemProperties;

	@Override
	public String getFileFullPath(String fullPath, String rootIds) {
		if (StringUtils.isEmpty(fullPath)) {
			return null;
		}
		if (StringUtils.isEmpty(rootIds)) {
			throw new ParamException("400", "[`rootIds`] 为空");
		}
		if (fullPath.indexOf(rootIds) == -1) {
			throw new ParamException("400", "参数错误");
		}
		fullPath = fullPath.substring(fullPath.indexOf(rootIds), fullPath.length());
		String[] fileIds = fullPath.split("/");
		Map<String, Object> map = new HashMap<>();
		map.put("fileIds", Stream.of(fileIds).filter(r -> StringUtils.isNotEmpty(r)).collect(Collectors.toList()));
		ResponseEntity<JsonObject> postByJson = httpClient.postByJson(ApiConstants.api_batch_file_info, map,
				JsonObject.class);
		log.info("http: /file/multiGetFileInfo result {}", postByJson);
		StringBuffer sb = new StringBuffer();
		Map<String, String> result = new HashMap<>();
		if (postByJson.getBody().has("result")) {
			JsonArray jsonArray = postByJson.getBody().get("result").getAsJsonArray();
			jsonArray.forEach(jobj -> {
				if (!jobj.isJsonNull()) {
					JsonObject el = jobj.getAsJsonObject();
					if (el.has("filename_KeywordIkPinyin")) {
						String fileId = el.get("file_id").getAsString();
						String fileIdPinyin = el.get("filename_KeywordIkPinyin").getAsString();
						result.put(fileId, fileIdPinyin);
					}
				}

			});

			for (String id : fileIds) {
				if (id.equals(rootIds) || StringUtils.isEmpty(result.get(id))) {
					continue;
				}
				sb.append("/" + result.get(id));
			}
			return sb.toString();
		}

		return null;
	}

	@Override
	public FileInfo getFineInfo(String fileId) {
		Map<String, Object> map = new HashMap<>();
		List<String> fileIds = new ArrayList<>();
		fileIds.add(fileId);
		map.put("fileIds", fileIds);
		ResponseEntity<JsonObject> postByJson = httpClient.postByJson(ApiConstants.api_batch_file_info, map,
				JsonObject.class);
		FileInfo fileInfo = null;
		if (postByJson.getBody().has("result")) {
			JsonArray jsonArray = postByJson.getBody().get("result").getAsJsonArray();
			if (!jsonArray.isJsonNull() && jsonArray.size() == 1) {
				JsonElement jsonElement = jsonArray.get(0);
				if (!jsonElement.isJsonNull()) {
					log.info("{}", jsonElement);
					try {
						fileInfo = objectMapper.readValue(jsonElement.toString(), FileInfo.class);
						log.debug("fileInfo => {}", fileInfo);
					} catch (IOException e) {
						log.error("json pojo error", e);
					}
				}
			} else {
				log.warn("");
			}
		}

		return fileInfo;
	}

	@Override
	public FileInfo copyObject(String sourceFileId, String parentId, String displayName, String targetUserId) {
		Map<String, Object> body = new HashMap<>();
		body.put("copySourceId", sourceFileId);
		body.put("displayName", displayName);
		body.put("userId", targetUserId);
		body.put("parentId", parentId);
		ResponseEntity<JsonObject> postByJson = httpClient.postByJson(ApiConstants.api_copy_object, body,
				JsonObject.class);
		String fileId = null;
		if (postByJson.getBody().has("result")) {
			JsonObject body2 = postByJson.getBody();
			if (body2.get("result").isJsonPrimitive()) {
				fileId = body2.get("result").getAsString();
			}
		}
		if (fileId == null) {
			throw new RuntimeException("复制文件失败" + postByJson.getBody().toString());
		}
		FileInfo fileInfo = getFineInfo(fileId);
		return fileInfo;
	}

	@Override
	public String copyToSwap(String fileId, String parentFileId, String fileName) {
		String userId = systemProperties.getUserId();
		FileInfo copyObject = copyObject(fileId, parentFileId, fileName, userId);
		return copyObject.getFileId();
	}

	@Override
	public FileInfo createFolder(String parentFileId, String fileName, String userId) {
		Map<String, Object> body = new HashMap<>();
		body.put("parentId", parentFileId);
		body.put("fileName", fileName);
		body.put("userId", userId);
		ResponseEntity<JsonObject> postByJson = httpClient.postByJson(ApiConstants.api_create_folder, body,
				JsonObject.class);
		String fileId = null;
		if (postByJson.getBody().has("result")) {
			JsonObject body2 = postByJson.getBody();
			if (body2.get("result").isJsonObject()) {
				JsonObject result = body2.get("result").getAsJsonObject();
				if (result.get("file_id").isJsonNull()) {

				} else {
					fileId = result.get("file_id").getAsString();
				}
			}
		}
		if (fileId == null) {
			throw new RuntimeException("创建目录失败" + postByJson.getBody().toString());
		}
		FileInfo fileInfo = getFineInfo(fileId);
		return fileInfo;
	}

	@Override
	public String createRuleSwap(String ruleId) {
		FileInfo createFolder = createFolder(systemProperties.getExchangeFileId(), ruleId,
				systemProperties.getUserId());
		return createFolder.getFileId();
	}

}
