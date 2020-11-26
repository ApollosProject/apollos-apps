package com.reactnativeapollosplayer.utils

import com.reactnativeapollosplayer.views.PortalDestinationGroup
import com.reactnativeapollosplayer.views.PortalOriginGroup
import java.util.HashMap

class PortalRegistry(origins: HashMap<String, PortalOriginGroup>, destinations: HashMap<String, PortalDestinationGroup>) {
  private val mOrigins:HashMap<String, PortalOriginGroup> = origins
  private val mDestinations:HashMap<String, PortalDestinationGroup> = destinations

  // Destination
  fun putDestination(destination:PortalDestinationGroup) {
    destination.name?.let { mDestinations.put(it, destination) }
  }
  fun getDestination(name:String): PortalDestinationGroup? {
    return mDestinations[name]
  }
  // Origins
  fun putOrigin(origin:PortalOriginGroup) {
    origin.destination?.let { mOrigins.put(it, origin) }
  }
  fun getOrigin(name:String): PortalOriginGroup? {
    return mOrigins[name]
  }
  fun remove(origin:PortalOriginGroup) {
    mOrigins.remove(origin.destination)
  }
}
