    getRSquared <- function(dataset = "",columnNameX = "", columnNameY = "")
    {
        if(dataset == "")
        {   
            dataset = "beaver1";
            columnNameX = "time";
            columnNameY = "temp";
        }
        else if(columnNameX == "" || columnNameY == "")
        {
            # Load the first column name by default
            columnNameX = names(eval(parse(text = dataset)))[1]; 
            columnNameY = names(eval(parse(text = dataset)))[2]; 
        }
        
        distributionX = eval(parse(text = paste(dataset,"$",columnNameX)));
        distributionY = eval(parse(text = paste(dataset,"$",columnNameY)));
        
        list(RSquared = summary(lm(distributionX~distributionY))[["r.squared"]], dataset = dataset, columnName1 = columnNameX, columnName2 = columnNameY);
    }
