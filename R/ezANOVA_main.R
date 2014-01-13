ezANOVA_main <- function (data, dv, wid, within, within_full, within_covariates, 
    between, between_covariates, observed, diff, reverse_diff, 
    type, return_aov, white.adjust) 
{
    vars = as.character(c(dv, wid, between, within, diff, within_full))
    for (var in vars) {
        if (!(var %in% names(data))) {
            stop(paste("\"", var, "\" is not a variable in the data frame provided.", 
                sep = ""))
        }
    }
    if (is.null(within) & is.null(between)) {
        stop("is.null(within) & is.null(between)\nYou must specify at least one independent variable.")
    }
    if (!is.data.frame(data)) {
        stop("\"data\" must be a data frame.")
    }
    if (!is.numeric(data[, names(data) == dv])) {
        stop("\"dv\" must be numeric.")
    }
    if (!is.factor(data[, names(data) == wid])) {
        warning(paste("Converting \"", wid, "\" to factor for ANOVA.", 
            sep = ""), immediate. = TRUE, call. = FALSE)
        data[, names(data) == wid] = factor(data[, names(data) == 
            wid])
    }
    else {
        if (length(unique(data[, names(data) == wid])) != length(levels(data[, 
            names(data) == wid]))) {
            warning(paste("You have removed one or more Ss from the analysis. Refactoring \"", 
                wid, "\" for ANOVA.", sep = ""), immediate. = TRUE, 
                call. = FALSE)
            data[, names(data) == wid] = factor(data[, names(data) == 
                wid])
        }
    }
    within_numeric = rep(FALSE, length(within))
    if (!is.null(within)) {
        for (i in 1:length(within)) {
            if (is.numeric(data[, names(data) == within[i]])) {
                warning(paste("\"", within[i], "\" will be treated as numeric.", 
                  sep = ""), immediate. = TRUE, call. = FALSE)
                within_numeric[i] = TRUE
            }
            else {
                if (!is.factor(data[, names(data) == within[i]])) {
                  warning(paste("Converting \"", within[i], "\" to factor for ANOVA.", 
                    sep = ""), immediate. = TRUE, call. = FALSE)
                  data[, names(data) == within[i]] = factor(data[, 
                    names(data) == within[i]])
                }
                if (length(unique(data[, names(data) == within[i]])) != 
                  length(levels(data[, names(data) == within[i]]))) {
                  warning(paste("You have removed one or more levels from variable \"", 
                    within[i], "\". Refactoring for ANOVA.", 
                    sep = ""), immediate. = TRUE, call. = FALSE)
                  data[, names(data) == within[i]] = factor(data[, 
                    names(data) == within[i]])
                }
                if (length(levels(data[, names(data) == within[i]])) == 
                  1) {
                  stop(paste("\"", within[i], "\" has only one level.\"", 
                    sep = ""))
                }
            }
        }
    }
    between_numeric = rep(FALSE, length(between))
    if (!is.null(between)) {
        for (i in 1:length(between)) {
            if (is.numeric(data[, names(data) == between[i]])) {
                warning(paste("\"", between[i], "\" will be treated as numeric.", 
                  sep = ""), immediate. = TRUE, call. = FALSE)
                between_numeric[i] = TRUE
            }
            else {
                if (!is.factor(data[, names(data) == between[i]])) {
                  warning(paste("Converting \"", between[i], 
                    "\" to factor for ANOVA.", sep = ""), immediate. = TRUE, 
                    call. = FALSE)
                  data[, names(data) == between[i]] = factor(data[, 
                    names(data) == between[i]])
                }
                if (length(unique(data[, names(data) == between[i]])) != 
                  length(levels(data[, names(data) == between[i]]))) {
                  warning(paste("You have removed one or more levels from variable \"", 
                    between[i], "\". Refactoring for ANOVA.", 
                    sep = ""), immediate. = TRUE, call. = FALSE)
                  data[, names(data) == between[i]] = factor(data[, 
                    names(data) == between[i]])
                }
                if (length(levels(data[, names(data) == between[i]])) == 
                  1) {
                  stop(paste("\"", between[i], "\" has only one level.\"", 
                    sep = ""))
                }
            }
        }
        temp = ddply(idata.frame(data), structure(as.list(c(wid, 
            between)), class = "quoted"), function(x) {
            to_return = 0
            return(to_return)
        })
        wid_temp = data.frame(table(temp[, names(temp) == wid]))
        if (any(wid_temp$Freq > 1)) {
            warning(paste("The column supplied as the wid variable contains non-unique values across levels of the supplied between-Ss variables. Automatically fixing this by generating unique wid labels.", 
                sep = ""), immediate. = TRUE, call. = FALSE)
            data[, names(data) == wid] = as.character(data[, 
                names(data) == wid])
            for (i in unique(as.character(between))) {
                data[, names(data) == wid] = paste(data[, names(data) == 
                  wid], data[, names(data) == i])
            }
            data[, names(data) == wid] = factor(data[, names(data) == 
                wid])
            temp = ddply(idata.frame(data), structure(as.list(c(wid, 
                between)), class = "quoted"), function(x) {
                to_return = 0
                return(to_return)
            })
        }
        temp = ddply(temp, structure(as.list(c(between)), class = "quoted"), 
            function(x) {
                to_return = data.frame(N = nrow(x))
                return(to_return)
            })
        balanced = ifelse(length(unique(temp$N)) > 1, FALSE, 
            TRUE)
        if (!balanced) {
            warning("Data is unbalanced (unequal N per group). Make sure you specified a well-considered value for the type argument to ezANOVA().", 
                immediate. = TRUE, call. = FALSE)
        }
    }
    if (!is.null(diff)) {
        if (length(diff) > 1) {
            stop(paste("Provide only one value to \"diff\".", 
                sep = ""))
        }
        if (!is.factor(data[, names(data) == diff])) {
            warning(paste("Converting \"", diff, "\" to factor for computing difference score.", 
                sep = ""), immediate. = TRUE, call. = FALSE)
            data[, names(data) == diff] = factor(data[, names(data) == 
                diff])
        }
        temp <- ddply(idata.frame(data), structure(as.list(c(wid, 
            diff)), class = "quoted"), function(x) {
            to_return = 0
            return(to_return)
        })
        if (!all(as.data.frame(table(temp[, names(temp) %in% 
            c(wid, within)]))$Freq == 2)) {
            stop(paste("Variable supplied to \"diff\" (\"", as.character(diff), 
                "\") does not appear to be a within variable.", 
                sep = ""))
        }
        data[, names(data) == as.character(diff)] = factor(data[, 
            names(data) == as.character(diff)])
        if (length(unique(data[, names(data) == as.character(diff)])) != 
            2) {
            stop("The column passed as argument \"diff\" must have precisely 2 levels.")
        }
        if (reverse_diff) {
            data[, names(data) == as.character(diff)] = factor(data[, 
                names(data) == as.character(diff)], levels = rev(levels(data[, 
                names(data) == as.character(diff)])))
        }
    }
    if ((!is.null(between_covariates)) | (!is.null(within_covariates))) {
        warning("Implementation of ANCOVA in this version of ez is experimental and not yet fully validated. Also, note that ANCOVA is intended purely as a tool to increase statistical power; ANCOVA can not eliminate confounds in the data. Specifically, covariates should: (1) be uncorrelated with other predictors and (2) should have effects on the DV that are independent of other predictors. Failure to meet these conditions may dramatically increase the rate of false-positives.", 
            immediate. = TRUE, call. = FALSE)
    }
    if (!is.null(between_covariates)) {
        temp = idata.frame(cbind(data, ezDV = data[, names(data) == 
            as.character(dv)]))
        temp <- ddply(temp, structure(as.list(c(wid, between_covariates, 
            within, within_full, diff)), class = "quoted"), function(x) {
            to_return = mean(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
        temp = idata.frame(cbind(temp, ezDV = temp[, names(temp) == 
            as.character(dv)]))
        temp <- ddply(temp, structure(as.list(c(wid, between_covariates)), 
            class = "quoted"), function(x) {
            to_return = mean(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
        for (cov in between_covariates) {
            temp$ezCov = temp[, names(temp) == cov]
            if (is.factor(temp$ezCov)) {
                contrasts(temp$ezCov) = "contr.helmert"
            }
            else {
                temp$ezCov = temp$ezCov - mean(temp$ezCov)
                warning("Covariate\"", cov, "\" is numeric and will therefore be fit to a linear effect.", 
                  immediate. = TRUE, call. = FALSE)
            }
            fit = eval(parse(text = paste("lm(formula=", dv, 
                "~ezCov,data=temp)")))
            temp$fitted = fitted(fit)
            for (cov_lev in as.character(unique(temp[, names(temp) == 
                cov]))) {
                data[as.character(data[, names(data) == cov]) == 
                  cov_lev, names(data) == dv] = data[as.character(data[, 
                  names(data) == cov]) == cov_lev, names(data) == 
                  dv] - temp$fitted[as.character(temp[, names(temp) == 
                  cov]) == cov_lev][1] + as.numeric(coef(fit)[1])
            }
        }
    }
    if (!is.null(within_covariates)) {
        temp = idata.frame(cbind(data, ezDV = data[, names(data) == 
            as.character(dv)]))
        temp <- ddply(temp, structure(as.list(c(wid, within_covariates, 
            within, within_full, diff)), class = "quoted"), function(x) {
            to_return = mean(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
        for (cov in as.character(within_covariates)) {
            temp2 <- ddply(.data = temp, .variables = eval(parse(text = paste("dot(", 
                wid, ",", cov, ")"))), .fun = function(x) {
                to_return = data.frame(value = mean(x[, names(x) == 
                  dv]))
                names(to_return) = as.character(dv)
                return(to_return)
            })
            if (is.numeric(temp2[, names(temp2) == cov])) {
                warning("Covariate\"", cov, "\" is numeric and will therefore be fit to a linear effect.", 
                  immediate. = TRUE, call. = FALSE)
            }
            for (this_wid in unique(as.character(data[, names(data) == 
                wid]))) {
                temp3 = temp2[temp2[, names(temp2) == wid] == 
                  this_wid, ]
                temp3$ezCov = temp3[, names(temp3) == cov]
                if (is.factor(temp3$ezCov)) {
                  contrasts(temp3$ezCov) = "contr.helmert"
                }
                else {
                  temp3$ezCov = temp3$ezCov - mean(temp3$ezCov)
                }
                fit = eval(parse(text = paste("lm(formula=", 
                  dv, "~ezCov,data=temp3)")))
                temp3$fitted = fitted(fit)
                for (cov_lev in unique(as.character(temp3[, names(temp3) == 
                  cov]))) {
                  data[(as.character(data[, names(data) == cov]) == 
                    cov_lev) & (data[, names(data) == wid] == 
                    this_wid), names(data) == dv] = data[(as.character(data[, 
                    names(data) == cov]) == cov_lev) & (data[, 
                    names(data) == wid] == this_wid), names(data) == 
                    dv] - temp3$fitted[as.character(temp3[, names(temp3) == 
                    cov]) == cov_lev][1] + as.numeric(coef(fit)[1])
                }
            }
        }
    }
    if (!is.null(within_full)) {
        warning(paste("Collapsing data to cell means first using variables supplied to \"within_full\", then collapsing the resulting means to means for the cells supplied to \"within\".", 
            sep = ""), immediate. = TRUE, call. = FALSE)
        temp = idata.frame(cbind(data, ezDV = data[, names(data) == 
            as.character(dv)]))
        data <- ddply(temp, structure(as.list(c(wid, between, 
            within, within_full, diff)), class = "quoted"), function(x) {
            to_return = mean(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
        temp = idata.frame(cbind(data, ezDV = data[, names(data) == 
            as.character(dv)]))
        data <- ddply(temp, structure(as.list(c(wid, between, 
            within, diff)), class = "quoted"), function(x) {
            to_return = mean(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
    }
    else {
        data <- ddply(data, structure(as.list(c(wid, between, 
            within, diff)), class = "quoted"), function(x) {
            to_return = data.frame(temp = mean(x[, names(x) == 
                as.character(dv)]), ezNum = nrow(x))
            names(to_return)[1] = as.character(dv)
            return(to_return)
        })
        if (any(data$ezNum > 1)) {
            warning(paste("Collapsing data to cell means. *IF* the requested effects are a subset of the full design, you must use the \"within_full\" argument, else results may be inaccurate.", 
                sep = ""), immediate. = TRUE, call. = FALSE)
        }
    }
    if (any(is.na(data[, names(data) == as.character(dv)]))) {
        stop("One or more cells returned NA when aggregated to a mean. Check your data.")
    }
    if (is.null(diff)) {
        if (!all(as.data.frame(table(data[, names(data) %in% 
            c(wid, within)]))$Freq == 1)) {
            stop("One or more cells is missing data. Try using ezDesign() to check your data.")
        }
    }
    else {
        if (!all(as.data.frame(table(data[, names(data) %in% 
            c(wid, within, diff)]))$Freq == 1)) {
            stop("One or more cells is missing data. Try using ezDesign() to check your data.")
        }
    }
    if (!is.null(between)) {
        if (any(as.data.frame(table(data[, names(data) %in% c(between)]))$Freq == 
            0)) {
            stop("One or more cells is missing data. Try using ezDesign() to check your data.")
        }
    }
    if (!is.null(diff)) {
        warning(paste("Collapsing \"", as.character(diff), "\" to a difference score (\"", 
            levels(data[, names(data) == as.character(diff)])[2], 
            "\"-\"", levels(data[, names(data) == as.character(diff)])[1], 
            "\") prior to computing statistics.", sep = ""), 
            immediate. = TRUE, call. = FALSE)
        temp = idata.frame(cbind(data, ezDV = data[, names(data) == 
            as.character(dv)]))
        data <- ddply(temp, structure(as.list(c(wid, within, 
            between)), class = "quoted"), function(x) {
            to_return = diff(x$ezDV)
            names(to_return) = as.character(dv)
            return(to_return)
        })
        temp = names(within)
        temp = temp[!(within %in% diff)]
        within = within[!(within %in% diff)]
        names(within) = temp
    }
    to_return = list()
    if (is.null(between)) {
        if (any(within_numeric)) {
            warning("There is at least one numeric within variable, therefore aov() will be used for computation and no assumption checks will be obtained.", 
                immediate. = TRUE, call. = FALSE)
            from_aov = ezANOVA_aov(data, dv, wid, within, between)
            to_return$ANOVA = from_aov$ANOVA
            if (return_aov) {
                to_return$aov = from_aov$aov
            }
        }
        else {
            if (type != 1) {
                wide_lm = ezANOVA_get_wide_lm(data, dv, wid, 
                  within, between)
                to_return = NULL
                try(to_return <- ezANOVA_summary(Anova(wide_lm$lm, 
                  idata = wide_lm$idata, type = 3, idesign = eval(parse(text = wide_lm$idesign_formula)))))
                if (is.null(to_return)) {
                  stop("The car::Anova() function used to compute results and assumption tests seems to have failed. Most commonly this is because you have too few subjects relative to the number of cells in the within-Ss design. It is possible that trying the ANOVA again with \"type=1\" may yield results (but definitely no assumption tests).")
                }
                if (return_aov) {
                  from_aov = ezANOVA_aov(data, dv, wid, within, 
                    between)
                  to_return$aov = from_aov$aov
                }
            }
            else {
                from_aov = ezANOVA_aov(data, dv, wid, within, 
                  between)
                to_return$ANOVA = from_aov$ANOVA
                if (return_aov) {
                  to_return$aov = from_aov$aov
                }
            }
        }
    }
    else {
        if (balanced) {
            if (is.null(within)) {
                wide_lm = ezANOVA_get_wide_lm(data, dv, wid, 
                  within, between)
                from_Anova = Anova(wide_lm$lm, type = type, white.adjust = white.adjust)
                to_return$ANOVA = ezANOVA_between_summary(from_Anova, 
                  white.adjust, between_numeric)
                if (!any(between_numeric)) {
                  to_return$"Levene's Test for Homogeneity of Variance" = ezANOVA_levene(wide_lm$lm)
                }
                else {
                  warning("At least one numeric between-Ss variable detected, therefore no assumption test will be returned.", 
                    immediate. = TRUE, call. = FALSE)
                }
                if (return_aov) {
                  from_aov = ezANOVA_aov(data, dv, wid, within, 
                    between)
                  to_return$aov = from_aov$aov
                }
            }
            else {
                if (any(within_numeric)) {
                  warning("There is at least one numeric within variable, therefore aov() will be used for computation and no assumption checks will be obtained.", 
                    immediate. = TRUE, call. = FALSE)
                  from_aov = ezANOVA_aov(data, dv, wid, within, 
                    between)
                  to_return$ANOVA = from_aov$ANOVA
                  if (return_aov) {
                    to_return$aov = from_aov$aov
                  }
                }
                else {
                  if (type != 1) {
                    wide_lm = ezANOVA_get_wide_lm(data, dv, wid, 
                      within, between)
                    to_return = NULL
                    try(to_return <- ezANOVA_summary(Anova(wide_lm$lm, 
                      idata = wide_lm$idata, type = type, idesign = eval(parse(text = wide_lm$idesign_formula)))))
                    if (is.null(to_return)) {
                      stop("The car::Anova() function used to compute results and assumption tests seems to have failed. Most commonly this is because you have too few subjects relative to the number of cells in the within-Ss design. It is possible that trying the ANOVA again with \"type=1\" may yield results (but definitely no assumption tests).")
                    }
                    if (return_aov) {
                      from_aov = ezANOVA_aov(data, dv, wid, within, 
                        between)
                      to_return$aov = from_aov$aov
                    }
                  }
                  else {
                    from_aov = ezANOVA_aov(data, dv, wid, within, 
                      between)
                    to_return$ANOVA = from_aov$ANOVA
                    if (return_aov) {
                      to_return$aov = from_aov$aov
                    }
                  }
                }
            }
        }
        else {
            if (type == 1) {
                if ((length(between) > 1) | (!is.null(within))) {
                  warning("Using \"type==1\" is highly questionable when data are unbalanced and there is more than one variable. Hopefully you are doing this for demonstration purposes only!", 
                    immediate. = TRUE, call. = FALSE)
                }
                from_aov = ezANOVA_aov(data, dv, wid, within, 
                  between)
                to_return$ANOVA = from_aov$ANOVA
                if (return_aov) {
                  to_return$aov = from_aov$aov
                }
            }
            else {
                if (is.null(within)) {
                  wide_lm = ezANOVA_get_wide_lm(data, dv, wid, 
                    within, between)
                  from_Anova = Anova(wide_lm$lm, type = type, 
                    white.adjust = white.adjust)
                  to_return$ANOVA = ezANOVA_between_summary(from_Anova, 
                    white.adjust, between_numeric)
                  if (!any(between_numeric)) {
                    to_return$"Levene's Test for Homogeneity of Variance" = ezANOVA_levene(wide_lm$lm)
                  }
                  else {
                    warning("At least one numeric between-Ss variable detected, therefore no assumption test will be returned.", 
                      immediate. = TRUE, call. = FALSE)
                  }
                  if (return_aov) {
                    from_aov = ezANOVA_aov(data, dv, wid, within, 
                      between)
                    to_return$aov = from_aov$aov
                  }
                }
                else {
                  if (any(within_numeric)) {
                    stop("Cannot perform ANOVA when data are imbalanced and when one or more within-Ss variables are numeric. Try ezMixed() instead.")
                  }
                  wide_lm = ezANOVA_get_wide_lm(data, dv, wid, 
                    within, between)
                  to_return = NULL
                  try(to_return <- ezANOVA_summary(Anova(wide_lm$lm, 
                    idata = wide_lm$idata, type = type, idesign = eval(parse(text = wide_lm$idesign_formula)))))
                  if (is.null(to_return)) {
                    stop("The car::Anova() function used to compute results and assumption tests seems to have failed. Most commonly this is because you have too few subjects relative to the number of cells in the within-Ss design. It is possible that trying the ANOVA again with \"type=1\" may yield results (but definitely no assumption tests).")
                  }
                  if (return_aov) {
                    from_aov = ezANOVA_aov(data, dv, wid, within, 
                      between)
                    to_return$aov = from_aov$aov
                  }
                }
            }
        }
    }
    to_return$ANOVA = to_return$ANOVA[order(str_count(to_return$ANOVA$Effect, 
        ":")), ]
    to_return$data = data
    return(to_return)
}
