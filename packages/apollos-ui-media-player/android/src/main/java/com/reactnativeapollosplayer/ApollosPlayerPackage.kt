package com.reactnativeapollosplayer

import java.util.Arrays
import java.util.Collections

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.bridge.JavaScriptModule
import com.reactnativeapollosplayer.utils.PortalRegistry
import com.reactnativeapollosplayer.viewManagers.PortalDestinationManager
import com.reactnativeapollosplayer.viewManagers.PortalOriginManager
import com.reactnativeapollosplayer.views.PortalDestinationGroup
import com.reactnativeapollosplayer.views.PortalOriginGroup
import java.util.HashMap

class ApollosPlayerPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
      val registry = PortalRegistry(HashMap<String, PortalOriginGroup>(), HashMap<String, PortalDestinationGroup>())
      return listOf(
        PortalDestinationManager(registry),
        PortalOriginManager(registry)
      )
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return emptyList<NativeModule>()
    }
}

