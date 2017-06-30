lmer <- function (formula, data = NULL, REML = TRUE, control = lmerControl(), 
    start = NULL, verbose = 0L, subset, weights, na.action, offset, 
    contrasts = NULL, devFunOnly = FALSE, ...) 
{
    mc <- match.call()
    mc[[1]] <- quote(lme4::lmer)
    model <- eval.parent(mc)
    if (inherits(model, "merMod")) 
        model <- as(model, "merModLmerTest")
    return(model)
}