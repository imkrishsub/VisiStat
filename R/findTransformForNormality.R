findTransformForNormality <- function(DV, IVs, dataset)
{
    D <- as.data.frame(dataset);
    
    eval(parse(text = paste("D$",IVs," = ","as.factor(D$",IVs,")",sep="")));
    
    levels = eval(parse(text = paste("unique(D$",IVs,")")));
    numberOfLevels = eval(parse(text = paste("length(unique(D$",IVs,"))")));
    
    transformations = c("sqrt", "cube", "reciprocal", "log");
    
    for(i in 1:numberOfLevels)
    {
        eval(parse(text = paste("level.",levels[i]," = subset(D, D$",IVs," == \"",levels[i],"\")",sep="")));
        eval(parse(text = paste("level.",levels[i]," = ","level.",levels[i],"$",DV,sep="")))
    }
    
    type = "none";
    
    for(i in 1:length(transformations))
    {
    	if(transformations[i] == "sqrt")
    	{	
    		for(k in 1:numberOfLevels)
    		{
    			temp = eval(parse(text = paste("sqrt(level.",levels[k],")",sep="")));
    			
    			if(length(unique(temp)) != 1)
    			{
                    result <- shapiro.test(temp);
                    if(!is.nan(result$p.value))    
                    {
                        if(result$p.value > 0.05)
                        {
                            type = "sqrt";
                        }
                        else
                        {
                            type = "none";
                            break;
                        }
                    }
                }
    		}
    		
    		if(type!="none")
    		    break;
    	}
    	if(transformations[i] == "cube")
    	{	
    		for(k in 1:numberOfLevels)
    		{
    			temp = eval(parse(text = paste("level.",levels[k],"^(1/3)",sep="")));
    			if(length(unique(temp)) != 1)
    			{
                    result <- shapiro.test(temp);
                    if(!is.nan(result$p.value))    
                    {
                        if(result$p.value > 0.05)
                        {
                            type = "cube";
                        }
                        else
                        {
                            type = "none";
                            break;
                        }
                    }
                }
    		}
    		if(type!="none")
    		    break;
    	}
    	if(transformations[i] == "reciprocal")
    	{
    		for(k in 1:numberOfLevels)
    		{
    			temp = eval(parse(text = paste("1/level.",levels[k],sep="")));
    			
    			if(length(unique(temp)) != 1)
    			{
                    result <- shapiro.test(temp);
                    if(!is.nan(result$p.value))    
                    {
                        if(result$p.value > 0.05)
                        {
                            type = "reciprocal";
                        }
                        else
                        {
                            type = "none";
                            break;
                        }
                    }
                }
    		}
    		if(type!="none")
    		    break;
    	}
    	if(transformations[i] == "log")
    	{
    		for(k in 1:numberOfLevels)
    		{
    			temp = eval(parse(text = paste("log10(level.",levels[k],")",sep="")));
    			
    			if(length(unique(temp)) != 1)
    			{
                    result <- shapiro.test(temp);
                    if(!is.nan(result$p.value))    
                    {
                        if(result$p.value > 0.05)
                        {
                            type = "log";
                        }
                        else
                        {
                            type = "none";
                            break;
                        }
                    }
                }
    		}
    		if(type!="none")
    		    break;
    	}
    }
    
    list(type = type);
}