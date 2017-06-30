function callBackForPerformOneWayANOVA(output)
{
	var variableList = getSelectedVariables();  
	
	multiVariateTestResults["df"] = output.numDF + ", " + output.denomDF;
	multiVariateTestResults["test-type"] = "oneWayANOVA";
	multiVariateTestResults["parameter"] = output.F;
	multiVariateTestResults["parameter-type"] = "F";
	multiVariateTestResults["error"] = output.error;

	multiVariateTestResults["rawP"] = output.p;
	multiVariateTestResults["p"] = changePValueNotation(output.p);   
	multiVariateTestResults["method"] = "One-way ANOVA"; //todo
	multiVariateTestResults["effect-size"] = output.etaSquared;
	multiVariateTestResults["effect-size-type"] = "ηS";
	multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";

	logResult();                           

	//drawing stuff
	removeElementsByClassName("completeLines");           

	displaySignificanceTestResults();                  
	setReportingText(multiVariateTestResults["formula"]);     
	drawPairwisePostHocComparisonsButtonWithHelpText();
}