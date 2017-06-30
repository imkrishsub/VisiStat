loadFile <- function(fileName)
{
    fileName = eval(parse(text = eval(parse(text = paste("data(", fileName, ")", sep="")))));
    
    variableNames = names(fileName);
    
    list(dataset = fileName, variableNames = variableNames);    
}