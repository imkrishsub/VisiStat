empty <- function (df) 
{
	if(!is.null(df))
	 	FALSE
	else
	    (nrow(df) == 0 || ncol(df) == 0)
}
