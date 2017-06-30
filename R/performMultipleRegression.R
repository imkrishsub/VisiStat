performMultipleRegression <- function(outcomeVariable, explanatoryVariables, dataset)
{
    table <- as.data.frame(dataset)
    
    explanatoryVariables = c(explanatoryVariables);
    print(explanatoryVariables);
    
    pretext = paste("lm(",outcomeVariable,"~",sep="");
    
    for(i in 1:length(explanatoryVariables))
    {
        if(i != length(explanatoryVariables))
        {
            pretext = paste(pretext,explanatoryVariables[i]," + ",sep="");
        }
        else
        {
            pretext = paste(pretext,explanatoryVariables[i],sep="");
        }
    }
    
    pretext = paste(pretext,", data=table)",sep="");
    
    model <- eval(parse(text = pretext));
    
    results <- summary(model);
    
    intercept <- model$coefficients[["(Intercept)"]];
    
    pretext = paste("c(",sep="");
    
    for(i in 1:length(explanatoryVariables))
    {
        if(i != length(explanatoryVariables))
        {
            pretext = paste(pretext, model$coefficients[[i+1]],",",sep="");
        }
        else
        {
            pretext = paste(pretext, model$coefficients[[i+1]],")",sep="");
        }
    }
    coefficients = eval(parse(text = pretext));
    
    list(intercept = intercept, coefficients = coefficients, rSquared = results$r.squared, len = length(explanatoryVariables));
}