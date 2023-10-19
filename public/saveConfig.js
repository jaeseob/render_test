// define save_fxn, append_fxn
let TaskName, ID

TaskName = 'spatial2Ori_retro'
let params = new URLSearchParams(document.location.search);
ID = parseInt(params.get('id'))
if(isNaN(ID)){ID = 0}
// let Testing = parseInt(params.get('testing'))



let Result_stack = []
let append_fxn = function(data){Result_stack.push(data)}
let save_fxn = console.log

let check_url = '/server_checking'
let send_url = '/send_data2'


// save the JS object as json file in local 
function saveText(obj, filename){
    let text = JSON.stringify(obj)
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename + '.json');
    a.click()
}


async function define_save_fxn(){
    let test_url = check_url
    let response
    response = {'ok' : false}

    try{
        response = await fetch(test_url, {
            method : "POST"
        })
    }catch{console.log('server checking failed')}


    if(response.ok){
        console.log('server checking success!!')

        async function send_data(data){
            let url = send_url
            let dj = JSON.stringify({
                'ID' : ID,
                'task': TaskName,
                'data' : data,
            })
        
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: dj
            })
        
            return response
        }
        
        save_fxn = async () => {
            let response 
            let interval = 1000
            let sendStack = 0

            let sendFail = true
            while(sendFail){
                try{
                    response = await send_data(Result_stack)
                    sendFail = false
                }catch{
                    console.log(`problem to send data : ${sendStack}`)
                    await waiting(interval)
                    sendFail = true
                    sendStack = sendStack + 1
                }
            }
            console.log('data sent')
        }
    }else{
        save_fxn = () => {saveText(Result_stack, Date.now())}
    }
}

define_save_fxn()
