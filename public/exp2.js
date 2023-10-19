let PPC = 35

// basic configurations
let cfg = {
    'oris':[...Array(18).keys()].map(x => x*10 + 5),
    'nBlock': 8,
    'nTrial': 50,
    
    'CPC':0.4,
    'gaussSig' : 2,
    'locDiff' : 10,
    'cenDiff' : 2,

    'yCen' : -5,
    'xCen' : 12

}

cfg.nBlock = 8
cfg.nTrial = 40

let scaling_task = false

class report_keyboard{
    constructor(Keys, scale = 10){
        this.keys = Keys
        this.scale = scale

        this.kdb = this.kd.bind(this)
        this.kub = this.ku.bind(this)
        this.rotateb = this.rotate.bind(this)

        this.spdlmt = Math.round(3 * this.scale)
        this.spdInc = Math.round(0.05 * this.scale)

        this.pressedKey = -1

        this.confirmed = console.log
        this.line = {'style':{'visibility' : 'visible', 'transform':NaN}}
        this.reportBg = {'style':{'visibility' : 'visible', 'transform':NaN}}

        this.angle = 0
        
        this.add_listener()
    }

    add_listener(){
        document.body.addEventListener('keydown', this.kdb)
        document.body.addEventListener('keyup', this.kub)
    }
    
    kd(e){
        if(this.pressedKey != this.keys.indexOf(e.code)){
            this.spd = 0
            this.pressedKey = this.keys.indexOf(e.code)
        }
    }

    ku(e){
        this.upKey = this.keys.indexOf(e.code)
        if(this.upKey == this.pressedKey) this.pressedKey = -1
    }

    rotate(){
        if(Date.now()<this.endTime){

            if(this.spd < this.spdlmt){
                this.spd += this.spdInc
            }else{
                this.spd = this.spdlmt
            }

            if(this.pressedKey == 0){
                this.angle -= this.spd*1
            }else if(this.pressedKey == 1){
                this.angle += this.spd*1
            }else if(this.pressedKey == 2){
                this.confirmTime = Date.now()
                this.endTime = 0
                this.confirmed()
            }

            this.line.style.transform = `translate(-50%, -50%) rotate(${this.angle/this.scale}deg)`
            window.requestAnimationFrame(this.rotateb)

        }else{
            this.confirmed()
        }
    }

    async report_ori(limit = 10000, init = 0){
        this.angle = init*this.scale

        this.line.style.transform = `translate(-50%, -50%) rotate(${this.angle/this.scale}deg)`
        this.line.style.visibility = 'visible'
        this.reportBg.style.visibility = 'visible'

        this.startTime = Date.now()
        this.endTime = this.startTime + limit
        this.confirmTime = NaN

        this.spd = 0
        
        let pr = new Promise(resolve =>{
            this.confirmed = resolve
        })

        this.rotate()
        await pr

        let x = Math.round(((((this.angle / this.scale)%180) + 360)%180) * 10)/10
        let result = {report: x, RT : this.confirmTime - this.startTime}
        this.line.style.visibility = 'hidden'
        this.reportBg.style.visibility = 'hidden'
        
        console.log(result)
        return result
    }
}


function make_report_obj(radi = 4, PPC = 35, color = 'rgb(80, 80, 80)'){

    let div= document.createElement('div')
    document.body.appendChild(div)
    div.style.position = 'absolute'
    div.style.width = `${Math.round(radi * PPC * 2.5)}px`
    div.style.height = `${Math.round(radi * PPC * 2.5)}px`
    div.style.transform = 'translate(-50%, -50%)'

    div.style.left = '50%'
    div.style.top = '30%'

    console.log(div)

    let obj = document.createElement('canvas')
    div.appendChild(obj)
    // obj.style.backgroundColor = 'rgba(0,0,0,0)'
    obj.style.position = 'absolute'
    obj.style.left = '50%'
    obj.style.top = '50%'
    obj.style.transform = 'translate(-50%, -50%)'
    obj.width = Math.round(radi * PPC * 1.2)*2
    obj.height = Math.round(radi * PPC * 1.2)*2
    obj.style.visibility = 'hidden'

    let rad = Math.round(radi * PPC)
    let lineWidth = Math.round(radi * PPC * 0.05)
    let circleRad = Math.round(radi * PPC * 0.1)

    let ctx = obj.getContext('2d')
    ctx.fillStyle = color
    ctx.strokeStyle = color

    let cx = obj.width/2
    let cy = obj.height/2

    // ctx.beginPath()
    // ctx.lineWidth = lineWidth
    // ctx.arc(cx, cy, rad, 0, Math.PI*2)
    // ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx + rad, cy, circleRad,0, Math.PI*2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx - rad, cy, circleRad, 0, Math.PI*2)
    ctx.fill()

    let obj2 = document.createElement('canvas')
    div.appendChild(obj2)

    obj2.style.visibility = 'hidden'
    // obj.style.backgroundColor = 'rgba(0,0,0,0)'
    obj2.style.position = 'absolute'
    obj2.style.left = '50%'
    obj2.style.top = '50%'
    obj2.width = Math.round(radi * PPC * 1.2)*2
    obj2.height = Math.round(radi * PPC * 1.2)*2
    obj2.style.transform = 'translate(-50%, -50%)'

    let ctx2 = obj2.getContext('2d')
    ctx2.fillStyle = color
    ctx2.strokeStyle = color

    let cx2 = obj2.width/2
    let cy2 = obj2.height/2

    ctx2.beginPath()
    ctx2.lineWidth = lineWidth
    ctx2.arc(cx2, cy2, rad, 0, Math.PI*2)
    ctx2.stroke()

    
    return div
}


function make_fixation(PPC = 35){
    let col1 = 'rgb(0,0,0)'
    let col2 = 'rgb(128, 128, 128)'

    rad1 = Math.round(PPC * 0.2)
    rad2 = Math.round(PPC * 0.6)

    let fix = document.createElement('canvas')
    document.body.appendChild(fix)

    fix.style.position = 'absolute'
    fix.style.left = '50%'
    fix.style.top = '50%'
    fix.style.borderRadius = '50%'
    fix.style.transform = 'translate(-50%, -50%)'
    
    fix.width = rad2 * 2
    fix.height = rad2 * 2

    let cx = fix.width/2
    let cy = fix.height/2

    let ctx = fix.getContext('2d')

    // ctx.beginPath()
    // ctx.fillStyle = col1
    // ctx.arc(cx, cy, rad2, 0, Math.PI*2)
    // ctx.fill()
    
    // // draw lines
    // ctx.beginPath()
    // ctx.strokeStyle = col2
    // ctx.lineWidth = rad1 * 2
    // ctx.moveTo(0, cy)
    // ctx.lineTo(fix.width, cy)
    // ctx.moveTo(cx, 0)
    // ctx.lineTo(cx, fix.height)

    // ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = col1
    ctx.arc(cx, cy, rad1, 0, Math.PI*2)
    ctx.fill()

    return fix

}



class MG{
    constructor(PPC = 35, cfg = cfg){
        this.PPC = PPC
        this.canvas = document.createElement('canvas')
        this.canvas.style.borderRadius = '50%'

        // document.body.appendChild(this.canvas)

        // gabor configuration
        this.phases = [0, Math.PI/2, Math.PI, Math.PI/2*3]
        this.gaussSig = cfg.gaussSig
        this.CPC = cfg.CPC
        this.gaborContr = 30
        this.gaborBase = 64
        this.make_gabors()

        //noise configuration
        this.noiseRad = this.gbs[0].width/2
        this.noiseContr = 0
        this.noiseBase = 64
        this.unt = Math.ceil(this.PPC * .2)
        this.noise = document.createElement('canvas')
        this.update_noise()

        // blob configuration
        this.nBlob = 2
        this.blobContr = 50

    }


    make_gabors(){
        let gbs= []

        let PPC = this.PPC
        let phases = this.phases
        let gaussSig = this.gaussSig * PPC
        let CPP = this.CPC / PPC
        let contrast = this.gaborContr
        let baseBright = this.gaborBase
    
        let L = Math.round(gaussSig * 3.5)
        let vals = [...Array(2*L).keys()].map(x => x - L + 0.5)
    
        for(let iP = 0; iP< phases.length; iP++){
            let phase = phases[iP]
            let gb = document.createElement('canvas')
            gb.width = 2*L
            gb.height = 2*L
    
            document.body.appendChild(gb)
            let ctx = gb.getContext('2d')
            ctx.fillStyle = `rgb(${baseBright}, ${baseBright}, ${baseBright})`
            ctx.fillRect(0, 0, gb.width, gb.height)
    
            let x, y, g, c, col
            for(let i = 0; i< vals.length; i++){
                for(let j = 0; j< vals.length; j++){
                    x = vals[i]
                    y = vals[j]
    
                    if((x**2 + y**2) < (gaussSig*3)**2){
                        g = Math.exp(-(x**2 + y**2)/(gaussSig**2))
                        c = Math.cos(y*2*Math.PI*CPP + phase)
                        col = Math.round(g*c*contrast + baseBright)
                        ctx.fillStyle = `rgb(${col}, ${col}, ${col})`
                        ctx.fillRect(i, j, 1, 1)
                    }
                }
            }
    
            ctx.fill()

            // ctx.beginPath()
            // ctx.strokeStyle = 'rgb(0,0,0)'
            // ctx.lineWidth = Math.round(PPC * 0.2)
            // ctx.arc(L, L, gaussSig*2, 0, Math.PI*2)
            // ctx.stroke()

            gb.style.position = 'absolute'
            gb.style.visibility = 'hidden'
    
            gbs.push(gb)
        }
    
        this.gbs = gbs
    }

    update_noise(){

        let rad = Math.round(this.noiseRad / this.unt)
        let baseBright = this.noiseBase
        let contrast = this.noiseContr

        let w = rad * 2
        let h = rad * 2

        this.noise.width = w
        this.noise.height = h
        let ctx = this.noise.getContext('2d')

        let vals = [...Array(rad * 2).keys()].map(x => x - rad + 0.5)
        let rsq = (rad/2)**2

        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = `rgb(${baseBright}, ${baseBright}, ${baseBright})`
        ctx.fillRect(0, 0, w, h)
        let x, y, c
        for(let i = 0; i<w; i++){
            for(let j = 0; j<h ; j++){
                x = vals[i]; y = vals[j]
                if( x ** 2 + y**2 < rsq){
                    c = (Math.random()-0.5)*contrast*2 + baseBright
                    ctx.fillStyle = `rgb(${c}, ${c}, ${c})`
                    ctx.fillRect(i, j, 1, 1)
                }
            }
        }
        ctx.fill()
    }

    draw_noiseGB(destCanvas, ph = 0){
        let pad = this.gaussSig*PPC
        // this.update_noise() // update noise for every drawing

        let gb = this.gbs[ph]
        let noise = this.noise

        let canvas= this.canvas
        let ctx = canvas.getContext('2d')
        
        canvas.width = gb.width
        canvas.height = gb.height
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = 'source-over'
        ctx.filter = ''
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(gb, 0, 0)

        ctx.globalCompositeOperation = 'lighter'
        ctx.filter = `blur(${this.unt/2}px)`
        ctx.scale(this.unt, this.unt)

        ctx.drawImage(noise, 0, 0)
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        let canvas2 = destCanvas
        canvas2.width = canvas.width - pad * 2
        canvas2.height = canvas.width - pad * 2
        let ctx2 = canvas2.getContext('2d')

        ctx2.clearRect(0,0,canvas2.width, canvas2.height)
        ctx2.drawImage(canvas, pad, pad, canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height)

    }

    make_blob(){
        let contrast = this.blobContr
        let gaussSig = this.gaussSig * PPC / 6*2
        let baseBright = 128

        let L = Math.round(gaussSig * 3)
        let vals = [...Array(2*L).keys()].map(x => x - L + 0.5)

        let blob = document.createElement('canvas')
        blob.width = 2*L 
        blob.height = 2*L
        let ctx = blob.getContext('2d')

        let x, y, g, col
        for(let i = 0; i< vals.length; i++){
            for(let j = 0; j< vals.length; j++){
                x = vals[i]
                y = vals[j]

                if((x**2 + y**2) < (gaussSig*2.5)**2){
                    g = Math.exp(-(x**2 + y**2)/(gaussSig**2))
                    col = Math.round(g*contrast + baseBright)
                    ctx.fillStyle = `rgb(${col}, ${col}, ${col})`
                    ctx.fillRect(i, j, 1, 1)
                }
            }
        }
        ctx.fill()

        this.blob = blob
    }


    draw_blob(destCanvas){
        let blob = this.blob
        let canvas = destCanvas
        canvas.width = blob.width
        canvas.height = blob.height
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.drawImage(this.blob, 0, 0)
    }

}


let box, fixation, progress, fixationLabel
let S, d, gbs, report_obj, reportDiv, noise1, noise2, noise3
let locDiff, cenDiff, cue, middle
let cenDiffV

if ('scrollRestoration' in window.history) {
    console.log('dd')
    window.history.scrollRestoration = 'manual'
}

async function setup_experiment(){

    document.addEventListener('contextmenu', event => event.preventDefault());
    document.body.style.backgroundColor = 'rgb(128, 128, 128)'
    document.body.style.overflow = 'hidden'
    document.body.style.height = `${window.screen.availHeight}px`
    document.body.style.width = `${window.screen.availWidth}px`

    setTimeout(window.scrollTo(0,0), 300)

    // update cfg by screen size
    if(scaling_task){
        scaling = new Scaling_task()
        await scaling.start_resizing()
        PPC = scaling.result.pixels_per_cm
        console.log(PPC)
        await waiting(200)
    }
    
    // set up the experiment
    box = new Interact_box()
    reportDiv =  make_report_obj(rad = 2.5, PPC = 35)
    report_obj = new report_keyboard(['KeyF', 'KeyJ', 'Space'], 100)
    report_obj.line = reportDiv.children[0]    
    report_obj.reportBg = reportDiv.children[1]    

    S = new MG(PPC, cfg)

    box.base.style.width = '25%'
    box.base.style.height = '80%'

    box.base.style.transform = 'translate(-100%, 0%)'
    box.base.style.left = '95%'


    let makeCanvas = (parent = document.body) =>{
        let canvas  = document.createElement('canvas')
        parent.appendChild(canvas)
        canvas.style.position = 'absolute'
        canvas.style.visibility = 'hidden'
        canvas.style.left = '50%'
        canvas.style.top = '50%'
        canvas.style.borderRadius = '50%'
        canvas.style.transform = 'translate(-50%, -50%)'
        return canvas
    }

    let dw = Math.round(PPC * 30)
    let dh = Math.round(PPC * 30)
    
    d = document.createElement('div')
    document.body.appendChild(d)
    d.style.position = 'absolute'
    d.style.width = `${dw}px`
    d.style.height = `${dh}px`
    d.style.backgroundColor = 'rgba(128, 128, 128, 0)'
    d.style.left = '50%'
    d.style.top = '50%'
    d.style.transform = 'translate(-50%, -50%)'
    d.style.visibility = 'hidden'
    // d.style.borderRadius = '50%'

    gbs = [makeCanvas(d), makeCanvas(d), makeCanvas(d)]
    blobs = [makeCanvas(d), makeCanvas(d), makeCanvas(d)]

    S.make_blob()
    S.draw_blob(blobs[0])
    S.draw_blob(blobs[1])
    S.draw_blob(blobs[2])


    noise1 = new Noise_circle(S.gaussSig *2 * PPC, PPC* 0.2, d)
    noise2 = new Noise_circle(S.gaussSig *2 * PPC, PPC* 0.2, d)
    noise3 = new Noise_circle(S.gaussSig *2 * PPC, PPC* 0.2, d)

    fixation = make_fixation(PPC)
    fixation.style.left = '50%'
    fixation.style.top = '50%'

    fixationLabel = document.createElement('div')
    document.body.appendChild(fixationLabel)
    fixationLabel.style.position = 'absolute'
    fixationLabel.style.transform = 'translate(-50%, 150%)'
    
    fixationLabel.style.left = '20%'
    fixationLabel.style.top = '80%'
    fixationLabel.style.visibility = 'hidden'
    fixationLabel.innerHTML = '여기에 초점을 맞추세요'

    locDiff = Math.round(PPC * cfg.locDiff)
    cenDiff = Math.round(PPC * cfg.cenDiff)
    cenDiffV = Math.round(PPC * 2)*0

    cue = document.createElement('div')
    document.body.appendChild(cue)
    cue.style.position = 'absolute'
    cue.style.left = fixation.style.left
    cue.style.top = fixation.style.top
    cue.style.fontSize = `${PPC}px`
    cue.style.visibility = 'hidden'
    cue.style.transform = 'translate(-50%, -50%)'

    progress = document.createElement('div')
    document.body.appendChild(progress)
    progress.style.position = 'absolute'
    progress.style.left = '90%'; progress.style.top = '90%'
    progress.style.transform = 'translate(-100%, -100%)'
    // progress.style.fontSize = `${Math.round(PPC * .75)}px`
    progress.innerHTML = ''
}



function calculate_err(report, targ){
    let err = Math.round((((report - targ + 720 + 90) % 180 ) - 90) * 10)/10
    return err
}


let n1, n2, n3
async function run_oneTrial(relDir = -1, cue_both = -1, startTime = Date.now()){
    // let oriCand = cfg.oris
    // let nontarg = oriCand[Math.floor(Math.random()*oriCand.length)]

    let ori1 = Math.floor(Math.random()*180)
    let ori2 = Math.floor(Math.random()*180)
    let ori3 = Math.floor(Math.random()*180)

    if(cue_both == 0){
        ori3 = NaN
    }

    gbs[0].style.transform = `translate(-50%, -50%) rotate(${ori1}deg)`
    gbs[1].style.transform = `translate(-50%, -50%) rotate(${ori2}deg)`
    gbs[2].style.transform = `translate(-50%, -50%) rotate(${ori3}deg)`

    let cx = parseInt(d.style.width)/2
    let cy = parseInt(d.style.height)/2 + PPC*cfg['yCen']

    // noise repositioning
    noise1.update_noise()
    noise2.update_noise()
    noise3.update_noise()
    
    n1 = noise1.canvas_vis
    n2 = noise2.canvas_vis
    n3 = noise3.canvas_vis
    
    // let gcx = fixation.getBoundingClientRect().x + (fixation.width/2)
    let gcx = fixation.getBoundingClientRect().x + (fixation.width/2) 
    let gcy = fixation.getBoundingClientRect().y + (fixation.width/2)


    gbs[0].style.left = `${cx - locDiff}px`
    gbs[1].style.left = `${cx}px`
    gbs[2].style.left = `${cx + locDiff}px`

    gbs[0].style.top = `${cy}px`
    gbs[1].style.top = `${cy}px`
    gbs[2].style.top = `${cy}px`

    if(cue_both == 0){
        gbs[0].style.left = `${cx - locDiff*0.5}px`
        gbs[1].style.left = `${cx + locDiff*0.5}px`
    }

    n1.style.left = gbs[0].style.left
    n1.style.top = gbs[0].style.top
    n2.style.left = gbs[1].style.left
    n2.style.top = gbs[1].style.top
    n3.style.left = gbs[2].style.left
    n3.style.top = gbs[2].style.top
    
    for(let i = 0; i<gbs.length; i++ ){
        blobs[i].style.left = gbs[i].style.left
        blobs[i].style.top = gbs[i].style.top
    }

    d.style.left = `${gcx}px`
    d.style.top = `${gcy}px`

    reportDiv.style.left = fixation.style.left
    reportDiv.style.top = fixation.style.top

    // update noisy gabors
    let phase = Math.floor(Math.random()*4)
    S.draw_noiseGB(gbs[0], phase)
    phase = Math.floor(Math.random()*4)
    S.draw_noiseGB(gbs[1], phase)

    if(cue_both != 0){
        phase = Math.floor(Math.random()*4)
        S.draw_noiseGB(gbs[2], phase)
    }

    if(relDir == -1){
        // cue.innerHTML = '↑'
        cue.innerHTML = '<<'
    }else if(relDir == 1){
        // cue.innerHTML = '↓'
        cue.innerHTML = '>>'
    }

    let absLoc = Math.floor(cue_both*0.5 + relDir*0.5)
    if(absLoc == -1){
        targ = ori1
    }else if(absLoc==0){
        targ = ori2
    }else if(absLoc==1){
        targ = ori3
    }

    if(cue_both == -1){
        blobs[0].style.left = gbs[0].style.left
        blobs[1].style.left = gbs[1].style.left
    }else if(cue_both == 1){
        blobs[0].style.left = gbs[1].style.left
        blobs[1].style.left = gbs[2].style.left
    }else if(cue_both == 0){
        blobs[0].style.left = gbs[0].style.left
        blobs[1].style.left = gbs[1].style.left
    }

    await waiting(startTime - Date.now())

    fixation.style.visibility = 'visible'
    await waiting(700)
    
    d.style.visibility = 'visible'
    gbs[0].style.visibility = 'visible'
    gbs[1].style.visibility = 'visible'
    if(cue_both != 0){gbs[2].style.visibility = 'visible'}

    await waiting(500)
    gbs[0].style.visibility = 'hidden'
    gbs[1].style.visibility = 'hidden'
    gbs[2].style.visibility = 'hidden'
    d.style.visibility = 'hidden'

    n1.style.visibility = 'visible'
    n2.style.visibility = 'visible'
    if(cue_both != 0){n3.style.visibility = 'visible'}
    await waiting(500)
    n1.style.visibility = 'hidden'
    n2.style.visibility = 'hidden'
    n3.style.visibility = 'hidden'

    blobs[0].style.visibility = 'visible'
    blobs[1].style.visibility = 'visible'
    await waiting(500)
    blobs[0].style.visibility = 'hidden'
    blobs[1].style.visibility = 'hidden'

    await waiting(3000)

    fixation.style.visibility = 'hidden'
    cue.style.visibility = 'visible'
    await waiting(800)
    cue.style.visibility = 'hidden'
    fixation.style.visibility = 'visible'

    let report = await report_obj.report_ori(10000, Math.round(Math.random()*180))

    if(isNaN(report.RT)){
        fixationLabel.innerHTML = '입력이 늦었습니다..'
        fixationLabel.style.visibility = 'visible'
        await waiting(800)
        fixationLabel.style.visibility = 'hidden'
    }

    let err = calculate_err(report.report, targ)

    let result = {
        ori1: ori1,
        ori2: ori2,
        ori3: ori3,

        targ : targ,
        err : err,

        cue_both : cue_both,
        relDir : relDir,
        absLoc: absLoc,

        report : report.report,
        RT : report.RT,
    }

    return result
}




let show_msg = true
let err_stk, trial_result, result1
let transProb = 2/3

async function run_multiTrial(){
    setTimeout(window.scrollTo(0,0), 500)
    
    // await box.one_button('지금부터 본 실험을 시작합니다. 실험진행정도는 오른쪽 하단에 작게 표시됩니다.', '확인')

    for(let iBlock = 0; iBlock < cfg.nBlock; iBlock++){
        document.body.style.cursor = ''
        if(show_msg){
            await box.one_button('휴식 후 실험을 시작할 준비되셨으면 다음을 누르세요<br> 모니터에서 60cm 떨어진 상태에서 왼쪽 상단 과녁에 초점을 맞추고 진행해주세요', '다음')
        }

        let fx = fixation.getBoundingClientRect().x + fixation.getBoundingClientRect().width/2
        let fy = fixation.getBoundingClientRect().y + fixation.getBoundingClientRect().height/2
        fixationLabel.style.left = `${fx}px`
        fixationLabel.style.top = `${fy}px`

        fixationLabel.innerHTML = '이 근처에서 과녁이 나옵니다'
        fixationLabel.style.visibility = 'visible'
        await waiting(2000)
        fixationLabel.style.visibility = 'hidden'

        document.body.style.cursor = 'none'
        let targOri
        let relDir = -1
        let cue_both = 0

        err_stk = []
        // start trial
        for(let iTrial = 0; iTrial < cfg.nTrial; iTrial ++){

            progress.innerHTML = `Block : ${iBlock + 1} / ${cfg.nBlock}<br> Trial : ${iTrial + 1} / ${cfg.nTrial}`
            await waiting(800)
            
            if( (iTrial%2) == 0){
                cue_both = 0
            }else{
                cue_both = Math.round((Math.round(Math.random())-0.5)*2)
            }

            relDir =  Math.round((Math.round(Math.random())-0.5)*2)


            trial_result = await run_oneTrial(relDir, cue_both, Date.now()+500)
            
            console.log(trial_result.report)
            console.log(trial_result)

            result1 = {
                'block': iBlock + 1,
                'trial': iTrial + 1,
                ...trial_result
            }

            err_stk.push(Math.abs(trial_result.err))
            append_fxn(result1)
        } // end of trial

        document.body.style.cursor = ''
        let err_mean = Math.round(nanMean(err_stk)*10)/10
        await box.one_button(`평균 에러는 ${err_mean}도 입니다.`, '다음')

        if(((iBlock + 1)%5) == 0){
            await save_fxn()
        }
    } // end of block
    await save_fxn()
}

async function introduction(){

    let targLoc = -1
    let centerLoc = 1

    gbs[0].style.transform = `translate(-50%, -50%) rotate(${0}deg)`
    gbs[1].style.transform = `translate(-50%, -50%) rotate(${90}deg)`
    
    let cx = parseInt(d.style.width)/2
    let cy = parseInt(d.style.height)/2
    

    // let gcx = fixation.getBoundingClientRect().x + (fixation.width/2)
    let gcx = fixation.getBoundingClientRect().x + (fixation.width/2) 
    let gcy = fixation.getBoundingClientRect().y + (fixation.width/2) 
    gbs[0].style.top = `${cy + locDiff}px`
    gbs[1].style.top = `${cy - locDiff}px`
    d.style.left = `${gcx + cfg.xCen * PPC + centerLoc*cenDiffV}px`
    d.style.top = `${gcy + cfg.yCen * PPC + centerLoc*cenDiff}px`


    let n1, n2
    // noise repositioning
    noise1.update_noise()
    noise2.update_noise()
    n1 = noise1.canvas_vis
    n2 = noise2.canvas_vis
    n1.style.left = gbs[0].style.left
    n1.style.top = gbs[0].style.top
    n2.style.left = gbs[1].style.left
    n2.style.top = gbs[1].style.top


    // determine report position
    reportDiv.style.left = fixation.style.left
    reportDiv.style.top = fixation.style.top

    // update noisy gabors
    let phase = Math.floor(Math.random()*4)
    S.draw_noiseGB(gbs[0], phase)
    S.draw_noiseGB(gbs[1], phase)

    if(targLoc == -1){
        cue.innerHTML = '↑'
        // cue.innerHTML = '<<'
    }else if(targLoc == 1){
        cue.innerHTML = '↓'
        // cue.innerHTML = '>>'
    }


    let F = [
        [
            '지금부터 실험 설명을 시작합니다. 이 실험은 창을 최대화한 상태에서 눈과 모니터 사이가 60cm 떨어진 상태로 진행하는 실험입니다.',
            async ()=>{},
            async ()=>{}
        ],

        [
            '실험 진행 도중 절대로 창을 닫거나 새로고침 하지마세요. 참여 기록이 유실됩니다',
            async ()=>{
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
            },
            async ()=>{}
        ],

        [
            '이 실험은 두 개의 줄무늬의 방향을 기억했다가 그 중 하나의 (위쪽 혹은 아래쪽에 위치한) 방향을 보고하는 실험입니다. 단 줄무늬가 나타나는 시점에 왼쪽 상단의 과녁모양의 심볼에 초점을 맞춘 상태에서 이 줄무늬들을 관측하고 기억하셔야 합니다.',

            async ()=>{
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
                let fx = fixation.getBoundingClientRect().x + fixation.getBoundingClientRect().width/2
                let fy = fixation.getBoundingClientRect().y + fixation.getBoundingClientRect().height/2

                gbs[0].style.visibility = 'visible'
                gbs[1].style.visibility = 'visible'

                fixation.style.visibility = 'visible'
                fixationLabel.style.left = `${fx}px`
                fixationLabel.style.top = `${fy}px`
                fixationLabel.innerHTML= '이 점에 초점을 맞춰주세요'
                fixationLabel.style.visibility = 'visible'

            },
            async ()=>{
                fixation.style.visibility = 'hidden'
                fixationLabel.style.visibility = 'hidden'
                gbs[0].style.visibility = 'hidden'
                gbs[1].style.visibility = 'hidden'
            }
            
        ],

        [
            '시행이 시작되면 왼쪽 상단에 검은색의 과녁모양 심볼이 나타납니다. 이 과녁모양이 사라질때까지 이 과녁모양의 중앙에서 초점이 벗어나지 않게 해주셔야 합니다.',
            async ()=>{

                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'

                await waiting(1000)
                let fx = fixation.getBoundingClientRect().x + fixation.getBoundingClientRect().width/2
                let fy = fixation.getBoundingClientRect().y + fixation.getBoundingClientRect().height/2

                fixation.style.visibility = 'visible'
                fixationLabel.style.left = `${fx}px`
                fixationLabel.style.top = `${fy}px`
                fixationLabel.innerHTML= '이 점에 초점을 맞춰주세요'
                fixationLabel.style.visibility = 'visible'

            },

            async ()=>{
                fixation.style.visibility = 'hidden',
                fixationLabel.style.visibility = 'hidden'
            }
        ],

        [
            '잠시 후 오른쪽에 위 아래로 2개의 다른 방향을 가진 줄무늬가 나타납니다.<br> 위쪽 줄무늬의 각도와 아래쪽 줄무늬의 각도를 모두 기억해 주세요. 이 때 눈의 초점이 과녁을 벗어나 줄무니로 향하는 것을 최대한 억제해 주세요',
            async () =>{
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
                fixation.style.visibility = 'visible',
                fixationLabel.style.visibility = 'visible'
                gbs[0].style.visibility = 'visible'
                gbs[1].style.visibility = 'visible'
            },
            async () =>{
                fixation.style.visibility = 'hidden',
                fixationLabel.style.visibility = 'hidden'
                gbs[0].style.visibility = 'hidden'
                gbs[1].style.visibility = 'hidden'
            }
        ],


        [
            '줄무니가 사라지고 지저분한 패턴이 나와서 잔상을 제거합니다',
            async () =>{
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'

                fixation.style.visibility = 'visible',
                n1.style.visibility = 'visible'
                n2.style.visibility = 'visible'
            },
            async () =>{
                fixation.style.visibility = 'hidden',
                n1.style.visibility = 'hidden'
                n2.style.visibility = 'hidden'
            }
        ],

        [
            '잠시후 과녁모양이 사라지고 그 자리에 위쪽 혹은 아래쪽을 가리키는 화살표가 나와서 어느 위치에 있었던 모양을 보고해야 하는지 알려줍니다. "↑" 일 경우 위쪽 위치에 나왔던 줄무늬의 방향을 보고하시면 되고, "↓" 일 경우 아래쪽에 나타났던 줄무늬의 방향을 보고하시면 됩니다.',

            async () =>{
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
                cue.style.visibility = 'visible'
            },
            async () =>{
                cue.style.visibility = 'hidden'
            }
        ],


        [
            '이 후 큰 원과 두 개의 점이 나타납니다. 두 점의 위치를 잇는 가상의 선의 방향을 현재 기억하고있는 각도의 방향과 일치할때까지 회전 시킨 후 스페이스바를 누르시면 됩니다.<br> 두 점의 위치는 "F"키를 누르면 반시계 방향으로, "J"키를 누르면 시계방향으로 회전합니다. 이 선의 방향이 현재 기억하고 있던 줄무니의 방향과 일치할 때까지 회전시키신 후에 일치한다고 생각했을 때 "Space bar" 키를 누르면 됩니다.<br> 이전에 나왔던 화살표가 "↑" 였으므로 2개의 줄무늬중 위쪽에 있던 줄무늬의 방향인 수평방향으로 돌려서 space bar를 누르시면 됩니다.  지금 직접 시도해 보세요',
            async () =>{
                let report = await report_obj.report_ori(1000000, 45)
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
            },
            async () =>{
                report_obj.confirmed()
            },
        ],


        [
            '현재까지 설명드린것이 한번의 시행의 과정이며, 이러한 시행들이 계속 반복되는 구조를 가지고 있습니다. 실제 실험상황과 같이 진행해보겠습니다.',

            async () =>{
                box.btnLeft.innerHTML = '이전'
                box.btnRight.innerHTML = '해보기'
                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
            },
            async () =>{
            },
        ],


        [
            '연습을 시작합니다. 초점을 맞추고 진행해 주세요<br>선분을 움직이는 키 : F (반시계방향), J (시계방향), 입력 (space bar)',
            async () => {
                await waiting(1000)

                for(let iTrial = 0; iTrial < 3; iTrial ++){
                    await waiting(1000)
                    let result = await run_oneTrial(Math.random()*180, Math.sign(Math.random()-0.5), 1)
                    let err = result.err
                    fixationLabel.innerHTML=`방금 입력은 실제각도와 ${Math.round(Math.abs(err))}도만큼 차이가 있습니다.<br> 각도를 최대한 정확하게 기억해주세요!`                
                    fixationLabel.style.visibility = 'visible'
                    await waiting(3000)
                    fixationLabel.style.visibility = 'hidden'
                }

                box.div.innerHTML = '다음으로 진행하려면 다음을 눌러주세요'

                box.btnLeft.style.visibility = 'visible'
                box.btnRight.style.visibility = 'visible'
            },
            async () =>{
                report_obj.confirmed()
            },
        ],

        [
            '실험에선 이와 같은 시행이 반복 되며, 50번 마다 참여자분의 평균 수행도를 표기해 줍니다. 또한 그 때 휴식을 취할 수 있습니다. 실험에 대한 설명이 완료되었습니다. 이해가 되지 않는다면 다시하기를 눌러서 정보를 다시 확인해주세요',
            async () =>{
            },
            async () =>{}
        ]
    ]

    let N = F.length

    let introState = 0
    while(introState < N){
        let f = F[introState]
        console.log(f)
        if(introState == 0){
            f[1]()
            await box.one_button(f[0], '다음')
            introState = introState +1
        }else if(introState < (N-1)){
            f[1]()
            let btn = await box.two_button_hide(f[0], '이전', '다음', wait_time = 0)
            f[2]()
            if(btn == 0){
                introState = introState - 1
            }else if(btn == 1){
                introState = introState + 1
            }
        }else{
            let btn = await box.two_button(f[0], '다시하기', '완료', wait_time = 500)
            if(btn == 0){
                introState = 0
            }else if(btn == 1){
                introState = introState + 1
            }
        }
    }
}

function complete_experiment(){
    document.location.href = '/complete.html'
}


async function run_exp(){
    await setup_experiment()
    await introduction()
    // console.log('intro finished')
    await run_multiTrial()
    complete_experiment()
}

async function run_test(){
    await setup_experiment()
    // await introduction()
    await run_multiTrial()
    document.location.href = 'http://www.google.com'
}