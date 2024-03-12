package com.projectB.core;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

public class AppTest {

  public static void main(String[] args) throws JsonProcessingException {
    Map<String, Object> rootData = new HashMap<>();
    Map<String, Object> data = new HashMap<>();
    data.put("oid", "00900");
    data.put("companyId", "NA");
    rootData.put("data", data);

    String json = String.valueOf(new ObjectMapper().writeValueAsString(data));

    System.out.println(json);
  }
}
