import AVKit

@objc(ApollosPlayer)
class ApollosPlayer: NSObject {

    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    @objc(isPictureInPictureSupported:withRejecter:)
    func isPictureInPictureSupported(
        resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(AVPictureInPictureController.isPictureInPictureSupported());
    }
}
