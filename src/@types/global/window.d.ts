interface Window {
  mozRequestAnimationFrame?: AnimationFrameProvider['requestAnimationFrame']
  WebKitMutationObserver?: MutationObserver
}
