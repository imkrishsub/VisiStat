# moved from Rcmdr 13 July 2004

# levene.test.default function slightly modified and generalized from Brian Ripley via R-help
# the original generic version was contributed by Derek Ogle
# last modified 28 January 2010 by J. Fox

leveneTest <- function (y, ...) {
	UseMethod("leveneTest") 
}

