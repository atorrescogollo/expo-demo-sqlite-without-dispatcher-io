import { NativeModule, requireNativeModule } from "expo";

export type BlockerModuleEvents = {
  onCustomEvent: (event: { message: string }) => void;
};

declare class BlockerModule extends NativeModule<BlockerModuleEvents> {
  sendCustomEvent(message: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BlockerModule>("Blocker");
