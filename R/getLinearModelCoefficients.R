getLinearModelCoefficients <- function(outcome, explanatory) 
{       
    outcome <- c(outcome);
    explanatory <- c(explanatory)
    
    model = lm(outcome ~ explanatory);
    results = summary(model);
    coefficients = c(1);
    intercept = 1;
    for(i in 1:length(model$coefficients))
    {   
        if(i == 1)
        {
            intercept = model$coefficients[[i]];
        }
        else
        {
            coefficients = c(coefficients, model$coefficients[[i]]);
        }
    }
    coefficients = coefficients[-1];
    
    list(intercept = intercept, coefficients = coefficients, rSquared = results$r.squared);
}
