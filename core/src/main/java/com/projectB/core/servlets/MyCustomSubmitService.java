package com.projectB.core.servlets;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import java.util.HashMap;
import java.util.Map;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class MyCustomSubmitService implements FormSubmitActionService {

  private static final String serviceName = "Core Custom AF Submit";

  private static Logger log = LoggerFactory.getLogger(MyCustomSubmitService.class);

  @Override
  public String getServiceName() {
    return serviceName;
  }

  @Override
  public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
    String data = formSubmitInfo.getData();
    log.info("using custom submit service, [data] --> " + data);
    Map<String, Object> result = new HashMap<>();
    result.put("status", "OK");
    return result;
  }
}
