!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.dayjs_plugin_dayOfYear=e()}(this,function(){"use strict";return function(t,e){e.prototype.dayOfYear=function(t){var e=Math.round((this.startOf("day")-this.startOf("year"))/864e5)+1;return null==t?e:this.add(t-e,"day")}}});

