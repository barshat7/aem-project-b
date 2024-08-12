package com.projectB.core.servlets;

import com.adobe.aemds.guide.model.FormSubmitInfo;
import com.adobe.aemds.guide.service.FormSubmitActionService;
import com.adobe.granite.resourceresolverhelper.ResourceResolverHelper;
import java.util.HashMap;
import java.util.Map;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(
    service = FormSubmitActionService.class,
    immediate = true
)
public class MyCustomSubmitService implements FormSubmitActionService {

  private static final String serviceName = "Core Custom AF Submit";

  private static Logger log = LoggerFactory.getLogger(MyCustomSubmitService.class);

  @Reference
  protected ResourceResolverHelper resourceResolverHelper;

  @Override
  public String getServiceName() {
    return serviceName;
  }

  @Override
  public Map<String, Object> submit(FormSubmitInfo formSubmitInfo) {
    String data = formSubmitInfo.getData();
    Resource formContainer = formSubmitInfo.getFormContainerResource();
    if (formContainer == null) {
      formContainer = getFormContainerResource(formSubmitInfo);
    }
    log.info("using custom submit service, [formcaontainer] --> " + formContainer);
    Map<String, Object> result = new HashMap<>();
    result.put("status", "OK");
    return result;
  }

  private Resource getFormContainerResource(FormSubmitInfo formSubmitInfo) {
    ResourceResolver resourceResolver = resourceResolverHelper.getResourceResolver();
    return resourceResolver.getResource(formSubmitInfo.getFormContainerPath());
  }
}
