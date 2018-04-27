var myAudio = document.createElement('audio');
var myAudio = document.createElement("audio");
myAudio.src = "bgm1.mp3";
myAudio.play();

var tunnels = new Array(),rocks = new Array();
var shift_factr = 0,cam_angle = 0,count_way = MAX,flag_way = 0,controls = [];
var accelrtn = 0.0, velocity = 15,MAX = 30,player_cord = [0,0,0],key = 38;
var play_speed = 1, level = 1, score = 0,speedy = 0.0,plyr_ht = -1;
main();


function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');


  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  var then = 0;
  programInfo_v = colorShader(gl);
  programInfo_t = textureShader(gl);

  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    document.getElementById('level').innerHTML = level;
    document.getElementById('distance').innerHTML = Math.floor(score);

    collision_check(deltaTime);
    tick_elements(gl);
    keyboard_controls();

    drawScene(gl, programInfo_v, programInfo_t, deltaTime);
    requestAnimationFrame(render);
  }

  texture = {
    'brick': loadTexture(gl, './textures/brick.jpg'),
    'white': loadTexture(gl, './textures/white.jpeg'),
    'fire': loadTexture(gl, './textures/fire.jpeg'),
  };

  tunnel_create(gl);
  requestAnimationFrame(render);
}


function tick_player() {
  plyr_ht += speedy;
  if(plyr_ht < -1)
    {
      plyr_ht = -1;
      speedy = 0;
    }
  if(speedy!=0)
    speedy -= 0.01;

  score = -player_cord[2];
  if(score>level*400)
    {
      level+=1;
      play_speed+=0.5;
    }
  var leng = tunnels.length;
  for(let i=0;i<leng;i++) {
    var tunl_len = tunnels[i].len;
    var tunl_trans = tunnels[i].translate;
    tunl_z = tunnels[i].pos[2];
    if(player_cord[2] > tunl_z - tunl_len)
    if(tunl_z > player_cord[2]){
      var diff = tunnels[i].pos[2] - player_cord[2];
      var temp = ((tunnels[i].pos[2] - player_cord[2])*tunl_trans)/tunl_len;
      player_cord[0] = temp+tunnels[i].pos[0];
      player_cord[1] = tunnels[i].pos[1];
      cam_angle = Math.atan(tunl_trans/tunl_len);
      break;
    }
  }
}

function collision_check(deltaTime) {
  leng = rocks.length;
  pos = velocity*deltaTime;
  for(i=0;i<leng;i++)
    if(rocks[i].detect_collision(player_cord[2],accelrtn,pos))
      player_cord[2]+=4,velocity=0;
}

function keyboard_controls() {
  if(controls[key])
    player_cord[2] = player_cord[2]- 0.25;
  if(controls[key+2])
    player_cord[2] = player_cord[2]+ 0.25;
  if(controls[key-1])
    accelrtn = accelrtn- 5;
  if(controls[key+1])
    accelrtn = accelrtn + 5;
  if(controls[key-6])
    speedy = 0.1;
}

function tunnel_create(gl) {
  cord_x = 0,cord_y = 0,cord_z = 0;
  cordinates = [],translate = []
  diff = 0.002;

  for(let i=0;i<100;i++) {
    cordinates.push([cord_x,cord_y,cord_z]);

    if(count_way >= 2 )
      shift_factr += diff*flag_way;
    else {
      count_way = MAX;
      rand = Math.random()*117;
      temp_flag = Math.floor(rand)%3;
      flag_way = temp_flag-1;
    }

    translate.push(shift_factr);
    count_way-=1;

    cord_x += shift_factr;
    cord_z -= 1;

    if(diff*200<Math.abs(shift_factr))
      flag_way*=-1;
  }
  var i;
  for(i=0;i<100;i++)
  {
    new_tunl = new Tunnel(gl, 1, cordinates[i], 'white', translate[i], 2, 1);
    tunnels.push(new_tunl);
  }
}

//
// Draw the scene.
//
function drawScene(gl, programInfo_v, programInfo_t, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  const viewMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
  pos = deltaTime*velocity;
  // Calculating Look Vector
  r = 1;
  var1 = Math.sin(accelrtn*Math.PI/180);
  var2 = Math.cos(accelrtn*Math.PI/180);
  var3 = Math.sin(cam_angle);
  var4 = Math.cos(cam_angle);
  const eye = [-plyr_ht*var1+player_cord[0],player_cord[1]+plyr_ht*var2,player_cord[2]];
  const look = [-plyr_ht*var1+var3+player_cord[0],player_cord[1]+plyr_ht*var2,player_cord[2]-var4];
  const up = [-var1,var2,0];
  mat4.lookAt(viewMatrix, eye, look, up);

  for(i=0;i<tunnels.length;i++)
    tunnels[i].draw(gl, programInfo_t,projectionMatrix, viewMatrix);

  for(i=0;i<rocks.length;i++)
    rocks[i].draw(gl, programInfo,projectionMatrix, viewMatrix);

  player_cord[2] = player_cord[2] - play_speed*pos;
}

function tick_elements(gl) {
  tunnel_expand(gl);
  tick_player();
  leng = rocks.length;
  for(let i=0;i<leng;i++) {
    rocks[i].tick();
  }
}

window.onkeydown = function(e) {
   controls[e.keyCode] = true;
 }

window.onkeyup = function(e) {
   controls[e.keyCode] = false;
 }

 function tunnel_expand(gl) {
   leng = tunnels.length;
   for(i=0;i<tunnels.length;i++) {
     tunl_len = tunnels[i].len;
     tunl_z = tunnels[i].pos[2];
     if(player_cord[2]<tunl_z-4*tunl_len){
       tunnels.shift();

       diff = 0.002;
       val = 2;
       type = 'white';

       if(count_way >= 1)
       {
         shift_factr += diff*flag_way;
       }

       else {
         count_way = MAX;
         rand = Math.random()*117;
         temp_flag = Math.floor(rand)%3;
         flag_way = temp_flag-1;
       }
       if(diff*100<Math.abs(shift_factr)){
         flag_way*=-val/2;
       }
       var latest_pos = tunnels[tunnels.length-1].pos;

       rand = Math.random()*4;
       temp_flag = Math.floor(rand)%4;
       if(temp_flag == 0)
         type = 'brick';

       pos = [tunnels[tunnels.length-1].translate+latest_pos[0],latest_pos[1],latest_pos[2]-tunnels[tunnels.length-1].len];
       new_tunl = new Tunnel(gl,1,pos,type,shift_factr,tunnels[tunnels.length-1].breadth,tunnels[tunnels.length-1].len);
       tunnels.push(new_tunl);

       rand = Math.random()*59;
       temp_flag = Math.floor(rand)%59;
       if(temp_flag == 0){
         rand = Math.random()*343;
         temp_flag1 = Math.floor(rand)%10000000;
         pos = [tunnels[tunnels.length-1].translate+latest_pos[0],latest_pos[1],latest_pos[2]-tunnels[tunnels.length-1].len];
         var wdth = tunnels[tunnels.length-1].breadth;
         var rnd = Math.random()*100;
         new_rock = new Rock(level-1,gl,'fire',pos,temp_flag1,wdth/3,2*wdth,rnd);
         rocks.push(new_rock);
       }
     }
 }
}
