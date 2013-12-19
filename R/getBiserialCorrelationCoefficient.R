getBiserialCorrelationCoefficient <- function(continuousVariable, binaryVariable)
{
    c <- c(continuousVariable);
    b <- c(binaryVariable);
    
    list(cor = biserial.cor(c, b, use = "complete.obs"));  
}