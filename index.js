const taskContainer = document.querySelector(".task__container"); // get task container using querySelector
const searchBar = document.getElementById("searchBar");         // search
const taskModal = document.querySelector(".task__modal__body"); // show task modal body
let globalTaskData = [];

const generateHTML = (taskData) => {                            // to generate HTML code using modal data
    return `
    <div id=${taskData.id} class="col-md-6 col-lg-4 mt-4">
     <div class="card task__card">
         <div class="card-header text-end">
             <button class="btn btn-outline-primary" name=${taskData.id} onclick="editCard.apply(this, arguments)">
                 <i class="fas fa-pencil-alt" name=${taskData.id}></i>
             </button>
             <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
                 <i class="fas fa-trash-alt" name=${taskData.id} ></i>
             </button>
         </div>
         <div class="card-body">
             <img src=${taskData.image}
                 class="card-img" alt="image">
             <h5 class="card-title">${taskData.title}</h5>
             <p class="card-text">${taskData.description}</p>
             <span class="badge bg-primary">${taskData.type}</span>
         </div>
         <div class="card-footer ">
             <button class="btn btn-outline-primary" name=${taskData.id} id=${taskData.id}  data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this, arguments)" >Open Task</button>
         </div>
     </div>
 
 </div>
`;
};

    const insertToDOM = (content) =>                // insert HTML content to DOM
    taskContainer.insertAdjacentHTML("beforeend", content);

    const saveToLocalStorage = () =>
    localStorage.setItem("taskyCA",JSON.stringify({card: globalTaskData})); //convert js obj to JSON obj
   
     

  const addNewCard = () => {                         // To add new card
  //get task data
  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("title").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("description").value,
  };
  globalTaskData.push(taskData); // push to array
  
  saveToLocalStorage();
  
  // generate HTML code of task card
   const newCard = generateHTML(taskData);
   
  // inject into DOM
  insertToDOM(newCard);
  
  // CLEAR the form
  document.getElementById("title").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("description").value = "";
  
  return;
};

const loadExistingCards = () => {
    // check localstorage
    const getData = localStorage.getItem("taskyCA");
    // retrieve data if exists
    if(!getData) return;

    const taskCards = JSON.parse(getData); // CONVERT JSON obj to java script obj

    globalTaskData=taskCards.card;
    //generate HTML code for those data
    globalTaskData.map((taskData) => {
        const newCard = generateHTML(taskData);
        // inject into DOM
        insertToDOM(newCard);
    });
    return;
    
};

const deleteCard = (event) => {
    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    const removeTask = globalTaskData.filter((task) => task.id !== targetID);
    globalTaskData = removeTask; //update globaltaskdata after filtering
    
    saveToLocalStorage();

    if(elementType === "BUTTON") {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);
    }
    else {
        return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
    }
};

const editCard = (event) => {
   
    const elementType= event.target.tagName;

    let taskTitle;
    let taskType;
    let taskDescription;
    let parentElement;
    let submitButton;

    if(elementType==="BUTTON") {
        parentElement= event.target.parentNode.parentNode;
    }else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentElement.childNodes[3].childNodes[3];
    taskType = parentElement.childNodes[3].childNodes[7];
    taskDescription = parentElement.childNodes[3].childNodes[5];
    submitButton = parentElement.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");

    submitButton.innerHTML = "Save Changes";
};

const saveEdit = (event)=> {
    const targetID = event.target.getAttribute("name");
    const elementType= event.target.tagName;
    let parentElement;
    if(elementType==="BUTTON") {
        parentElement= event.target.parentNode.parentNode;
    }else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
  const  taskTitle = parentElement.childNodes[3].childNodes[3];
  const  taskType = parentElement.childNodes[3].childNodes[7];
  const  taskDescription = parentElement.childNodes[3].childNodes[5];
  const  submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
      title: taskTitle.innerHTML,
      type: taskType.innerHTML,
      description : taskDescription.innerHTML,
  };
  console.log({ updatedData, targetID });
  const updatedGlobalTasks = globalTaskData.map((task) => {
      if(task.id === targetID) {
        console.log({ ...task, ...updatedData });
          return {...task,...updatedData};
      }
      return task;
  });

  globalTaskData = updatedGlobalTasks;
  saveToLocalStorage();
  
    taskTitle.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false"); 
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
   
    submitButton.innerHTML = "Open Task";
   

};

searchBar.addEventListener("keyup", function (e) {
       if (!e) e = window.event;
       while (taskContainer.firstChild) {
         taskContainer.removeChild(taskContainer.firstChild);
       }
       const searchString = e.target.value;
        console.log(searchString);
       const filteredCharacters = globalTaskData.filter(function (character) {
         return (
           character.title.toLowerCase().includes(searchString) ||
           character.title.includes(searchString)
         );
       });
       filteredCharacters.map(function (cardData) {
         taskContainer.insertAdjacentHTML("beforeend", generateHTML(cardData));
       });
     });
const openTask = (e) => {
        if (!e) e = window.event;
      
        const getTask = globalTaskData.filter(({id}) => id ===  e.target.id );
        taskModal.innerHTML = openModalContent(getTask[0]);
      };
      
 const openModalContent = (taskData) => {
     console.log(taskData);
        const date = new Date(parseInt(taskData.id));
        return ` <div id=${taskData.id}>
        <img
        src=${taskData.image}
        alt="image"
        class="card-img"
        >
        <p class="mt-3"><strong class="text-sm text-muted">Created on ${date.toDateString()}</strong></p>
        <h2 class="card-title" >${taskData.title}</h2>
        <p class="card-text">
        ${taskData.description}
        </p></div>`;
      };