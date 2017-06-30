// - - - - - - - - - - - - - INFORMATION ABOUT THE EFFECT SIZES USED IN VISISTAT - - - - - - - - - - - - - //

// Current effect sizes in VisiStat: Cohen's d, generalised eta-squared, R squared, Pearson's correlation coefficient 'r', Kendall's correlation coefficient '𝜏'
var effectSizeTypes = ["d", "ηS", "rS", "r", "𝜏"];

var effectSizeMins = new Object();
    effectSizeMins["d"] = 0;
    effectSizeMins["ηS"] = 0;
    effectSizeMins["rS"] = 0;
    effectSizeMins["r"] = -1;
    effectSizeMins["𝜏"] = -1;
    
var effectSizeMaxs = new Object();
    effectSizeMaxs["d"] = 5;
    effectSizeMaxs["ηS"] = 1;
    effectSizeMaxs["rS"] = 1;
    effectSizeMaxs["r"] = 1;
    effectSizeMaxs["𝜏"] = 1;
  
// Interpretation of effect size (small, medium, large) taken from TODO: cite sources    
var effectSizeInterpretations = new Object();
    effectSizeInterpretations["d"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["ηS"] = [0.04, 0.355, 0.64];
    effectSizeInterpretations["rS"] = [0.04, 0.355, 0.64];
    effectSizeInterpretations["r"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["𝜏"] = [0.2, 0.5, 0.8];

// Colors used to indicate the magnitude of effect size    
var effectSizeColors = new Object();
    effectSizeColors["small"] = "#A60000";
    effectSizeColors["small-medium"] = "#FFE500";
    effectSizeColors["medium-large"] = "#39E639";
    effectSizeColors["large"] = "#269926";

// Returns the color for a given effect size value
function getColor(type, value)
{
    var interpretations = effectSizeInterpretations[type];
    
    if(value <= interpretations[0])
        return effectSizeColors["small"];
    else if(value > interpretations[0] && value < interpretations[1])
        return effectSizeColors["small-medium"];
    else if(value >= interpretations[1] && value < interpretations[2])
        return effectSizeColors["medium-large"];
    else if(value >= interpretations[2])
        return effectSizeColors["large"];
}