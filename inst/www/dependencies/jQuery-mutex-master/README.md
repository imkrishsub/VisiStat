jQuery-mutex
============

Purpose
-------

This simple jQuery plugin manages sets of mutexes with
temporal expiration to enable front end developers to
easily avoid unwanted concurrency.

Unwanted concurrency can occur when some event that
triggers an AJAX call occurs more than once before the
first AJAX call has returned. This condition is seen
in infinite scroll implementations from time to time.

Usage
-----

When implementing a feature that should execute
sequentially, set a mutex flag with a specific name
before proceeding:

    $.fn.mutex('set', "inifinite-scroll", 30)

The example above sets the mutex with a time-to-live of 
30 seconds. If a mutex of the same name already exists,
and has not expired, the mutex call will return false.

That call can be wrapped in logic that will gracefully
exit a function if the mutex is not available, thereby 
avoiding duplication:

    if (! $.fn.mutex('set', "inifinite-scroll", 30)
    {
      return true ;
    }

Upon completion of the current instance of the function,
usually in a callback, clear the mutex that was set above:

    $.fn.mutex('clear', "infinite-scroll");

There is an index.html that includes jQuery and the plugin
so it can be tested in the console. When working from the
console, more verbose logging can be enabled in the 
plugin by setting:

    mutexLog = true;

