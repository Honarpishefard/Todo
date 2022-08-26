const todoTitle = document.getElementById("title");
const todoDesc = document.getElementById("desc");
const todoBttn = document.getElementById("submitbttn");
const todoMainList = document.getElementById("mainlist");
const toastElement = document.getElementById("toast");
const alertCloseButton = document.getElementById("close-alert");

function getLcTodos() {
    const savedLcTodo = localStorage.getItem("todoList");
    return JSON.parse(savedLcTodo)?.sort((a, b) => a.id - b.id) || [];
};

let savedTodo = [...getLcTodos()];

const todoCreator = (tittle, desc, id, checked) => {
    const listItem = document.createElement("li");
    listItem.id = id;
    const heading3 = document.createElement("h3");
    heading3.innerHTML = tittle;
    heading3.className = "heading";
    // heading3.style.color = "blue";
    const parapraph = document.createElement("p");
    parapraph.innerHTML = desc;
    const editeBttn = document.createElement("button");
    editeBttn.innerHTML = "Edite";
    editeBttn.className = "bttn"
    const deleteBttn = document.createElement("button");
    deleteBttn.innerHTML = "Delete";
    deleteBttn.className = "bttn";

    deleteBttn.addEventListener("click", (event) => {
        const todoParent = event.target.parentElement;
        console.log(todoParent.id);
        const filteredTodo = getLcTodos().filter((item) => item.id !== Number(todoParent.id));
        savedTodo = filteredTodo;
        localStorage.setItem("todoList", JSON.stringify(filteredTodo));
        todoMainList.innerHTML = "";
        renderLcTodo();
    });

    const checkBttn = document.createElement("button");
    checkBttn.innerHTML = "Done!";
    checkBttn.className = "bttn";

    checkBttn.addEventListener("click", (event) => {
        const todoParent = event.target.parentElement;
        const filteredTodos = getLcTodos().filter((item) => item.id === Number(todoParent.id));
        const updatedTodo = {
            ...filteredTodos[0],
            checked: true,
        };
        const filteredTodo = getLcTodos().filter((item) => item.id !== Number(todoParent.id));
        const updateLc = [...filteredTodo, updatedTodo];

        localStorage.setItem("todoList", JSON.stringify(updateLc));

        todoMainList.innerHTML = "";
        renderLcTodo();
    });

    if (checked) {
        heading3.style.textDecoration = "line-through";
        heading3.style.textDecorationColor = "green";
        heading3.innerHTML += `<p class="done-text">done!</p>`;
        heading3.style.opacity = "90%"
        parapraph.style.opacity = "60%";
        editeBttn.style.opacity = "60%";
        deleteBttn.style.opacity = "60%";
        checkBttn.style.opacity = "60%";
    };

    editeBttn.addEventListener("click", () => {
        const tittleEdite = document.createElement("div");
        const tittleEditeInput = document.createElement("input");
        tittleEditeInput.id = listItem.id;
        const tittleEditeSumbit = document.createElement("button");
        tittleEditeSumbit.className = "bttn";
        tittleEdite.appendChild(tittleEditeInput);
        tittleEdite.appendChild(tittleEditeSumbit);
        tittleEditeSumbit.innerHTML = "Sumbit";
        tittleEditeInput.className = "tittle-edite-input";
        tittleEditeInput.defaultValue = tittle;
        listItem.replaceChild(tittleEdite, heading3);
        tittleEditeInput.select();


        const descEdite = document.createElement("div");
        const descEditeInput = document.createElement("input");
        descEditeInput.style.marginBottom = "1rem";
        descEditeInput.id = listItem.id;
        descEdite.appendChild(descEditeInput);
        descEditeInput.className = "tittle-edite-input";
        descEditeInput.defaultValue = desc;
        listItem.replaceChild(descEdite, parapraph);

        tittleEditeSumbit.addEventListener("click", () => {
            const filteredTodosTittle = getLcTodos().filter((item) => item.id === Number(tittleEditeInput.id));
            const filteredTodosDesc = getLcTodos().filter((item) => item.id === Number(descEditeInput.id));
            const updatedTodo = {
                ...filteredTodosTittle[0],
                ...filteredTodosDesc[0],
                tittle: tittleEditeInput.value,
                desc: descEditeInput.value,
            };
            const filteredTodo = getLcTodos().filter((item) => item.id !== Number(tittleEditeInput.id));
            const updateLc = [...filteredTodo, updatedTodo];
            localStorage.setItem("todoList", JSON.stringify(updateLc));
            todoMainList.innerHTML = "";
            renderLcTodo();
        });
    });

    listItem.appendChild(heading3);
    listItem.appendChild(parapraph);
    listItem.appendChild(editeBttn);
    listItem.appendChild(deleteBttn);
    listItem.appendChild(checkBttn);

    todoMainList.appendChild(listItem);
};


function renderLcTodo() {
    getLcTodos().forEach((todo) => {
        todoCreator(todo.tittle, todo.desc, todo.id, todo.checked);
    });
};

renderLcTodo();

const handleCreateNewTodo = (event) => {
    event.preventDefault();


    const toastfn = (msg, options) => {
        toastElement.style.right = "0%";
        toastElement.children[1].innerHTML = msg;
        toastElement.children[0].addEventListener("click", () => {});
        setTimeout(function () {
            toastElement.style.right = "-100%";
        }, options.time || 3000);

        switch (options.type) {
            case "warn":
                toastElement.style.backgroundColor = "gold";
                break;
            case "error":
                toastElement.style.backgroundColor = "red";
                break;
            case "sucess":
                toastElement.style.backgroundColor = "yellowgreen";
                break;
            default:
                toastElement.style.backgroundColor = "lightgrey";
        };
    };

    if (!todoTitle.value) return toastfn("Form not valid!", {
        time: 4000,
        type: "warn",
    });


    const todoInfo = {
        id: Date.now(),
        tittle: todoTitle.value,
        desc: todoDesc.value,
        checked: false,
    };

    savedTodo.push(todoInfo);

    localStorage.setItem("todoList", JSON.stringify(savedTodo));
    todoCreator(todoInfo.tittle, todoInfo.desc, todoInfo.id);
};

todoBttn.addEventListener("click", handleCreateNewTodo);