/**
 * $.fn.mutex
 *
 * Manage a set of named mutexes.
 *
 * @param {String} method       Specifies the method to execute ( set, clear ).
 * @param {String} mutexName    Specifies the name of the mutex to manipulate.
 * @param {Number} timeOut      Specifies the time to live for the mutex, in seconds. Defaults to 60.
 *
 * @return {Boolean}            Boolean value indicating success or failure. 
 *
 * @author Christian Gribneau
 */

(function( $ ){

  var mutexes = {};

  var mutexLog = false;

  var methods = {

    init : function( options ) { 
      // nothing here
    },
    set : function( mutexName , timeOut ) {
     // check to see if there is a valid flag with this name set already
     timestamp = new Date().getTime();
     if ( typeof mutexes[mutexName]  == 'undefined' || mutexes[mutexName] <  timestamp ) {
         // enforce sane limits on the value of timeOut
         timeOut = typeof timeOut !== 'undefined' ? timeOut : 60;
         timeOut = ( isNaN( timeOut ) || typeof timeOut == 'boolean' ) ? 60 : timeOut;

         // set the flag with a future expiration
        mutexes[mutexName] = new Date().getTime() + ( timeOut * 1000 );
       if (mutexLog) { console.log("set mutex : " + mutexName + " : " + timeOut); };
        return true;
     } else {
       if (mutexLog) { console.log("mutex unavailable : " + mutexName + " : " + mutexes[mutexName]); };
        return false;
     }
    },
    clear : function( mutexName ) { 
      if (mutexLog) { console.log("clear mutex: " + mutexName + " : " + mutexes[mutexName]); };
      mutexes[mutexName] = undefined;
      return true;
    }
  };

  $.fn.mutex = function( method, mutexName, timeOut ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      if (mutexLog) { console.log( 'Method ' +  method + ' does not exist on jQuery.fn.mutex' ); };
      return false;
    }
  
  };

})( jQuery );
