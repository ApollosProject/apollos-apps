package com.reactnativeapollosplayer.views

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativeapollosplayer.utils.PortalRegistry

class PortalOriginGroup(ctx: ThemedReactContext?, registry: PortalRegistry) : PortalViewGroup(ctx) {
  private var mDestination: String? = null
  private var mLastDestination: PortalDestinationGroup? = null
  private val mRegistry: PortalRegistry = registry

  // Buiness part
  fun restituteIfNeeded(destinationName: String?) {
    if (mLastDestination == null || destinationName == mLastDestination!!.name || mLastDestination!!.lastOrigin == null) {
      return
    }
    if (getId() === mLastDestination!!.lastOrigin?.getId()) {
      mLastDestination!!.restitute()
    }
  }

  fun move() {
    val realDestination: PortalDestinationGroup? = mDestination?.let { mRegistry.getDestination(it) }
    if (realDestination != null) {
      realDestination.restitute()
      moveTo(realDestination)
      realDestination.prepareNextRestitution(this)
    }
  }

  var destination: String?
    get() = mDestination
    set(newDestination) {
      // WillSet on iOS
      restituteIfNeeded(newDestination)
      mRegistry.remove(this)


      mDestination = newDestination

      // DidSet on iOS
      mRegistry.putOrigin(this)
      move()
    }

  fun setLastDestination(lastDestination: PortalDestinationGroup?) {
    mLastDestination = lastDestination
  }

}
