performTukeyHSDTestTwoIndependentVariables <- function(dependentVariable, independentVariableA, independentVariableB, dataset)
{
    table <- as.data.frame(dataset);    

    model <- eval(parse(text = paste("aov(",dependentVariable," ~ ",independentVariableA," + ",independentVariableB," + ", independentVariableA,"*",independentVariableB,",data=table)",sep="")));        
    result <- TukeyHSD(model);    
    
    mainEffectForIndependentVariableA = eval(parse(text = paste("result[[\"",independentVariableA,"\"]]",sep="")));
    mainEffectForIndependentVariableB = eval(parse(text = paste("result[[\"",independentVariableB,"\"]]",sep="")));
    interactionEffect = eval(parse(text = paste("result[[\"",independentVariableA,":",independentVariableB,"\"]]",sep="")));
        
    mainEffectForIndependentVariableA = as.data.frame(mainEffectForIndependentVariableA);
    mainEffectForIndependentVariableB = as.data.frame(mainEffectForIndependentVariableB);
    interactionEffect = as.data.frame(interactionEffect);
        
    list(difference = c(mainEffectForIndependentVariableA[["diff"]], mainEffectForIndependentVariableB[["diff"]], interactionEffect[["diff"]]), 
    lower = c(mainEffectForIndependentVariableA[["lwr"]], mainEffectForIndependentVariableB[["lwr"]], interactionEffect[["lwr"]]), 
    upper = c(mainEffectForIndependentVariableA[["upr"]], mainEffectForIndependentVariableB[["upr"]], interactionEffect[["upr"]]), 
    adjustedP = c(mainEffectForIndependentVariableA[["p adj"]], mainEffectForIndependentVariableB[["p adj"]], interactionEffect[["p adj"]]));
}