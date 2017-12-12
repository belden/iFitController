
(function($) {    /* A nice closure to keep things tidy */

/*
 *
 * Usage:
 * 
 * To create :
 *
 * $(".mysliderclass").iFitSlider();
 *
 * To retrieve data:
 *
 * data = $("#mysliderid").data('slider');                   // Get the data from the parent element
 *
 *
 */


  $.fn.iFitSlider = function(options) {

      return this.each(function() {
	
	var slider = new iFitSlider(this,options);

	$(this).data('slider',slider);     // this attaches the data to the element so we can retrieve it later

	slider.init();

      });
  }


  /* The data and gui generating/manipulating object */

  var iFitSlider = function(element,options) {
      attr     = element.attributes;
      obj      = this;    
    
      this.wrapped_element = element;
      this.id              = attr.id.value;
      this.message         = attr.message.value;
      this.min             = attr.min.value;
      this.max             = attr.max.value;
      this.step            = attr.step.value;
      this.value           = attr.value.value;
      this.label           = attr.label.value;
      this.labelunit       = attr.labelunit.value;
      this.stub            = attr.stub.value;

      this.options         = options;

      console.log(this.message);

      this.init = function() {

	  var str = "<input type='range'" + 
	      " class=\"slider ifitslider\"" + 

   	      " min=\""      + this.min + "\"" + 
	      " max=\""      + this.max + "\"" +
	      " value=\""    + this.value + "\"" + 
	      " step=\""     + this.step + "\"" +
	      " id=\""       + this.id +"\"" +
              " <span>"      + this.label + " " + 
	      " <span class=\"ifitlabel\" id=\"" + this.stub + "label" + "\" " + 
	      " style='font-weight:bold;color:red'>" +  this.value + " </span> " + 

	      this.labelunit +  "</span>";

	      $(str).appendTo(element);

      }
      
     
  }

 })(jQuery);
