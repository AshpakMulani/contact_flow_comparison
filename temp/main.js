document.addEventListener("DOMContentLoaded", function() {
    const arrowsContainer = document.getElementById("arrows");

    const boxes = document.querySelectorAll(".json-box");
   

    boxes.forEach((box, index) => {
        if (index < boxes.length - 1) {

            const nextBox = boxes[index + 1];
           // const boxRect = box.getBoundingClientRect();
            // const nextBoxRect = nextBox.getBoundingClientRect();
            
            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");           
                            
    
            const box1Rect = box.getBoundingClientRect();
            const box2Rect = nextBox.getBoundingClientRect();          
        
       
            arrow.setAttribute("d", `M${box1Rect.right},${box1Rect.top + box1Rect.height / 2} Q${(box1Rect.right + box2Rect.left) / 2},${(box1Rect.top + box2Rect.top) / 2} ${box2Rect.left},${box2Rect.top + box2Rect.height / 2}`);
            arrow.setAttribute("fill", "none");
            arrow.setAttribute("stroke", "gray");

                    
            arrowsContainer.appendChild(arrow);

           // console.log(arrowsContainer)
        }
    });
});
