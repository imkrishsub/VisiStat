performOneWayRepeatedMeasuresANOVA <- function(dependentVariable, independentVariable, participantVariable, dataset)
{   
    table <- as.data.frame(dataset);
    isNumeric = FALSE;
    
    levels = eval(parse(text = paste("unique(table$", independentVariable, ")", sep="")))   
    
    if(!is.nan(levels[1]))
    {
      isNumeric = TRUE;
    } 
    
    for(i in 1:length(levels))
    {
        if(i == 1)
        {
            distributions = c(list(eval(parse(text = paste("(subset(table, ", independentVariable, " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
        }
        else
        {
            distributions = c(distributions, list(eval(parse(text = paste("(subset(table, ", independentVariable, " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
        }
    }
    
    result = findError(distributions);
    error = result$error;
    
    result <- eval(parse(text = paste("ez::ezANOVA(table,",dependentVariable,",",participantVariable,",within=",independentVariable,")",sep="")));
    
    # Check for sphericity of distributions
    pIsCorrected = FALSE
    
    if(isNumeric)
    {
      sphericityTestP = 1.0;
      p = result[[1]][[5]]
      pIsCorrected = FALSE
      numDF = result[[1]][[2]]
      denomDF = result[[1]][[3]]      
    }
    else
    {
      sphericityTestP = result[[2]][[3]]
      
      if(sphericityTestP < 0.05) # Assumption is violated
      { 
        # Get epsilon of Greenhouse-Geisser
        epsilon_GG = result[[3]][[2]]
        p = result[[3]][[6]]
        pIsCorrected = TRUE
        
        if(epsilon_GG > 0.75) # If greater than 0.75, use Huynh-Feldt correction instead (this is because Greenhouse-Geisser is too conservative)
          epsilon_correction = result[[3]][[5]]
        else
          epsilon_correction = epsilon_GG
        
        # Now we need to correct the DFs
        
        numDF = result[[1]][[2]]*epsilon_correction
        denomDF = result[[1]][[3]]*epsilon_correction   
      }
      else
      {      
        numDF = result[[1]][[2]]
        denomDF = result[[1]][[3]]
        p = result[[1]][[5]]
      }
    }   
    
    list(numDF = numDF, denomDF = denomDF, F = result[[1]][[4]], p = p, etaSquared = result[[1]][[7]], error = error, pIsCorrected = pIsCorrected);    
}