// basic functions
function getRect(obj){
    let rect = obj.getBoundingClientRect()
    let scX = window.scrollX
    let scY = window.scrollY
    
    let rect2 = {}
    rect2.x = rect.x + scX
    rect2.y = rect.y + scY
    
    rect2.top = rect.top + scY
    rect2.bottom = rect.bottom + scY
    
    rect2.left = rect.left + scX
    rect2.right = rect.right + scX

    rect2.width = rect.width
    rect2.height = rect.height

    return rect2
}

function waiting(interval){
    return new Promise(resolve =>{
        setTimeout(()=>{
            resolve();
        }, interval)})
}


function nanMean(arr){
    let i, stk, n
    n = 0
    stk = 0
    for(i =0; i<arr.length; i++){
        if(!isNaN(arr[i])){
            stk = stk+arr[i]
            n = n+1
        }}
    let res = stk/n
    if(n = 0){res = NaN}
    return res
}

function rand(){
    return (Math.random()-0.5)*2
}


function shuffle(array) { 
    let currentIndex = array.length,  randomIndex;
    
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

function random_select(arr){
    return shuffle([...arr])[0]
}

function arr(n, map = x => 0){
    let emptyArr = [...Array(n)]
    let y = emptyArr.map(map)
    return y
}

function arange(n){
    return [...Array(n).keys()]
}


class Scaling_task{
    constructor(){
        this.card_ratio = 5.39/8.56 // height/width
        this.cardWidth = 313
        this.lPad = 50


        this.card = document.createElement('div')
        this.card2 = document.createElement('div')
        this.title = document.createElement('div')

        this.mov_rect = document.createElement('div')

        this.left_pos = 100
        this.top_pos = 100


        // this.start_resizing()
        this.result = {'card_pixel':NaN, 'distance':NaN, 'pixels_per_cm':NaN}
    }

    

    async maximize_window(){
        
        let window_maximized = false

        let elems = '<div id = "wait_div" style="position:absolute; z-index:5; padding:30px;"> <p id=wait_max style=font-size:30px>Please maximize the window to start experiment<br>If the experiment does not start after you maximize the window, click the button</p> <button id="wait_btn" type="button" style="font-size:30px">I maximized window</button> </div>'
        document.body.innerHTML =  elems + document.body.innerHTML

        let wait_div = document.createElement('div')
        wait_div.innerHTML = `<p id=wait_max style=font-size:30px>Please maximize the window to start experiment<br>If the experiment does not start after you maximize the window, click the button</p> <button id="wait_btn" type="button" style="font-size:30px">I maximized window</button>`
        let wait_btn = document.getElementById('wait_btn')

        // let wait_btn = document.createElement('button')
        // let wait_btn = document.getElementById('wait_btn')
        // let wait_div = document.getElementById('wait_div')

        wait_div.style.width = '80%'
        // wait_div.style.height = 
        
        wait_btn.onclick = ()=>{
            window_maximized = true
        }

        // window.resizeTo(window.screen.availWidth, window.screen.availHeight)
        while(!window_maximized){
            window.scrollTo(0,0)

            if((window.outerWidth == window.screen.availWidth)&(window.outerHeight == window.screen.availHeight)){
                window_maximized = true
            }
            // console.log('window is maximized. innerWidth and innerHeight was measured')
            // console.log(window.outerWidth, window.innerWidth)
            await waiting(100)
        }

        innerWidth = window.innerWidth // change the global variables
        innerHeight = window.innerHeight
        wait_btn.remove()
        
        return
    }



    add_vars_handlers(){
        this.dragging = false
        this.mX
        this.mY
        this.update_mouse_posH = this.update_mouse_pos.bind(this)
        this.start_draggingH = this.start_dragging.bind(this)
        this.finish_draggingH = this.finish_dragging.bind(this)
        this.resize_cardH = this.resize_card.bind(this)
    }
    
    make_div(){

        document.body.appendChild(this.title)
        this.title.style.fontSize = '30px'
        this.title.style.position = 'absolute'
        this.title.style.left = '50%'
        this.title.style.transform = 'translate(-50%, 0%)'
        this.title.style.zIndex = 5
        this.title.innerHTML = '실험 준비 과정'

        this.b_div = document.createElement("div") // background div
        this.b_div.style = 'position : absolute; left : 0px; top: 0px; z-index:4; background-color:white;'
        this.b_div.style.width = '100%'
        this.b_div.style.height = '100%'
        
        document.body.appendChild(this.b_div)



        // create div, msg, info
        let div = document.createElement("div")
        this.div = div
        
        this.b_div.appendChild(div)

        div.style='position : absolute; left : 50%; top: 90%; transform: translate(-50%, -100%); z-index:4; background-color:white;' 
        div.style.width = '80%'
        div.style.height = '30%'
        div.style.overflow = 'scroll'
        div.style.border = '1px solid black'
        div.style.padding = '1%'
        div.style.lineHeight = '150%'


        let msg = document.createElement("P");
        this.msg = msg
        // msg.style = "position:absolute; font-size : 30px; transform: translate(-50%, -50%)"
        msg.style = 'font-size : 20px'
        this.div.appendChild(msg)
        msg.style.userSelect = 'none'
        
        msg.innerHTML = 'Click and drag the red rectangle at the lower right corner of the green rectangle until the green rectangle is the same size as a credit card held up to the screen. <br><br>'+
        "You can use any card that is the same size as a credit card, like a membership card or driver's license. <br><br>" + 
        'If you do not have access to a real card you can use a ruler to measure the image width to 3.37 inches or 85.6 mm.'

        msg.innerHTML = '0) 크롬 브라우저로 접속해주세요 (사파리 사용 불가) <br><br> 1) 가장 먼저 인터넷 창을 최대화 시켜주세요 <br><br> 2) 신용카드의 왼쪽 상단 모서리를 회색 직사각형의 왼쪽 상단에 맞춰서 모니터에 대주세요 <br><br> 3) 그 후 회색 직사각형의 오른쪽 아래 모퉁이의 빨간색 사각형을 드래그하여 회색 직사각형의 크기가 실제 신용카드의 크기와 같아지도록 드래그해주세요<br>'+
        "신용카드가 없다면 그와 동일한 사이즈의 어떤 카드라도 상관 없습니다.<br>" + 
        '만약 어떤 종류의 카드도 없다면, 자를 이용해 회색 사각형의 가로길이가 8.56 cm가 되도록 크기를 조절해 주세요'


        msg.draggable = false

        this.btn_card = document.createElement("button")
        this.btn_card.innerHTML = "Next";
        this.btn_card.type  = 'button'
        document.body.appendChild(this.btn_card);
        this.btn_card.style.fontSize = '30px'
        this.btn_card.style.width = '100px'
        this.btn_card.style.height = '50px'
        this.btn_card.style.cursor = 'pointer'
        this.btn_card.style.userSelect = 'none'

        this.btn_card.style.position = 'absolute'
        this.btn_card.style.left = '50%'
        this.btn_card.style.top = '90%'
        this.btn_card.style.transform = 'translate(-50%, 0%)'
        this.btn_card.style.zIndex = 5

        this.b_div.style.visibility = 'hidden'
        
    }


    async img_setting(){
        this.b_div.appendChild(this.card)
        this.b_div.appendChild(this.card2)

        this.b_div.appendChild(this.mov_rect)

        this.mov_rect.style = 'position: absolute; visibility: hidden; z-index:6; left: 0px, top : 0px'
        this.mov_rect.style.transform = 'translate(-50%, -50%)'
        this.mov_rect.style.backgroundColor = 'rgb(255, 0, 0)'
        this.mov_rect.style.width = '30px'
        this.mov_rect.style.height = '30px'
        
        this.mov_rect.draggable = false

        this.card.style = 'position: absolute; visibility: hidden; z-index:5;'
        this.card.style.backgroundColor = 'rgb(128,128,128)'
        this.card.style.left = this.left_pos + 'px'
        this.card.style.top = this.top_pos + 'px'
        this.card.style.width = `${this.cardWidth}px`
        this.card.style.height = `${this.cardWidth*this.card_ratio}px`
        this.card.draggable = false

        this.card2.style = 'position: absolute; visibility: hidden; z-index:5;'
        this.card2.style.backgroundColor = 'rgb(0,0,0,0)'
        this.card2.style.left = this.left_pos - 2 + 'px'
        this.card2.style.top = this.top_pos - this.lPad + 'px'
        this.card2.style.width = `${this.cardWidth}px`
        this.card2.style.height = `${this.cardWidth*this.card_ratio + this.lPad*2}px`
        
        this.card2.style.borderLeft = '2px dashed black'
        this.card2.style.borderRight = '2px dashed black'
        this.card2.draggable = false

        this.mov_rect.style.left = this.cardWidth +  this.left_pos + 'px'
        this.mov_rect.style.top = this.cardWidth*this.card_ratio + this.top_pos + 'px'
        this.mov_rect.style.cursor = 'nwse-resize'

    }

    update_mouse_pos(e){
        this.mX = e.pageX
        this.mY = e.pageY
    }

    start_dragging(e){
        this.dragging = true
        this.update_mouse_pos(e)
        document.addEventListener('mousemove', this.update_mouse_posH, false)
        this.resize_cardH()
        document.body.style.cursor = 'nwse-resize'

        // console.log('start_dragging')
    }

    finish_dragging(){
        this.dragging = false
        document.removeEventListener('mousemove', this.update_mouse_posH)
        document.body.style.cursor = ''
    }

    resize_card(){
        if(this.dragging){
            this.cardWidth = this.mX - this.left_pos
            this.card.style.width = `${this.cardWidth}px`
            this.card.style.height = `${this.cardWidth*this.card_ratio}px`

            this.card2.style.width = `${this.cardWidth}px`
            this.card2.style.height = `${this.cardWidth*this.card_ratio + this.lPad*2}px`

            this.mov_rect.style.left = this.mX + 'px'
            this.mov_rect.style.top = (this.mX - this.left_pos) * this.card_ratio + this.top_pos + 'px'
            this.iF = window.requestAnimationFrame(this.resize_cardH)
        }else{
            // console.log('dragging stopped')
        }
    }

    async start_resizing(){
        
        
        this.add_vars_handlers()
        this.make_div()
        this.img_setting()
        document.body.style.zoom = '100%'
        
        this.b_div.style.visibility = 'visible'
        this.btn_card.style.visibility = 'visible'

        this.card.style.visibility = 'visible'
        this.card2.style.visibility = 'visible'
        this.mov_rect.style.visibility = 'visible'

        this.mov_rect.addEventListener('mousedown',this.start_draggingH, false)
        document.addEventListener('mouseup', this.finish_draggingH, false)

        return new Promise((resolve) =>{
            this.btn_card.onclick = ()=>{
                this.mov_rect.removeEventListener('mousedown',this.start_draggingH, false)
                document.removeEventListener('mouseup', this.finish_draggingH, false)
                this.card.style.visibility = 'hidden'
                this.card2.style.visibility = 'hidden'

                this.mov_rect.style.visibility = 'hidden'
                this.btn_card.onclick = null
                this.btn_card.style.visibility = 'hidden'
                this.result['card_pixel'] = [this.cardWidth, this.cardWidth*this.card_ratio]
                this.result['pixels_per_cm'] = this.result['card_pixel'][0]/8.56
                
                this.b_div.style.visibility = 'hidden'
                this.msg.innerHTML = ''

                // remove all component
                this.msg.remove()
                this.card.remove()
                this.card2.remove()
                this.mov_rect.remove()
                this.btn_card.remove()
                this.b_div.remove()
                this.title.remove()

                resolve()
            }
        })
    }
}



class Noise_circle{
    constructor(rad, blur = 4, parent = document.body){
        let canvas = document.createElement('canvas')
        canvas.width = Math.round(rad)*2
        canvas.height = Math.round(rad)*2
        
        this.blur = blur
        this.canvas = canvas
        
        let canvas_vis = document.createElement('canvas')
        canvas_vis.width = Math.round(rad)*6
        canvas_vis.height = Math.round(rad)*6
        parent.appendChild(canvas_vis)
        canvas_vis.style.position = 'absolute'
        canvas_vis.style.transform = 'translate(-50%, -50%)'
        canvas_vis.style.left = '50%'
        canvas_vis.style.top = '50%'
        
        canvas_vis.style.zIndex = 2
        // canvas_vis.style.borderRadius = '50%'

        this.canvas_vis = canvas_vis
        this.hide_noise()
        this.update_noise()

    }

    set_center(x,y){
        this.canvas_vis.style.left = `${x}px`
        this.canvas_vis.style.top = `${y}px`
    }

    update_noise(){
        let w = this.canvas.width
        let h = this.canvas.height
        let ctx = this.canvas.getContext('2d')

        ctx.clearRect(0, 0, w, h)
        ctx.beginPath()
        ctx.globalCompositeOperation = 'source-over'
        
        let i,j,c
        let nStep1 = Math.floor(w/this.blur)
        let nStep2 = Math.floor(h/this.blur)
        for(i = 0; i<nStep1; i++){
            for(j = 0; j<nStep2; j++){
                c = Math.random()*255
                ctx.fillStyle = `rgb(${c}, ${c}, ${c})`
                ctx.fillRect(i*this.blur, j*this.blur, this.blur, this.blur)
            }
        }
        ctx.fill()
        ctx.globalCompositeOperation = 'destination-in'
        ctx.arc(w/2, h/2, w/2, 0, Math.PI*2)
        ctx.fill()


        let ctx2 = this.canvas_vis.getContext('2d')
        ctx2.clearRect(0,0,  this.canvas_vis.width,  this.canvas_vis.height)
        ctx2.filter = `blur(${this.blur}px)`
        ctx2.drawImage(this.canvas, w, h)
    }

    show_noise(){
        this.canvas_vis.style.visibility = 'visible'
    }

    hide_noise(){
        this.canvas_vis.style.visibility = 'hidden'
    }
}


function draw_image(canvas, img, x, y, rot = 0, scale = [1,1], alpha = 1){
    let cx = img.width/2
    let cy = img.height/2

    let ctx = canvas.getContext('2d')
    ctx.globalAlpha = alpha;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.scale(scale[0], scale[1])
    ctx.drawImage(img, -cx, -cy, img.width, img.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}



class Interact_box{
    constructor(){
        this.fontSize = Math.round(window.screen.availHeight/ 40)
        this.make_div()
        this.div.innerHTML = 'wefewf<br>wefwef<br>dfwef<br>wefewf<br>werewf'

    }

    make_div(){

        let base = document.createElement('div')
        document.body.appendChild(base)
        base.style.position = 'absolute'
        base.style.transform = 'translate(-50%, 0%)'
        base.style.left = '50%';         base.style.top = '5%'
        base.style.width = '80%'
        base.style.height = '15%'
        base.style.zIndex = 3

        this.base = base

        let div = document.createElement('div')
        this.base.appendChild(div)
        div.style.position = 'absolute'
        div.style.transform = 'translate(0%, 0%)'
        div.style.left = '0%';         div.style.top = '0%'
        div.style.width = '100%'
        div.style.height = '100%'
        div.style.backgroundColor = 'white'

        div.style.border = '2px solid rgb(50, 50, 50)'
        div.style.fontSize = `${this.fontSize}px`
        div.style.overflow = 'auto'
        div.style.lineHeight = '130%'

        div.style.paddingTop = '0%'
        div.style.paddingLeft = '1%'
        div.style.paddingRight = '1%'

        this.div = div


        let btns = []
        for(let i = 0; i<3; i++){
            let btn = document.createElement('button')
            this.base.appendChild(btn)

            btn.style.position = 'absolute'
            btn.style.userSelect = 'none'
            btn.style.fontSize = `${this.fontSize}px`
            btn.style.width = `${this.fontSize * 5}px`
            btn.style.height = `${this.fontSize*1.5}px`
            btn.style.zIndex = 3
            btn.style.cursor = 'pointer'

            btns.push(btn)
        }

        
        this.btnCenter = btns[0]
        this.btnLeft = btns[1]
        this.btnRight = btns[2]

        this.btnCenter.style.transform = 'translate(-50%, 30%)'
        this.btnCenter.style.left = '50%' 
        this.btnCenter.style.top = '100%'
        this.btnCenter.innerHTML = 'Center'
        this.btnCenter.style.visibility = 'hidden'

        this.btnLeft.style.transform = 'translate(0%, 30%)'
        this.btnLeft.style.left = '0%' 
        this.btnLeft.style.top = '100%'
        this.btnLeft.innerHTML = 'Left'
        this.btnLeft.style.visibility = 'hidden'

        this.btnRight.style.transform = 'translate(-100%, 30%)'
        this.btnRight.style.left = '100%' 
        this.btnRight.style.top = '100%'
        this.btnRight.innerHTML = 'Right'
        this.btnRight.style.visibility = 'hidden'

        this.div.style.visibility = 'hidden'
        this.div.style.visibility = 'hidden'
    }

    async one_button(msg_content, btn_content = '다음', wait_time = 500){        
        this.div.innerHTML = msg_content
        let btn = this.btnCenter

        btn.innerHTML = btn_content

        this.base.style.visibility = 'visible'
        this.div.style.visibility = 'visible'
        await waiting(wait_time)
        btn.style.visibility = 'visible'

        let rs
        let pr = new Promise(resolve=>{rs = resolve})

        btn.onclick = ()=>{rs()}
        await pr
        btn.onclick = null
        this.div.style.visibility = 'hidden'
        btn.style.visibility = 'hidden'
        this.base.style.visibility = 'hidden'

        return

    }

    async two_button(msg_content, btn_content1 = '이전', btn_content2 = '다음', wait_time = 500){
        document.body.style.cursor = ''
        this.div.innerHTML = msg_content
        let btn1 = this.btnLeft
        let btn2 = this.btnRight
        btn1.innerHTML = btn_content1
        btn2.innerHTML = btn_content2

        this.base.style.visibility = 'visible'
        this.div.style.visibility = 'visible'
        await waiting(wait_time)
        btn1.style.visibility = 'visible'
        btn2.style.visibility = 'visible'
        
        let which_button = NaN
        let rs
        let pr = new Promise(resolve=>{rs = resolve})

        btn1.onclick = ()=>{which_button = 0; rs()}
        btn2.onclick = ()=>{which_button = 1; rs()}

        await pr
        btn1.onclick = null
        btn2.onclick = null
        this.div.style.visibility = 'hidden'
        btn1.style.visibility = 'hidden'
        btn2.style.visibility = 'hidden'
        this.base.style.visibility = 'hidden'

        return which_button
    }


    async two_button_hide(msg_content, btn_content1 = '이전', btn_content2 = '다음', wait_time = 500){
        document.body.style.cursor = ''
        this.div.innerHTML = msg_content
        let btn1 = this.btnLeft
        let btn2 = this.btnRight
        btn1.innerHTML = btn_content1
        btn2.innerHTML = btn_content2

        this.base.style.visibility = 'visible'
        this.div.style.visibility = 'visible'

        // await waiting(wait_time)
        // btn1.style.visibility = 'visible'
        // btn2.style.visibility = 'visible'
        
        let which_button = NaN
        let rs
        let pr = new Promise(resolve=>{rs = resolve})

        btn1.onclick = ()=>{which_button = 0; rs()}
        btn2.onclick = ()=>{which_button = 1; rs()}

        await pr
        btn1.onclick = null
        btn2.onclick = null
        this.div.style.visibility = 'hidden'
        btn1.style.visibility = 'hidden'
        btn2.style.visibility = 'hidden'
        this.base.style.visibility = 'hidden'

        return which_button
    }

}


function make_canvas(size = [800, 800], center = [500, 500], parent = document.body){

    let cvs = document.createElement('canvas')
    cvs.width = Math.round(size[0])
    cvs.height = Math.round(size[1])
    cvs.style.position = 'absolute'
    cvs.style.left = `${center[0]}px`
    cvs.style.top = `${center[1]}px`
    cvs.style.backgroundColor = 'rgb(128, 128, 128, 0)'
    cvs.style.zIndex = -1
    parent.appendChild(cvs)

    cvs.style.visibility = 'hidden'
    cvs.style.transform = 'translate(-50%, -50%) rotate(0deg)'

    return cvs
}








