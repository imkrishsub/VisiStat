findInteractionEffect <- function(dependentVariable, independentVariables, dataset)
{
    table <- as.data.frame(dataset);
    independentVariables = c(independentVariables);
    
    pretext = paste("lm(",dependentVariable," ~ ",sep=""); 
    
    for(i in 1:length(independentVariables))
    {
        if(i != length(independentVariables))
        {
            pretext = paste(pretext, independentVariables[i], " + ", sep="");
        }
        else
        {
            pretext = paste(pretext, independentVariables[i], sep="");
        }
    }
    
    if(length(independentVariables) == 2)
    {
        pretext = paste(pretext," + ", independentVariables[1], "*", independentVariables[2], ",data = table)",sep="");
    }
    
    model <- eval(parse(text = pretext));
    
    if(length(independentVariables) == 2)
    {
        result <- eval(parse(text = paste("effect(term=\"",independentVariables[1],":",independentVariables[2],"\", model)",sep="")));
    }
    
    list(fit = result$fit);
}