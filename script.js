// BAŞLANGIÇ ELEMANI EKLEME
let gorevListesi = [];

if(localStorage.getItem("gorevListesi") != null){
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
    // tarayıcının local storage'ındaki bilgiyi çekmek için 
}

let editId;
let isEditTask = false;

const btnClear = document.querySelector("#btnClear")
const taskInput = document.querySelector("#txtTaskName");
const filters = document.querySelectorAll(".filters span")


displayTasks("all");
// GÖREVLERİ GÖRÜNTÜLEME
function displayTasks(filter){
    ul = document.getElementById("task-list");
    ul.innerHTML = ""; // elemanlar her seferinde tekrar yüklenmesin. 

    if(gorevListesi.length==0){
        ul.innerHTML ="<p class ='p-3 m-1'> Görev Listeniz Boş </p>" 
    }
    
    else{
        for(let gorev of gorevListesi){

            let completed = gorev.durum == "completed" ? "checked": "";
            if(filter == gorev.durum || filter =="all"){
             let li = `<li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onClick="updateStatus(this)" id="${gorev.id}" class= "form-check-input ${completed}"  />
                    <label for="${gorev.id}" class="form-check-label ${completed}"> ${gorev.gorevAdi}</label>
                </div>
        
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a onClick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil</a></li>
                        <li><a onClick='editTask(${gorev.id}, "${gorev.gorevAdi}")'' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle </a></li>
                    </ul>
                </div>
                </li>`;
               ul.insertAdjacentHTML("beforeend", li);
           }
        }
    }
}
     

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);


  // entera basıldığında click 
  document.querySelector("#btnAddNewTask").addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      document.getElementById("btnAddNewTask").click();
    }
  }); 

  for(let span of filters){
    span.addEventListener("click", function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    })
  }


// ELEMAN EKLEME
function newTask(event){
    if(taskInput.value == ""){
        alert("Görev Girmelisiniz"); // boşken eklenmesin
    }else{
        if(!isEditTask){
            gorevListesi.push({ id: gorevListesi.length + 1,gorevAdi: taskInput.value});
        }
        else{
            // GÜNCELLEME
            for(let gorev of gorevListesi){
                if(gorev.id == editId){
                    gorev.gorevAdi = taskInput.value; // inputtaki değer gorevadına aktarıldı.
                }
                isEditTask = false;
            }
        }
       
        taskInput.value = ""; // pushtan sonra silindi.
        displayTasks(document.querySelector("span.active").id);

        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        // jsonstrgingine çevrilir ve local storage'a aktarılır.
    }
    event.preventDefault();
}



// ELEMAN SİLME
function deleteTask(id){
    let deletedId;
    for(let index in gorevListesi){
        if(gorevListesi[index].id ==id){
            deletedId = index;
        }
    }
    gorevListesi.splice(deletedId,1);
    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
}


// DÜZENLEME
function editTask(taskId, taskName){
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");

    console.log("edit id", editId);
    console.log("edit mode:", isEditTask);
  }

  // HEPSİNİ SİLME
  btnClear.addEventListener("click", function(){
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks();
  });

  //CHECKED

  function updateStatus(selectedTask){
    let label = selectedTask.nextElementSibling;
    let durum;

    if(selectedTask.checked){
      label.classList.add("checked");
      durum ="completed";
    }
    else{
      label.classList.remove("checked");
      durum="pending";
    }

    for(let gorev of gorevListesi){
      if(gorev.id==selectedTask.id){
        gorev.durum=durum;
      }
    }
    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("gorevListesi",JSON.stringify(gorevListesi));
  }