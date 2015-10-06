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
    var el = this.get(0) // 'this' is jQuery, el is its html element

    if (el && el.scrollHeight > this.innerHeight()) {
      this.innerHeight(el.scrollHeight)
    }

    if (this.innerHeight() > $(window).height() / 2 - 75) {
      this.innerHeight($(window).height() / 2 - 75)
    }
  }
})(jQuery)

  /*
   * jQuery Easing v1.3.2 - http://gsgd.co.uk/sandbox/jquery/easing/
   * Open source under the BSD License.
   * Copyright © 2008 George McGinley Smith
   * All rights reserved.
   * https://raw.github.com/gdsmith/jquery-easing/master/LICENSE
   */

// t: current time, b: begInnIng value, c: change In value, d: duration
;
(function ($) {
  $.extend($.easing, {
    easeOutCubic: function (x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b
    }
  })
})(jQuery)
