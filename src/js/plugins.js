// Avoid `console` errors in browsers that lack a console.
;
(function () {
  var method
  var noop = function () {
  }
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ]
  var length = methods.length
  var console = (window.console = window.console || {})

  while (length--) {
    method = methods[length]

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop
    }
  }
}())

;
(function ($) {
  $.fn.fixHeight = function () { // TODO namespace my own jQuery extensions
    this.innerHeight(30)
    if (this.get(0) && this.get(0).scrollHeight > this.innerHeight()) {
      this.innerHeight(this.get(0).scrollHeight)
    }
  }
})(jQuery)
