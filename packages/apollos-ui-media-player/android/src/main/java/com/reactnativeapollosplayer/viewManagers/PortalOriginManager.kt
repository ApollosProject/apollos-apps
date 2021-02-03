package com.reactnativeapollosplayer.viewManagers

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativeapollosplayer.utils.PortalRegistry
import com.reactnativeapollosplayer.viewManagers.PortalDestinationManager
import com.reactnativeapollosplayer.views.PortalOriginGroup

class PortalOriginManager(registry: PortalRegistry) : ViewGroupManager<PortalOriginGroup?>() {
  private val mRegistry: PortalRegistry = registry
  override fun getName(): String {
    return "RCTPortalOrigin"
  }

  public override fun createViewInstance(context: ThemedReactContext): PortalOriginGroup {
    return PortalOriginGroup(context, mRegistry)
  }

  @ReactProp(name = "destination")
  fun setDestination(origin: PortalOriginGroup, destination: String?) {
    origin.destination = destination;
  }

}
