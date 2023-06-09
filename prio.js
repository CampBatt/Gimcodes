var code = document.getElementById("code");
var fake_code = document.getElementById("fake_code");
var pass = document.getElementById("password");
var fake_pass = document.getElementById("fake_password");
var enter = document.getElementById("enter");

function hide(){
    this.className = "hidden_fake_in"
    this.nextElementSibling.firstChild.className = ""
    this.nextElementSibling.firstChild.focus();
    this.nextElementSibling.firstChild.value = ""

};

function enter_ed(event){
    if(event.which == 13){
        update.call(this);
    };

}

function update(){
if (this.value != ""){
    this.parentNode.previousElementSibling.innerHTML = '<strong>'+ this.value+'</strong>'
    this.parentNode.previousElementSibling.className = "fake_in"
    this.className = "hidden"
};
};

function change_prio(){
    var priority_code = code.value
    var passcode = pass.value

    if (passcode == 'password' || passcode == 'Password'){
        alert('Nice Try')
    };

    if (passcode == 'HackerMan' || passcode == 'hackerman'){
        alert('Your smart using the HTML but thats not actually the password');
    };



    fetch("http://127.0.0.1:8000/prio_code", {
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
    new_code: priority_code,
    password: passcode
})
}).then(res => {
    return res.json()
})
.then(data => {
    console.log(data)
    alert(data["message"])
})
}


fake_code.addEventListener("click", hide);
fake_pass.addEventListener("click", hide);

pass.addEventListener("blur", update);
pass.addEventListener("keypress", enter_ed);
code.addEventListener("keypress", enter_ed);
code.addEventListener("blur", update);

enter.addEventListener("click", change_prio)