package com.projectB.core.service;

import com.adobe.forms.common.service.ContentType;
import com.adobe.forms.common.service.DataOptions;
import com.adobe.forms.common.service.DataProvider;
import com.adobe.forms.common.service.FormsException;
import com.adobe.forms.common.service.PrefillData;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.ComponentContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.framework.Constants;

@Component(
    service={DataProvider.class, CustomPrefillService.class},
    immediate = true,
    property = {
        Constants.SERVICE_ID + " = HiddenField-Custom-Prefill-Service",
        Constants.SERVICE_DESCRIPTION + " = Hidden Fields Custom Prefill Service"
    }
)
@Designate(ocd = MyCustomConfig.class)
public class CustomPrefillService implements DataProvider {

  public static final String SERVICE_NAME = "custom-hidden-input-prefill-service";

  public static final String SERVICE_DESCRIPTION = "custom-hidden-input-prefill-service";

  private MyCustomConfig myCustomConfig;

  @Activate
  public void activate(MyCustomConfig configuration) {
    this.myCustomConfig = configuration;
  }

  @Override
  public PrefillData getPrefillData(DataOptions dataOptions) throws FormsException {
    Map<String, String> hiddenFieldsMap = new HashMap<>();
    hiddenFieldsMap.put("development", "{\"companyId\":\"Development\",\"oid\":\"001\"}");
    hiddenFieldsMap.put("stage", "{\"companyId\":\"Stage\",\"oid\":\"002\"}");
    hiddenFieldsMap.put("production", "{\"companyId\":\"Production\",\"oid\":\"003\"}");
    String data = hiddenFieldsMap.get(myCustomConfig.environment_info());
    try {
      return new PrefillData(getDataInputStream(data), ContentType.JSON);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  private InputStream getDataInputStream(String data) {
    InputStream dataInputStream = null;
    try {
      dataInputStream = new ByteArrayInputStream(data.getBytes("UTF-8"));
    } catch (UnsupportedEncodingException e) {
      throw new RuntimeException(e);
    }
    return dataInputStream;
  }

  @Override
  public String getServiceName() {
    return SERVICE_NAME;
  }

  @Override
  public String getServiceDescription() {
    return SERVICE_DESCRIPTION;
  }
}
