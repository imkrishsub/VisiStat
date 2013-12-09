//dataset information

//Preprocessing
var datasetInformation = new Object();
    datasetInformation["impact"] = "Dataset comparing the verbal, spatial, and other such abilities of athletes in two groups - control and concussed";
    datasetInformation["cars"] = "Dataset with details about different cars";
    datasetInformation["weightLoss"] = "Dataset comparing the weight lost by participants in 3 groups: those who skipped breakfast, those who skipped lunch, and those who skipped dinner";
    datasetInformation["store"] = "TBD";
    datasetInformation["SAT"] = "When deciding whether to admit an applicant, colleges take lots of factors, such as grades, sports, activities, leadership positions, awards, teacher recommendations, and test scores, into consideration. Using SAT scores as a basis of whether to admit a student or not has created some controversy. Among other things, people question whether the SATs are fair and whether they predict college performance. This study examines the SAT and GPA information of 105 students who graduated from a state university with a B.S. in computer science. Using the grades and test scores from high school, can you predict a student's college grades?";
    datasetInformation["hotdogs"] = "Results of a laboratory analysis of calories and sodium content of major hot dog brands. Researchers for Consumer Reports analyzed three types of hot dog: beef, poultry, and meat (mostly pork and beef, but up to 15% poultry meat).";
    datasetInformation["bankloan"] = "TBD";
    datasetInformation["car_sales"] = "TBD";
    datasetInformation["hp"] = "TBD";
    datasetInformation["keyboards"] = "TBD";
    datasetInformation["foodEffect"] = "TBD";
    datasetInformation["weight_loss"] = "TBD";
    datasetInformation["phoneEffect"] = "TBD";

var variablesInDataset = new Object();
    variablesInDataset["impact"] = ["subject","condition","verbalMemoryPre","visualMemoryPre","visualMotorSpeedPre","reactionTimePre","impulseControlPre","totalSymptomPre","verbalMemoryPost","visualMemoryPost","visualMotorSpeedPost","reactionTimePost","impulseConstrolPost","totalSymptomPost"]
    variablesInDataset["cars"] = ["Car","MPG","Cylinders","Displacement","Horsepower","Weight","Acceleration","Model","Origin"];
    variablesInDataset["weightLoss"] = ["participantID", "ageGroup", "condition", "weightLost"];
    variablesInDataset["store"] = ["ID", "price", "store", "subject"];
    variablesInDataset["SAT"] = ["participantID", "high_GPA", "math_SAT", "verb_SAT", "comp_GPA", "univ_GPA"];
    variablesInDataset["hotdogs"] = ["Type", "Calories", "Sodium"];
    variablesInDataset["bankloan"] = ["age", "ed", "employ", "address", "debtinc", "creddebt", "otherdebt", "preddef1", "preddef2", "preddef3"];
    variablesInDataset["car_sales"] = ["manufact", "model", "sales", "resale", "type", "price", "engine_s", "horsepow", "wheelbas", "width", "length", "curb_wgt", "fuel_cap", "mpg"];
    variablesInDataset["hp"] = ["name", "house", "pet"];
    variablesInDataset["keyboards"] = ["participantID", "keyboardLayout", "gender", "typingSpeed", "errors", "userSatisfaction"];
    variablesInDataset["foodEffect"] = ["participantID","foodEaten","gender","score_V","score_Q","satisfactionRating"];
    variablesInDataset["weight_loss"] = ["participantID","condition","exercise","weightLost","BMI","userRating"];
    variablesInDataset["phoneEffect"] = ["participant","OS","stressScore","happScore","rating"];
 
var types = ["participant", "dependent", "independent"];
var variablesInDatasetRow = new Object();

var dataTypes = ["nominal", "ordinal", "interval", "ratio"];
var variablesInDatasetType = new Object();
    variablesInDatasetType["impact"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["cars"] = [dataTypes[0], dataTypes[3], dataTypes[1], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["weightLoss"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3]];
    variablesInDatasetType["store"] = [dataTypes[0], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["SAT"] = [dataTypes[0], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2]];
    variablesInDatasetType["hotdogs"] = [dataTypes[0], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["bankloan"] = [dataTypes[3], dataTypes[0], dataTypes[0], dataTypes[2], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["car_sales"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["hp"] = [dataTypes[0], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["keyboards"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    variablesInDatasetType["foodEffect"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    variablesInDatasetType["weight_loss"] = [dataTypes[0], dataTypes[0], dataTypes[1], dataTypes[3], dataTypes[2], dataTypes[1]];
    variablesInDatasetType["phoneEffect"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    
function initVariablesInDatasetTypes()
{  
    variablesInDatasetRow["impact"] = [types[0], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["cars"] = [types[0], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[2]];
    variablesInDatasetRow["weightLoss"] = [types[0], types[2], types[2], types[1]];
    variablesInDatasetRow["store"] = [types[1], types[1], types[2], types[0]];    
    variablesInDatasetRow["SAT"] = [types[0], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["hotdogs"] = [types[2], types[1], types[1]];
    variablesInDatasetRow["bankloan"] = [types[1], types[2], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["car_sales"] = [types[2], types[0], types[1], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["hp"] = [types[2], types[2], types[2]];
    variablesInDatasetRow["keyboards"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["foodEffect"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["weight_loss"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["phoneEffect"] = [types[0], types[2], types[1], types[1], types[1]];
}