package com.reactnativeapollosplayer.viewManagers

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativeapollosplayer.utils.PortalRegistry
import com.reactnativeapollosplayer.views.PortalDestinationGroup

class PortalDestinationManager(registry: PortalRegistry) : ViewGroupManager<PortalDestinationGroup?>() {
  private val mRegistry: PortalRegistry = registry
  override fun getName(): String {
    return "RCTPortalDestination"
  }

  public override fun createViewInstance(context: ThemedReactContext): PortalDestinationGroup {
    return PortalDestinationGroup(context, mRegistry)
  }

  @ReactProp(name = "name")
  fun setName(destination: PortalDestinationGroup, name: String?) {
    destination.name = name
  }

}
