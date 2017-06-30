getCombinations <- function(items)
{
	combinationList = c();
	nItems = length(items);
	
	# for each combination level
	for(i in 1:nItems)
	{
		combinations = combn(items, i); #get all combinations (in matrix)
		
		# ===== construct statement manually ==== 
		
		statement = "listOfCombinations = list("; 
		
		for(n in 1:ncol(combinations)) # for each column
		{
			if(n < ncol(combinations))
				statement = paste(statement, "combinations[,", n, "],", sep="")
			else
				statement = paste(statement, "combinations[,", n, "]", sep="")
		}
				
		statement = paste(statement, ")", sep="");
		
		eval(parse(text = statement)); # evaluate the statement to get the list of required elements
		
		for(n in 1:length(listOfCombinations))
		{
			S = "";			
			
			for(c in 1:length(listOfCombinations[[n]]))
			{				
				if(length(listOfCombinations[[n]]) == 1)
				{
					S = paste(S, listOfCombinations[[n]][[c]], sep=""); # append variable name
				}
				else
				{
					if(c == length(listOfCombinations[[n]]))
					{
						S = paste(S, listOfCombinations[[n]][[c]], sep=""); # append variable name
					}
					else
					{
						S = paste(S, listOfCombinations[[n]][[c]], ":", sep=""); # append variable name
					}										
				}				
			}
						
			combinationList = c(combinationList, S);
			rm(S);
		}
	}	
	
	return(combinationList);
}