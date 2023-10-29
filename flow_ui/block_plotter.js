

const { dia, shapes } = joint;


paper = getPaper()
const graph = paper.model;



const block_data = [
    {
        "id": "my play prompt",
        "state": "updated",
        "metadata": {
            "position": {
                "x": 682.4,
                "y": 144.8
            }
        },
        "action": {
            "Parameters": {
                "Text": "hi there ashpak"
            },
            "Identifier": "my play prompt",
            "Type": "MessageParticipant",
            "Transitions": {
                "NextAction": "45093636-4029-4916-aa51-d6ab792ed1d5",
                "Errors": [
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        "metadataupdated": null,
        "actionupdated": {
            "Transitions.NextAction": {
                "newValue": "45093636-4029-4916-aa51-d6ab792ed1d5",
                "oldValue": "62eee56d-942f-41eb-8491-95eee762aae4"
            }
        }
    },
    {
        "id": "get customer name",
        "state": "updated",
        "metadata": {
            "position": {
                "x": 476.8,
                "y": 372.8
            }
        },
        "action": {
            "Parameters": {
                "StoreInput": "False",
                "InputTimeLimitSeconds": "5",
                "Text": "please enter your name"
            },
            "Identifier": "get customer name",
            "Type": "GetParticipantInput",
            "Transitions": {
                "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                "Conditions": [
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "Condition": {
                            "Operator": "Equals",
                            "Operands": [
                                "1"
                            ]
                        }
                    },
                    {
                        "NextAction": "my play prompt",
                        "Condition": {
                            "Operator": "Equals",
                            "Operands": [
                                "2"
                            ]
                        }
                    },
                    {
                        "NextAction": "my play prompt",
                        "Condition": {
                            "Operator": "Equals",
                            "Operands": [
                                "3"
                            ]
                        }
                    },
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "Condition": {
                            "Operator": "Equals",
                            "Operands": [
                                "4"
                            ]
                        }
                    },
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "Condition": {
                            "Operator": "Equals",
                            "Operands": [
                                "5"
                            ]
                        }
                    }
                ],
                "Errors": [
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "ErrorType": "InputTimeLimitExceeded"
                    },
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "ErrorType": "NoMatchingCondition"
                    },
                    {
                        "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        "metadataupdated": null,
        "actionupdated": {
            "Transitions.Conditions.4": {
                "newValue": {
                    "NextAction": "62eee56d-942f-41eb-8491-95eee762aae4",
                    "Condition": {
                        "Operator": "Equals",
                        "Operands": [
                            "5"
                        ]
                    }
                }
            }
        }
    },
    {
        "id": "welcome prompt",
        "state": "updated",
        "metadata": {
            "position": {
                "x": 178.4,
                "y": 237.6
            }
        },
        "action": {
            "Parameters": {
                "Text": "Hello from connect...new welcome contents"
            },
            "Identifier": "welcome prompt",
            "Type": "MessageParticipant",
            "Transitions": {
                "NextAction": "my play prompt",
                "Errors": [
                    {
                        "NextAction": "get customer name",
                        "ErrorType": "NoMatchingError"
                    }
                ]
            }
        },
        "metadataupdated": {
            "position.x": {
                "newValue": 178.4,
                "oldValue": 152.8
            },
            "position.y": {
                "newValue": 237.6,
                "oldValue": 335.2
            }
        },
        "actionupdated": null
    }
]


function getPaper(){

   // console.log(document.getElementById('diffBox'))
   
    const paper = new dia.Paper({
        el: document.getElementById('diffBox'),
        width: 5000,
        height: 5000,
        gridSize: 10,
        model: new dia.Graph(),
      });

    return paper
}




function fitPaperToScreen() {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    paper.setDimensions(width, height);
  }
  

function drawDiff(input_block){

    console.log(input_block)

  
    blockId = input_block.id
    state = input_block.state
    posX = input_block.metadata.position.x
    posY = input_block.metadata.position.y
    blockType = input_block.action.Type
    
    blockHeight = 140
    blockWidth = 100

    blockColor = 'gray'

  //  if(input_block.hasOwnProperty("metadataupdated") || input_block.hasOwnProperty("actionupdated")){
   //     if (input_block.metadataupdated  != null || input_block.actionupdated  != null){
   //         blockColor = "orange"
   //     }
   // }

   if(input_block.state == "updated"){
    blockColor = "orange"
   }

   if(input_block.state == "deleted"){
    blockColor = "red"
   }

   if(input_block.state == "added"){
    blockColor = "green"
   }


    var rect = new shapes.standard.Rectangle();
    rect.position(posX, posY);
    rect.resize(blockHeight, blockWidth);
    rect.attr({
      body: {
        fill: blockColor,
        'stroke-width' : 0.5,
        'stroke' : 'gray',
        rx: 10,
        ry: 10,
      },
      label: {
        text: blockType,
        fill: 'black',
      },
    });

     
     graph.addCell([rect]);
   
  }





//for(block in block_data){
//    drawDiff(block)
//}

  
