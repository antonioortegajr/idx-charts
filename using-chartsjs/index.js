/* 
* Mock API call system with static data used.
*  This doesn not make API calls is simply how I organized the data
*/

let apiCalls = ["/mls/papprovedmls","/mls/propertytypes/","/mls/prices/"];
let reportData = {};

let incomingRequest = {
    "savedLinkIDs":["18436"],
    "cities":["Portland", "Eugene"],
    "counties":["Multnomah"]

}


// some results from API Calls
let approvedMLS = 'a001';
let savedLinksCount = '13412';

let mlsCities = [{"cityID":"37536","cityName":"Portland","stateAbrv":"OR","mlsPtID":"1","occurances":"3142"},{"cityID":"37536","cityName":"Portland","stateAbrv":"OR","mlsPtID":"4","occurances":"339"},{"cityID":"37536","cityName":"Portland","stateAbrv":"OR","mlsPtID":"2","occurances":"160"},{"cityID":"37536","cityName":"Portland","stateAbrv":"OR","mlsPtID":"3","occurances":"130"},{"cityID":"48772","cityName":"Vancouver","stateAbrv":"WA","mlsPtID":"1","occurances":"1464"},{"cityID":"48772","cityName":"Vancouver","stateAbrv":"WA","mlsPtID":"4","occurances":"106"},{"cityID":"48772","cityName":"Vancouver","stateAbrv":"WA","mlsPtID":"2","occurances":"25"},{"cityID":"48772","cityName":"Vancouver","stateAbrv":"WA","mlsPtID":"3","occurances":"24"},{"cityID":"15047","cityName":"Eugene","stateAbrv":"OR","mlsPtID":"1","occurances":"565"},{"cityID":"15047","cityName":"Eugene","stateAbrv":"OR","mlsPtID":"4","occurances":"148"},{"cityID":"15047","cityName":"Eugene","stateAbrv":"OR","mlsPtID":"2","occurances":"32"},{"cityID":"15047","cityName":"Eugene","stateAbrv":"OR","mlsPtID":"3","occurances":"26"}];

mlsCounties =[{"countyID":"2305","countyName":"Multnomah","stateAbrv":"OR","mlsPtID":"1","occurances":"3079"},{"countyID":"2305","countyName":"Multnomah","stateAbrv":"OR","mlsPtID":"4","occurances":"389"},{"countyID":"2305","countyName":"Multnomah","stateAbrv":"OR","mlsPtID":"2","occurances":"169"},{"countyID":"2305","countyName":"Multnomah","stateAbrv":"OR","mlsPtID":"3","occurances":"138"},{"countyID":"936","countyName":"Clark","stateAbrv":"WA","mlsPtID":"1","occurances":"2461"},{"countyID":"936","countyName":"Clark","stateAbrv":"WA","mlsPtID":"4","occurances":"468"},{"countyID":"936","countyName":"Clark","stateAbrv":"WA","mlsPtID":"3","occurances":"49"},{"countyID":"936","countyName":"Clark","stateAbrv":"WA","mlsPtID":"2","occurances":"28"}];

let mlsPropTypes = [{"mlsPtID":"1","mlsPropertyType":"Residential","parentPtID":"1","parentPropertyType":"Single Family Residential","parentPt":"sfr","propSubTypes":"[\"Single Family Residence\",\"Condominium\",\"Attached\",\"Manufactured On Land\",\"Manufactured Home\",\"Townhouse\",\"Floating Home\",\"DETACHD\",\"Planned Community\",\"Partially Owned\",\"CONDO\",\"ATTACHD\",\"RES-MFG\",\"Co-Op Housing\",\"Manufactured Home on Real Property\",\"FARM\",\"PARTOWN\",\"||CONDO||\"]"},{"mlsPtID":"2","mlsPropertyType":"MultiFamily","parentPtID":"2","parentPropertyType":"Multifamily Residential","parentPt":"mfr","propSubTypes":"[]"},{"mlsPtID":"3","mlsPropertyType":"Commercial","parentPtID":"5","parentPropertyType":"Commercial","parentPt":"com","propSubTypes":"[\"Commercial\",\"Business\",\"Office\",\"Other\",\"Income\",\"Industrial\",\"Live Work Unit\",\"Light Industrial\",\"Warehouse\",\"Hotel\\\/Motel\",\"Church\",\"Mobile Park\",\"Heavy Industrial\",\"Recreational\",\"Manufacturing\"]"},{"mlsPtID":"4","mlsPropertyType":"Lots And Land","parentPtID":"6","parentPropertyType":"Lots and Land","parentPt":"ld","propSubTypes":"[\"Single Family Residence\",\"Residential\\\/Recreational\",\"Farm\",\"Industrial\",\"Multifamily\",\"Recreation Only\",\"RESID\",\"FRM\\\/FOR\",\"List Price\"]"}];

let pricesData = {"priceSum":"11446663062","priceByPt":{"1":{"count":"16888","sum":"8452502033"},"4":{"count":"6189","sum":"1897178000"},"3":{"count":"1055","sum":"775169891"},"2":{"count":"478","sum":"321813138"}}}


// simple average
function average(count, sum){
    return sum/count
}

// look up prop type name
function propTypeNames(findPropType, mlsPropTypes){
    let name = mlsPropTypes.map((propType)=>{
        if(findPropType == propType.mlsPtID){
            return propType.mlsPropertyType;
        }
    });

    return name.filter(item => item !== undefined);

}

let byPropType = pricesData.priceByPt;

let proptTypeAverages = mlsPropTypes.map((propType)=>{
    let propTypeId = propType.mlsPtID;
    let propTypeName = propType.mlsPropertyType;
    reportData[propTypeName] = byPropType[propTypeId]
    let averageByPropType = average(byPropType[propTypeId].count, byPropType[propTypeId].sum);

    let averageObj = {}
    averageObj[propTypeName] = averageByPropType;

    return averageObj;
});

let citiesCounts =  mlsCities.map((city)=>{

    if(incomingRequest.cities.includes(city.cityName)){

        let cityCount = city.occurances;
        let cityName = city.cityName;
        let cityCountObj = {};
        cityCountObj[cityName] = cityCount;
        let getPropTypeName = propTypeNames(city.mlsPtID, mlsPropTypes);
        cityCountObj["propType"] = getPropTypeName;
        return cityCountObj;
    }
});

let countiesCounts =  mlsCounties.map((county)=>{

    if(incomingRequest.counties.includes(county.countyName)){

        let countyCount = county.occurances;
        let countyName = county.countyName;
        let countyCountObj = {};
        countyCountObj[countyName] = countyCount;
        let getPropTypeName = propTypeNames(county.mlsPtID, mlsPropTypes);
        countyCountObj["propType"] = getPropTypeName;
        return countyCountObj;
    }
});

// build report
reportData["proptTypeAverages"] = proptTypeAverages;
reportData["citiesCounts"] = citiesCounts.filter(item => item !== undefined);
reportData["countiesCounts"] = countiesCounts.filter(item => item !== undefined);
reportData["savedlinkresults"] = savedLinksCount;
reportData["mlsSum"] = pricesData.priceSum; 

console.log(reportData);
