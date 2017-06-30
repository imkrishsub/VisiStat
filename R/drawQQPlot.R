drawQQPlot <- function (distribution) # argument: vector of numbers
{
  # taken from http://stackoverflow.com/a/4357932
  
  # following four lines from base R's qqline()
  y <- quantile(distribution[!is.na(distribution)], c(0.25, 0.75))
  x <- qnorm(c(0.25, 0.75))
  slope <- diff(y)/diff(x)
  int <- y[1L] - slope * x[1L]
  
  d <- data.frame(resids = distribution)
    
  plot = ggplot2::ggplot(d, ggplot2::aes(sample = resids)) + ggplot2::stat_qq() + ggplot2::geom_abline(slope = slope, intercept = int);
  plot
}