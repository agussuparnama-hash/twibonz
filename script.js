const c=document.getElementById('canvas'),
x=c.getContext('2d');

const fr=new Image();
fr.src='frame.png';

let im=null;
let z=1;

// Posisi awal foto
let px=540;
let py=335;

// Area foto
const H={
    x:540,
    y:335,
    r:385
};

document.getElementById('foto').onchange=e=>{
    const f=e.target.files[0];
    if(!f) return;

    const r=new FileReader();
    r.onload=v=>{
        im=new Image();
        im.onload=draw;
        im.src=v.target.result;
    };
    r.readAsDataURL(f);
};

document.getElementById('zoom').oninput=e=>{
    z=+e.target.value;
    draw();
};

document.getElementById('nama').oninput=draw;

let drag=false,lx=0,ly=0;

c.onmousedown=e=>{
    drag=true;
    lx=e.offsetX;
    ly=e.offsetY;
};

window.onmouseup=()=>drag=false;

c.onmousemove=e=>{
    if(!drag) return;

    const s=c.width/c.clientWidth;

    px+=(e.offsetX-lx)*s;
    py+=(e.offsetY-ly)*s;

    lx=e.offsetX;
    ly=e.offsetY;

    draw();
};

fr.onload=draw;

function draw(){

    x.clearRect(0,0,1080,1080);

    if(im){

        x.save();

        x.beginPath();
        x.arc(H.x,H.y,H.r,0,Math.PI*2);
        x.clip();

        let sc=Math.max(840/im.width,840/im.height)*z;
        let w=im.width*sc;
        let h=im.height*sc;

        x.drawImage(im,px-w/2,py-h/2,w,h);

        x.restore();

    }

    if(fr.complete){
        x.drawImage(fr,0,0,1080,1080);
    }

    let t=(document.getElementById('nama').value||'NAMA PESERTA').toUpperCase();

    let sz=34;

    do{
        x.font=sz+"px Pacifico";
        if(x.measureText(t).width<520) break;
        sz--;
    }while(sz>20);

    x.textAlign='center';
    x.lineWidth=8;
    x.strokeStyle='#FFFFFF';
    x.fillStyle='#0B56B5';

    x.strokeText(t,540,540);
    x.fillText(t,540,540);
}

function downloadPNG(){
    draw();

    const a=document.createElement('a');
    a.href=c.toDataURL('image/png');
    a.download='Twibbon_MPLS.png';
    a.click();
}
