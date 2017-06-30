findConfidenceIntervalOfSD <- function (theSD, n, level=.95)
{
     df <- n - 1
     chiL <- qchisq((1 + level)/2, df)
     chiR <- qchisq((1 - level)/2, df)
     ciLower <- sqrt(((n - 1) * (theSD ^ 2)) / chiL)
     ciUpper <- sqrt(((n - 1) * (theSD ^ 2)) / chiR)
     return (c(ciLower, ciUpper))
}