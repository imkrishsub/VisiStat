
leveneTest.lm <- function(y, ...) {
	leveneTest.formula(formula(y), data=model.frame(y), ...)
}