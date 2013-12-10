var effectSizeTypes = ["d", "eS", "RS", "r", "𝜏"];

var effectSizeMins = new Object();
    effectSizeMins["d"] = 0;
    effectSizeMins["eS"] = 0;
    effectSizeMins["rS"] = 0;
    effectSizeMins["r"] = -1;
    effectSizeMins["𝜏"] = -1;
    
var effectSizeMaxs = new Object();
    effectSizeMaxs["d"] = 3;
    effectSizeMaxs["eS"] = 1;
    effectSizeMaxs["rS"] = 1;
    effectSizeMaxs["r"] = 1;
    effectSizeMaxs["𝜏"] = 1;
    
var effectSizeInterpretations = new Object();
    effectSizeInterpretations["d"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["eS"] = [0.04, 0.25, 0.64];
    effectSizeInterpretations["rS"] = [0.04, 0.25, 0.64];
    effectSizeInterpretations["r"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["𝜏"] = [0.2, 0.5, 0.8];
    
var effectSizeColors = new Object();
    effectSizeColors["small"] = "PowderBlue";
    effectSizeColors["small-medium"] = "LemonChiffon";
    effectSizeColors["medium-large"] = "Orange";
    effectSizeColors["large"] = "DarkRed";

function getColour(type, value)
{
    var interpretations = effectSizeInterpretations[type];
    
    if(value < interpretations[0])
        return effectSizeColors["small"];
    else if(value >= interpretations[0] && value < interpretations[1])
        return effectSizeColors["small-medium"];
    else if(value >= interpretations[1] && value < interpretations[2])
        return effectSizeColors["medium-large"];
    else if(value >= interpretations[2])
        return effectSizeColors["large"];
}