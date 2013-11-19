//dataset information

//Preprocessing
var datasetInformation = new Object();
    datasetInformation["impact"] = "Dataset comparing the verbal, spatial, and other such abilities of athletes in two groups - control and concussed";
    datasetInformation["cars"] = "Dataset with details about different cars";
    datasetInformation["weightLoss"] = "Dataset comparing the weight lost by participants in 3 groups: those who skipped breakfast, those who skipped lunch, and those who skipped dinner";
    datasetInformation["store"] = "TBD";
    datasetInformation["SAT"] = "When deciding whether to admit an applicant, colleges take lots of factors, such as grades, sports, activities, leadership positions, awards, teacher recommendations, and test scores, into consideration. Using SAT scores as a basis of whether to admit a student or not has created some controversy. Among other things, people question whether the SATs are fair and whether they predict college performance. This study examines the SAT and GPA information of 105 students who graduated from a state university with a B.S. in computer science. Using the grades and test scores from high school, can you predict a student's college grades?";
    datasetInformation["hotdogs"] = "Results of a laboratory analysis of calories and sodium content of major hot dog brands. Researchers for Consumer Reports analyzed three types of hot dog: beef, poultry, and meat (mostly pork and beef, but up to 15% poultry meat).";

var variablesInDataset = new Object();
    variablesInDataset["impact"] = ["subject","condition","verbalMemoryPre","visualMemoryPre","visualMotorSpeedPre","reactionTimePre","impulseControlPre","totalSymptomPre","verbalMemoryPost","visualMemoryPost","visualMotorSpeedPost","reactionTimePost","impulseConstrolPost","totalSymptomPost"]
    variablesInDataset["cars"] = ["Car","MPG","Cylinders","Displacement","Horsepower","Weight","Acceleration","Model","Origin"];
    variablesInDataset["weightLoss"] = ["participantID", "ageGroup", "condition", "weightLost"];
    variablesInDataset["store"] = ["ID", "price", "store", "subject"];
    variablesInDataset["SAT"] = ["participantID", "high_GPA", "math_SAT", "verb_SAT", "comp_GPA", "univ_GPA"];
    variablesInDataset["hotdogs"] = ["Type", "Calories", "Sodium"];
 
var types = ["participant", "dependent", "independent"];
var variablesInDatasetType = new Object();

var dataTypes = ["nominal", "ordinal", "interval", "ratio"];
var variablesInDatasetDataType = new Object();
    variablesInDatasetDataType["impact"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetDataType["cars"] = [dataTypes[0], dataTypes[3], dataTypes[1], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetDataType["weightLoss"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3]];
    variablesInDatasetDataType["store"] = [dataTypes[0], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetDataType["SAT"] = [dataTypes[0], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2]];
    variablesInDatasetDataType["hotdogs"] = [dataTypes[0], dataTypes[2], dataTypes[2]];
    
function initVariablesInDatasetTypes()
{  
    variablesInDatasetType["impact"] = [types[0], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetType["cars"] = [types[0], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[2]];
    variablesInDatasetType["weightLoss"] = [types[0], types[2], types[2], types[1]];
    variablesInDatasetType["store"] = [types[1], types[1], types[2], types[0]];    
    variablesInDatasetType["SAT"] = [types[0], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetType["hotdogs"] = [types[2], types[1], types[1]];
}