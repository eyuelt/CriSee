var RGBChange = function() {
  var r = $('#R').slider().data('slider');
  var currVal = r.getValue();

  var red = 245;
  var green = (100 - currVal) * 2.5;
  var blue = (100 - currVal) * 2.5;
  red = parseInt(red.toFixed(0));
  green = parseInt(green.toFixed(0));
  blue = parseInt(blue.toFixed(0));

  $('#RC .slider-selection').css('background', 'rgb('+ red +','+ green +','+ blue +')')
  $('#RC .slider-handle').css('background', 'rgb('+ red +','+ green +','+ blue +')')

};


var clicked = false;

$(document).ready(function() {
  /** Initialize value of slider **/
  var r = $('#R').slider()
  .on('slide', RGBChange)
  .data('slider');

  r.setValue(stresslevel);
  RGBChange();
  $('#sliderSpan')[0].style.visibility = "visible";


  /** Allow dragging for mobile **/
  var sliderSpan = $('#sliderSpan');
  var slider = $('#R').data('slider');

  sliderSpan.on('touchstart vmousedown', function(){
    //These events only seem to get sent on the mobile version
    clicked = true;
  })

  sliderSpan.on('touchmove vmousemove', function(event){
    if (clicked === true && event.type === "vmousemove") {
      var percent = (event.clientX - sliderSpan[0].offsetLeft)/sliderSpan[0].clientWidth;
      slider.setValue(percent*100);
      RGBChange();
    }
  })

  sliderSpan.on('touchend vmouseup', function(){
    clicked = false;
  });


  /** Disable selection of sliderbar **/
  $(document).ready(function(){
    $('.notSelectable').disableSelection();
  });
  // This jQuery Plugin will disable text selection for Android and iOS devices.
  // Stackoverflow Answer: http://stackoverflow.com/a/2723677/1195891
  $.fn.extend({
    disableSelection: function() {
      this.each(function() {
        this.onselectstart = function() {
          return false;
        };
        this.unselectable = "on";
        $(this).css('-moz-user-select', 'none');
        $(this).css('-webkit-user-select', 'none');
      });
    }
  });
});
