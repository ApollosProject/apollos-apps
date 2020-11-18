package com.reactnativeapollosplayer.views

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup

open class PortalViewGroup(ctx: ThemedReactContext?) : ReactViewGroup(ctx) {
  fun moveTo(destination: PortalViewGroup) {
    destination.removeAllViews()
    var sourceChild = getChildAt(0)
    while (sourceChild != null) {
      removeView(sourceChild)
      destination.addView(sourceChild)
      sourceChild = getChildAt(0)
    }
  }
}
