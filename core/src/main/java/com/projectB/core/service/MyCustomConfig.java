package com.projectB.core.service;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "My Hidden Fields Custom OSGI Configuration", description = "Configuration for My Service")
public @interface MyCustomConfig {

  @AttributeDefinition(name = "Environment Information", description = "Environment Info")
  String environment_info() default "unknown";
}
