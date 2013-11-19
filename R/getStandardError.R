getStandardError <- function(dataset, variableName)
{
    table <- as.data.frame(dataset)
        
    distribution = eval(parse(text = paste("table","$",variableName)));
    
    result <- describe(distribution);
    
    list(se = result[["se"]]);
}