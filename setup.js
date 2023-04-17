var latest = document.getElementById("latest");
var prio = document.getElementById("prio");
var statuss = document.getElementById("status");
var load = document.getElementById("load");
var code_desc = document.getElementById("code_desc");
let beat = new Audio("notification.wav");
let beat2 = new Audio("prio_notification.wav");

function start(){
fetch("http://127.0.0.1:8000/setup")
.then (res => {
    return res.json()
})
.then (data =>{
    if (data["code"] != latest.innerHTML && latest.innerHTML != "_ _ _ _ _ _"){
        beat.play()
    }
    latest.innerHTML = data["code"]
    code_desc.innerHTML = "This code was found " + data["time"] + " " + data["time_unit"] + " ago"
    if (prio.innerHTML != data["prio_code"] && prio.innerHTML != "000000" && data["prio_code"] != '_ _ _ _ _ _'){
        console.log('it worked kinda')
        beat2.play()
    }
    prio.innerHTML = data["prio_code"]
    if (data["not_looking"]){
        statuss.innerHTML = "Start Finding a Code"
        load.className = "hidden"
    }else{
        statuss.innerHTML = "Currently Finding Code"
        load.className = ""
    }
    

})
};

start();
setInterval(start,30000);