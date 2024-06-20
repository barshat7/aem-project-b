package com.projectB.core.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

public class HiddenDataFieldProvider {

  static Map<String, Object> hiddenFields = new HashMap<>();

  /*
   * initialize all the hidden values specific to forms here
   */
  static {
    hiddenFields.put("development", new HashMap<String, String>() {
      {
        put("companyId", "dev-company-id");
        put("oid", "1");
      }
    });
    hiddenFields.put("stage", new HashMap<String, String>() {
      {
        put("companyId", "stage-company-id");
        put("oid", "2");
      }
    });
    hiddenFields.put("production", new HashMap<String, String>() {
      {
        put("companyId", "prod-company-id");
        put("oid", "3");
      }
    });

    hiddenFields.put("foobar", new HashMap<String, String>() {
      {
        put("companyId", "foobar-company-id");
        put("oid", "-1");
      }
    });
  }

  public static String getFieldsAsJson(String env) {
    String json = "";
    if (hiddenFields.containsKey(env)) {
      try {
        json = new ObjectMapper().writeValueAsString(hiddenFields.get(env));
      } catch (Exception ex) {
        throw new RuntimeException(ex);
      }
    }
    return json;
  }
}
