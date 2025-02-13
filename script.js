let prompt = document.querySelector("#prompt");
let submit = document.querySelector("#submit");
let image = document.querySelector("#image");
let imageinput = document.querySelector("#image input")
let chatcontainer = document.querySelector(".chat-container");
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBnlJvaw382Y8X9A22UI6Rv9Tnuj52vPtc"

let user ={
    massage:null,
    file:{
        mime_type:null,
        data: null
    }
}

async function generateresponse(aichatbox) {
    
    let text = aichatbox.querySelector(".ai-chat-area")

    let request ={
        method :"POST",
        headers : {'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents": [
                {
                "parts":[{"text": user.massage},(user.file.data?[{"inline_data":user.file}] : [] )

                ]
            }]
        })

    }

    try{
        let response = await fetch(url,request)
        let data = await response.json();
        let apiresponse = data.candidates[0].content.parts[0].text;
        text.innerHTML = apiresponse;
        user.file = { mime_type: null, data: null };

    }
    catch(error){
        console.log(error);
    }
    
}

function createchatbox(html,classes){
    let div = document.createElement("div")
    div.innerHTML = html;
    div.classList.add(classes)
    return div;
}

function handlechatresponse(user_massage){
    user.massage = user_massage;
    let html = ` <div class="user-chat-area">
            ${user.massage}
            ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
           </div>`
    prompt.value = ""
    
    let usercahtbox = createchatbox(html,"user-chat-box");
    chatcontainer.appendChild(usercahtbox)

    setTimeout(()=>{
        let html = `<div class="ai-chat-area">
            </div>`
        let aichatbox = createchatbox(html,"ai-chat-box");
        chatcontainer.appendChild(aichatbox);
        generateresponse(aichatbox);

    },500)

}


prompt.addEventListener("keydown",(e) => {
    if(e.key == "Enter"){
       handlechatresponse(prompt.value);

    }
});

submit.addEventListener("click",() => {
       handlechatresponse(prompt.value);

});


image.addEventListener("click",()=>{
    image.querySelector("input").click()
    
})

image.addEventListener("change",()=>{
   const file = imageinput.files[0];
   if(!file){
    return;
   }

   let reader = new FileReader();
   reader.onload=(e)=>{
    let base64 = e.target.result.split(",")[1];
    user.file = {

            mime_type: file.type,
            data: base64

    }
   }
   reader.readAsDataURL(file);

})  