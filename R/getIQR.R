    getIQR <- function(dataset,columnName = "") 
    {
        table <- as.data.frame(dataset)
        
        distribution = eval(parse(text = paste("table","$",columnName)));
        
        list(IQR = IQR(distribution));
    }
