//const { config } = require('process');


function deepDiff(oldObj, newObj) {
    const diff = {};
  
    function compareObjects(originalObject, latestObject, path = []) {

      // recursively compare old and new objects and construct 
      // resulting structure 
      for (const key in latestObject) {
        const newPath = [...path, key];
        if (originalObject){            
            if (!(key in originalObject)) {
              // if key from latestObject is not present in originalObject
              // then it is newely added attributes 
              diff[newPath.join('.')] = { newValue: latestObject[key] };
            } 
            else if (typeof latestObject[key] === 'object' && latestObject[key] !== null) {
                  if (typeof originalObject[key] === 'object' && originalObject[key] !== null) {
                    // if given key is not present in current level in object whihc means cusrrent level
                    // could be child object, so start the resursive compare object process on child objects
                    compareObjects(originalObject[key], latestObject[key], newPath);
                  } 
                  else {
                    // if key is not newly added and not a child object then it means it is updated 
                    diff[newPath.join('.')] = { newValue: latestObject[key], oldValue: originalObject[key] };
                  }
            } 
            else if (originalObject[key] !== latestObject[key]) {
              // if new object key is not added then 
          diff[newPath.join('.')] = { newValue: latestObject[key], oldValue: originalObject[key] };
        }
      }
    }    
      

      /// find deleted attributes
      
      for (const key in originalObject) {
        const newPath = [...path, key];
        
        if (latestObject){
          // if key in old object is not present in new object 
          // means it is deleted, so store it in diff as oldValue key
        if (!(key in latestObject)) {
          diff[newPath.join('.')] = { oldValue: originalObject[key] };
        } 
        }
      }
      
    }
    
       
    compareObjects(oldObj, newObj);
  
    return diff;
  }


/*

  function readFile(filePath){

    const fs = require('fs')
 
    data = fs.readFileSync(filePath, (err, data) => {
    if (err) throw err; 
    return data ;
       
    })
 
    return data
}
*/


function getidentifires(jsonobject){
    var identifires = []


    if (! (jsonobject)){
        throw "Invalid input contact flow bject";
    }

    for(var key in jsonobject){
        identifires.push(jsonobject[key].Identifier)
    }

    return identifires;

}

function findObjectWithValue(obj, item, value) {   
    function objFind(obj, item, value){
        for(var key in obj) {                                 

           if(obj[key] && obj[key].length ==undefined) {     
                if(obj[item]==value){
                    return obj;
                }
              objFind(obj[key], item, value);             
                
            }else{ 
                if(obj[key] && obj[key].length >0){
                    if(Array.isArray(obj[key])){
                        for(var i=0;i<obj[key].length;i++){
                            var results = objFind(obj[key][i], item, value);
                            if(typeof results === "object" && obj[item]==value){
                                return obj;
                            }
                        }
                    }
                }
            }
        }
    }
    if(obj.length >0){
        for(var i=0;i<obj.length;i++){
            var results=objFind(obj[i], item, value);
            if(typeof results === "object"){
                return results;
            }
        }
    }
    else{
       var results=objFind(obj, item, value);
        if(typeof results === "object"){
            return obj;
        }
    }

}



function findObjectWithKey(json, key) {
  // Base case: If the input is not an object, return null
  if (typeof json !== 'object' || json === null) {
      return null;
  }
  
  // Check if the key exists in the current object
  if (json.hasOwnProperty(key) && Object.keys(json[key]).length > 0) {
    resultKey = JSON.stringify(json[key],"ok",2)
    
    result = JSON.parse("{" +  '"' + key + '"' + ":" + resultKey + "}")
    
    return result
   
  }
  
  // Iterate through the object's properties recursively
  for (const prop in json) {
      const result = findObjectWithKey(json[prop], key);
      if (result && Object.keys(result).length>0) {

        var resultKey = JSON.stringify(json[key],"ok1",2)

        result = "{" +'"' + key +'"' + ":" + resultKey + "}"
        
        return result
          
      }
  }
  
  
}



// function to remove not required info from object.

function cleanObject(obj){
  
  //const conf = JSON.parse(readFile('./settings').toString())


  const conf = { "IGNORE_TAG" : ["entryPointPosition","position","isFriendlyName","conditionMetadata"] }



  // remove attributes from object if attribute is matching with
  // attribute list from settings file under list of 'IGNORETAG' key

  for (var key in conf['IGNORE_TAG']){  
    obj = removeKey(obj,conf['IGNORE_TAG'][key])    
  }

  return obj;
}



function removeKey(obj, key) {
  for(prop in obj) {
    if (prop === key)
      delete obj[prop];
    else if (typeof obj[prop] === 'object')
      removeKey(obj[prop],key);
  }

  return obj;
}


function isObjectEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }


  function prepareFinalObject(UMObjects,AMObjects,DMObjects,UObjects,AObjects,DObjects){

    var finalObject = {
      "Metadata": [],
      "Actions": []
    }

    if(! isObjectEmpty(UMObjects)){
      finalObject.Metadata.push(UMObjects)
    }

    if(! isObjectEmpty(AMObjects)){
      finalObject.Metadata.push(AMObjects)
    }

    if(! isObjectEmpty(DMObjects)){
      finalObject.Metadata.push(DMObjects)
    }

    if(! isObjectEmpty(UObjects)){
      finalObject.Actions.push(UObjects)
    }

    if(! isObjectEmpty(AObjects)){
      finalObject.Actions.push(AObjects)
    }

    if(! isObjectEmpty(DObjects)){
      finalObject.Actions.push(DObjects)
    }


    return finalObject

  }



  //==================================$$$$$====================================
  //================================$$=====$$==================================
  //===============================$$$$$$$$$$$$================================
  //=============================$$============$$===============================
  //============================$$===============$$============================

function flowCompare(oldFlow, newFlow){ 


  var updatedObjects = []
  var deletedObjects = []
  var addedObjects = []

  var updatedMetadataObjects = []
  var deletedMetadataObjects = []
  var addedMetadataObjects = []

  var finalDiffObject = null



   
  var oldData = cleanObject(oldFlow)  
  var newData = cleanObject(newFlow)


  const oldIdentifierList = getidentifires(oldData.Actions)
  const newIdentifierList = getidentifires(newData.Actions)
  
  //console.log(oldIdentifierList)

  // Compare actions blocks to find which action objects are updated
  for (var objId in newIdentifierList){
    const oldObject = findObjectWithValue(oldData.Actions, "Identifier", newIdentifierList[objId])
    const newObject = findObjectWithValue(newData.Actions, "Identifier", newIdentifierList[objId])

    const newObjectAdded = findObjectWithValue(oldData.Actions, "Identifier", newIdentifierList[objId])    

    if (isObjectEmpty(newObjectAdded)){
        addedObjects.push(newObject)
    }

    const differences = deepDiff(oldObject, newObject);
    if (differences != null && ! isObjectEmpty(differences) ){
        updatedObjects.push(differences)
    }
  }


/// find deleted actions object
  for (var objId in oldIdentifierList){
    const oldObjectDeleted = findObjectWithValue(newData.Actions, "Identifier", oldIdentifierList[objId])
    const oldObject = findObjectWithValue(oldData.Actions, "Identifier", oldIdentifierList[objId])
    
    if (isObjectEmpty(oldObjectDeleted)){
        deletedObjects.push(oldObject)
    }
  }



  // Compare actions blocks to find which Metadata objects are updated
  for (var objId in newIdentifierList){
    const oldObject = findObjectWithKey(oldData.Metadata.ActionMetadata, newIdentifierList[objId])
    const newObject = findObjectWithKey(newData.Metadata.ActionMetadata, newIdentifierList[objId])

    const newObjectAdded = findObjectWithKey(oldData.Metadata.ActionMetadata, newIdentifierList[objId])

    if (isObjectEmpty(newObjectAdded)){
      if (! isObjectEmpty(newObject)){
                addedMetadataObjects.push(newObject)
      }
    }

    const differences = deepDiff(oldObject, newObject);
    if (differences != null && ! isObjectEmpty(differences) ){
        updatedMetadataObjects.push(differences)
    }
  }


  finalDiffObject = prepareFinalObject(
      updatedMetadataObjects,
      addedMetadataObjects,
      deletedMetadataObjects,
      updatedObjects,
      addedObjects,
      deletedObjects
      );




  const diffBox = document.getElementById('diffBox');
  
  diffBox.innerHTML = jsonViewer(finalDiffObject, true)


  console.log("=============  final object ================")
  console.log(JSON.stringify(finalDiffObject,null,2))

  console.log("=============  updated action blocks ================")
  console.log(JSON.stringify(updatedObjects,null,2))
  console.log("=============  updated metadata blocks ================")
  console.log(JSON.stringify(updatedMetadataObjects,null,2))



  console.log("=============  added action blocks ================")
  console.log(JSON.stringify(addedObjects,null,2))
  console.log("=============  added metadata blocks ================")
  console.log(JSON.stringify(addedMetadataObjects,null,2))



  console.log("=============  deleted blocks ================")
  console.log(JSON.stringify(deletedObjects,null,2))
  
}





/*

======= display object structure =========

Identifier : {
  "action" : "add"/"delete"/"update",
  "position" : {
            "x": 14.4,
            "y": 233.6"
          }
  "metadata" : {},
  "actions" : {}
}


*/