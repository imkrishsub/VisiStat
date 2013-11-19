getCorrelationCoefficient <- function(distributionX, distributionY, method = "pearson") 
{
    X = c(distributionX);
    Y = c(distributionY);
    
    if(method == "")
    {
        method = "pearson";
    }
    
    result = cor.test(X, Y, method = method);
    
    if(method == "kendall")
    {
        list(statistic = result$statistic[["z"]], p = result$p.value, cor = result$estimate[["tau"]], method = result$method);
    }
    else
    {
        list(statistic = result$statistic[["t"]], df = result$parameter[["df"]], p = result$p.value, cor = result$estimate[["cor"]], method = result$method, CI_min = result$conf.int[1], CI_max = result$conf.int[2]);
    }
}
