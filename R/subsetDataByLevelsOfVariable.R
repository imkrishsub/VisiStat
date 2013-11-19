subsetDataByLevelsOfVariable <- function(dataset, variable)
{
    table <- as.data.frame(dataset);
    
    levels = levels(eval(parse(text = paste("table","$",variable))));
    
    for(i in 1:length(levels))
    {
        if(i == 1)
        {
            x = eval(parse(text = paste("c(subset(table, table$",variable," == \"",levels[i],"\"))",sep="")));
        }
        else
        {
            x = eval(parse(text = paste("c(x, subset(table, table$",variable," == \"",levels[i],"\"))",sep="")));
        }
    }
    
    list(splitData = x);
}  
    