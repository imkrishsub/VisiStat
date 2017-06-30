toFormulaString <- function(factors)
{
	theString = "";
	
	for(i in 1:length(factors))
	{
		if(length(factors) == 1)
		{
			theString = factors[i];
		}
		else
		{
			if(i == length(factors))
			{
				theString = paste(theString, factors[i], sep="");
			}
			else
			{
				theString = paste(theString, factors[i], " + ", sep="");
			}
		}
	}
	
	return(theString);
}
