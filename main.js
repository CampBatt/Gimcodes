var latest = document.getElementById("latest");
var prio = document.getElementById("prio");
var find = document.getElementById("find");
var statuss = document.getElementById("status");
var load = document.getElementById("load");
var code_desc = document.getElementById("code_desc");
beat = new Audio("notification.wav");





function copy_to_clip(){
    navigator.clipboard.writeText(this.innerHTML);
    alert("Code Copied To Clipboard")
};

function find_code(){
statuss.innerHTML = "Cheking if server is already finding a code, could take about 30 secconds."
fetch("http://127.0.0.1:8000/test")
.then(res => {
    return res.json()
})
.then (data =>{
    can_continue = data["can_continue"]
    console.log(can_continue)
    if (can_continue == true){
        statuss.innerHTML = "Currently Finding Code"
        load.className = ""
        fetch("http://127.0.0.1:8000")
        .then(res =>{
            return res.json()
        })
        .then (data => {
            console.log(data)
            latest.innerHTML = data["code"]
            statuss.innerHTML = "Start Finding a Code"
            code_desc.innerHTML = "This code was found 0 minutes ago"
            beat.play();
            load.className = "hidden"
        })
    }else{
        statuss.innerHTML = "Code Was Already Being Found"
        load.className = ""
    };
})


    };



console.log(latest);
console.log(prio);
console.log(find);

prio.addEventListener("click", copy_to_clip);
latest.addEventListener("click", copy_to_clip);
find.addEventListener("click", find_code);
