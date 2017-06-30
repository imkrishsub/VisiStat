(function($){

    $.fn.detachTemp = function() {
        this.data('dt_placeholder',$('<span />').insertAfter( this ));
        return this.detach();
    }

    $.fn.reattach = function() {
        if(this.data('dt_placeholder')){
            this.insertBefore( this.data('dt_placeholder') );
            this.data('dt_placeholder').remove();
            this.removeData('dt_placeholder');
        }
        else if(window.console && console.error)
        console.error("Unable to reattach this element "
        + "because its placeholder is not available.");
        return this;
    }

})(jQuery);