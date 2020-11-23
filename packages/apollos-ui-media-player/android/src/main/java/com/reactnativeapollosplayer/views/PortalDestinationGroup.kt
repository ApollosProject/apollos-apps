package com.reactnativeapollosplayer.views

import com.facebook.react.uimanager.ThemedReactContext
import com.reactnativeapollosplayer.utils.PortalRegistry

class PortalDestinationGroup(ctx: ThemedReactContext?, registry: PortalRegistry) : PortalViewGroup(ctx) {
  private var mName: String? = null
  private var mLastOrigin: PortalOriginGroup? = null
  private val mRegistry: PortalRegistry = registry

  //Business part
  private fun moveIfNeeded() {
    val potentialOrigin: PortalOriginGroup? = mName?.let { mRegistry.getOrigin(it) }
    if (potentialOrigin != null) {
      potentialOrigin.moveTo(this)
      prepareNextRestitution(potentialOrigin)
    }
  }

  fun restitute() {
    if (mLastOrigin != null) {
      moveTo(mLastOrigin!!)
      mLastOrigin!!.setLastDestination(null)
      mLastOrigin = null
    }
  }

  fun prepareNextRestitution(origin: PortalOriginGroup) {
    mLastOrigin = origin
    origin.setLastDestination(this)
  }

  // Accessors
  var name: String?
    get() = mName
    set(name) {
      mName = name
      mRegistry.putDestination(this)
      moveIfNeeded()
    }

  val lastOrigin: PortalOriginGroup?
    get() = mLastOrigin

}
