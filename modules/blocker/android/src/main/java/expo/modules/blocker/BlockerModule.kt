package expo.modules.blocker

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class BlockerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Blocker")

    Events("onCustomEvent")

    AsyncFunction("sendCustomEvent") { message: String ->
      sendEvent("onCustomEvent", mapOf(
        "message" to message
      ))
    }

  }
}
