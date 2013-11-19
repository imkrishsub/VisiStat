applyTransform <- function(distribution, type)
{        
  distribution <- c(distribution);
  
  switch(type,
  "sqrt" = {
    Distribution = sqrt(distribution);
  },
  "cube" = {
    Distribution = distribution^(1/3);
  },
  "reciprocal" = {
    Distribution = 1/distribution;
  },
  "log" = {
    Distribution = log10(distribution);
  })
  
  list(transformedData = Distribution);
}
  
