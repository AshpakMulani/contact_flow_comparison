
function deepDiff(oldObj, newObj) {
    var diff = {};
  
    function compareObjects(originalObject, latestObject, path = []) {

          // recursively compare old and new objects and construct 
          // resulting structure 
          for (var key in latestObject) {
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
          
          for (var key in originalObject) {
            var newPath = [...path, key];
            
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


function getidentifires(jsonobject){
      // Function to return identifiers list frm provide contact flow json object
      // Input : Contact flow object.Actions block. 

        var identifires = []
        if (! (jsonobject)){
            throw "Invalid input contact flow bject";
        }

        for(var key in jsonobject){
            identifires.push(jsonobject[key].Identifier)
        }

        return identifires;
}


function findObjectWithKeyValue(obj, keyToFind, valueToFind) {   
      // Base case: if the object is null or undefined, return undefined
      if (obj === null || typeof obj !== 'object') {
        return undefined;
      }

      // Check if the current object has the key and the matching value
      if (obj[keyToFind] === valueToFind) {
        return obj;
      }

      // Recursively search in nested objects and arrays
      for (var key in obj) {
        var foundObject = findObjectWithKeyValue(obj[key], keyToFind, valueToFind);
        if (foundObject !== undefined) {
          return foundObject;
        }
      }

      // If the key-value pair is not found anywhere in the object, return undefined
      return undefined;
}



function findObjectWithKey(obj, keyToFind) {   
   
        // Base case: if the object is null or undefined, return undefined
        if (obj === null || typeof obj !== 'object') {
          return undefined;
        }

        // Check if the current object has the key
        if (obj.hasOwnProperty(keyToFind)) {
          return obj[keyToFind];
        }

        // Recursively search in nested objects and arrays
        for (var key in obj) {
          var foundValue = findObjectWithKey(obj[key], keyToFind);
          if (foundValue !== undefined) {
            return foundValue;
          }
        }

        // If the key is not found anywhere in the object, return undefined
        return undefined;
}


function cleanObject(obj){  

        var conf = { "IGNORE_TAG" : ["entryPointPosition","isFriendlyName","conditionMetadata"] }

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
          for (var prop in obj) {
            if (Object.hasOwn(obj, prop)) {
              return false;
            }
          }
        
          return true;
  }


function getExistingBlocks(IdentifierList1, IdentifierList2){

        var difference = (set1, set2) => new Set([...set1].filter(x => !set2.has(x)))
        var differenceA = (arr1, arr2) => Array.from(difference(new Set(arr1), new Set(arr2)))

        ret_blocks = differenceA(IdentifierList1, IdentifierList2)   

        return ret_blocks
}


  function getAddedBlocks(IdentifierList1, IdentifierList2){
          // function to return newly added block in updated ID list
          var difference = (set1, set2) => new Set([...set1].filter(x => !set2.has(x)))
          var differenceA = (arr1, arr2) => Array.from(difference(new Set(arr1), new Set(arr2)))

          ret_blocks = differenceA(IdentifierList2, IdentifierList1)   

          return ret_blocks
  }


  function getUpdatedBlocks(IdentifierList, dataset1, dataset2 ){

          var retObj = []
          var metadataDiff = {}
          var actionDiff = {}

          for(blockid in IdentifierList){

                newObjMetadata = findObjectWithKey(dataset1, IdentifierList[blockid])
                oldObjMetadata = findObjectWithKey(dataset2, IdentifierList[blockid])

              
                // object from new set exists in old contact flow as well
                if (!(oldObjMetadata == undefined || oldObjMetadata == null)){
                  metadataDiff = deepDiff(oldObjMetadata, newObjMetadata)
                }


                newObjAction = findObjectWithKeyValue(dataset1,"Identifier", IdentifierList[blockid])
                oldObjAction = findObjectWithKeyValue(dataset2,"Identifier", IdentifierList[blockid])

                if (!(oldObjAction == undefined || oldObjAction == null)){
                  actionDiff = deepDiff(oldObjAction, newObjAction)
                }


                if(! isObjectEmpty(metadataDiff)){
                  retObj.push({"id":IdentifierList[blockid],"metadata": newObjMetadata , "metadataDiff":metadataDiff})
                }

                if(! isObjectEmpty(actionDiff)){
                  retObj.push({"id":IdentifierList[blockid], "action":newObjAction, "actionDiff":actionDiff})
                }
          }   

    return retObj
  }


  function prepareUIBlocks(blockid, data, state="", metadataupdated=null, actionupdated=null ){
    // function to prepare blocks with structure required by UI logic
          var retObj = {}      


          retObj.id = blockid
          retObj.state = state

          ret = findObjectWithKey(data, blockid)
          retObj.metadata = ret


          ret = findObjectWithKeyValue(data, "Identifier", blockid)
          retObj.action = ret


          retObj.metadataupdated = metadataupdated
          retObj.actionupdated = actionupdated

          return retObj
  }


  //==================================$$$$$====================================
  //================================$$=====$$==================================
  //===============================$$$$$$$$$$$$================================
  //=============================$$============$$===============================
  //============================$$===============$$============================

function flowCompare(oldFlow, newFlow){ 
 
        var uiAddedBlocks = []
        var uiRemovedBlocks = []
        var uiUpdatedBlocks = []
        var processedBlocksList = []
        var compareResults = []
        var existingBlocksList = []
        var uiExistingBlocksList = []
        
        var oldData = cleanObject(oldFlow)  
        var newData = cleanObject(newFlow)


        var oldIdentifierList = getidentifires(oldData.Actions)
        var newIdentifierList = getidentifires(newData.Actions)

        var addedBlocks = getAddedBlocks(oldIdentifierList, newIdentifierList)
        // newly added block info will be present in new contact flow so passing 'newData'
        for(blockid in addedBlocks){    
          uiAddedBlocks.push(prepareUIBlocks(addedBlocks[blockid],newData, "added"))
          compareResults.push(prepareUIBlocks(addedBlocks[blockid],newData, "added"))
          processedBlocksList.push(addedBlocks[blockid].id)
        }  

        // using getAddedBlock function in reverse way to find what blocks are present in 
        // old contact flow but missing in new i.e find deleted blocks from new contact flow
        removedBlocks = getAddedBlocks(newIdentifierList,oldIdentifierList)
        // deleted block info will be present in old contact flow so passing 'oldData'
        for(blockid in removedBlocks){
          uiRemovedBlocks.push(prepareUIBlocks(removedBlocks[blockid],oldData, "removed"))
          compareResults.push(prepareUIBlocks(removedBlocks[blockid],oldData, "removed"))
          processedBlocksList.push(removedBlocks[blockid].id)
        }

        updatedBlocks = getUpdatedBlocks(newIdentifierList,newData,oldData)        

        for(blockid in updatedBlocks){

          uiUpdatedBlocks.push(prepareUIBlocks(updatedBlocks[blockid].id,
                                                  newData, 
                                                  "updated",
                                                  updatedBlocks[blockid].metadataDiff,
                                                  updatedBlocks[blockid].actionDiff
                                                  ))

          compareResults.push(prepareUIBlocks(updatedBlocks[blockid].id,
            newData, 
            "updated",
            updatedBlocks[blockid].metadataDiff,
            updatedBlocks[blockid].actionDiff
            ))

            processedBlocksList.push(updatedBlocks[blockid].id)                 
        }

        existingBlocksList = getExistingBlocks(newIdentifierList,processedBlocksList)      

        for(blockid in existingBlocksList){
          uiExistingBlocksList.push(prepareUIBlocks(existingBlocksList[blockid],newData, "existing"))
          compareResults.push(prepareUIBlocks(existingBlocksList[blockid],newData, "existing"))
        }

        return compareResults 
}
  

