performTukeyHSDTest <- function(dataset, dependentVariable, independentVariable)
{
    table <- as.data.frame(dataset);    
    
    model <- eval(parse(text = paste("aov(",dependentVariable," ~ ",independentVariable,", data=table)",sep="")));
        
    result <- TukeyHSD(model);
        
    mainEffect = eval(parse(text = paste("result[[\"",independentVariable,"\"]]",sep="")));
        
    mainEffect = as.data.frame(mainEffect);
        
    list(difference = mainEffect[["diff"]], lower = mainEffect[["lwr"]], upper = mainEffect[["upr"]], adjustedP = mainEffect[["p adj"]]);
}