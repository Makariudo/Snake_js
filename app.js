const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//variables

//vitesse sur x
vx = 10;
//vitesse sur y
vy = 0;

//pomme
let pommeX = 0;
let pommeY = 0;
//score
let score=0;
//bug direction
let bugDirection = false;

//stopGame
let stopGame = false;



//creation du snake tableau d'objet decale en x, 4 objets morceaux de seprent au début, la tete est le premier element du tableau
let snake = [{x:140, y:150},{x:130, y:150},{x:120, y:150},{x:110, y:150}]

function animation(){
    if(stopGame===true){
        return               //sort de la fonction anim si stopgame est true pour garder le dessin du serpent à la fin du game
    }
    else{
    setTimeout(function(){
        bugDirection = false;
        nettoieCanvas();
        dessinePomme();
        faireAvancerSerpent();
        
        
        dessineLeSerpent();
        //recursion créer une boucle qui est relancée toutes les 100ms, on nettoie le canavs, fait avancer le serpent, le dessine et on recommence
        animation();

    },100);}
}

animation();
creerPomme();


function nettoieCanvas(){
    ctx.fillStyle = "white";
    ctx.strokeStyle ="black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.strokeRect(0,0,canvas.width, canvas.height);
}


function dessineLesMorceaux(morceau) {
    
    ctx.fillStyle = "blue";
    ctx.strokeStyle = 'black';
    ctx.fillRect(morceau.x, morceau.y, 10,10); //rempli le rectangle avec les coord plus largeur hauteur
    ctx.strokeRect(morceau.x, morceau.y, 10,10); //le contour

}
function dessineLeSerpent() {
    snake.forEach(morceau => {
        dessineLesMorceaux(morceau);    //pour chaque Morceau dessine le serpent
    })
}


function faireAvancerSerpent() {
    const head = {x: snake[0].x + vx, y: snake[0].y + vy};
    snake.unshift(head);  //met une nouvelle tetequi a avancé
   

    if(finDuJeu()){
        snake.shift(head); //si fin du jeu, on enlève la tête en cours
        recommencer(); //relance le game
        stopGame= true;
        return;  //pour sortir de la fonction
    }

    const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;
   
    if (serpentMangePomme){
        score +=1;
        document.getElementById('score').innerHTML = score;
        creerPomme();  //crée une pomme si la tete du snake est sur la position de la pomme
    } else {
        snake.pop(); //supprime la queue du snake

    }  

}

dessineLeSerpent();

document.addEventListener('keydown', changerDirection);

function changerDirection(event) {
    //console.log(event);


    //eviter le bug
    if(bugDirection) return;  //si on tape une autre direction en moins de 100ms on sort de la fonction et on doit retenter la manip
    bugDirection = true; 
  
    const FLECHE_GAUCHE = 37;
    const FLECHE_HAUT = 38;
    const FLECHE_DROITE = 39;
    const FLECHE_BAS = 40;

    const direction = event.keyCode;

    const monter = vy === -10;   // cela va nous servir juste apres avec les if pour eviter de revenir en arriere avec le seprent
    const descendre = vy === 10;
    const adroite = vx === 10;
    const agauche = vx === -10;

    //
    if(direction===FLECHE_GAUCHE && !adroite) { vx= -10; vy = 0;} //on lui interdit d'aller à gauche si le serpent va deja à droite
    if(direction===FLECHE_HAUT && !descendre) { vx= 0; vy = -10;} //on lui interdit d'aller à gauche si le serpent va deja à droite
    if(direction===FLECHE_DROITE && !agauche) { vx= 10; vy = 0;} //on lui interdit d'aller à gauche si le serpent va deja à droite
    if(direction===FLECHE_BAS && !monter) { vx= 0; vy = 10;} //on lui interdit d'aller à gauche si le serpent va deja à droite

}

function  random() {

     return Math.round((Math.random() * 290) /10) * 10;   //290 pour qu'il soit bien dans le canvas 300*300 on fait un math round pour avoir que des dizaines en position 

}
function creerPomme(){
    pommeX= random();
    pommeY= random();

    snake.forEach(function(part){

        const serpentSurPomme = part.x == pommeX && part.y == pommeY; //si la pomme sur le serpent, on recrée une pomme

        if(serpentSurPomme){
            creerPomme();
        }
    })
}

function dessinePomme(){
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.beginPath();
    ctx.arc(pommeX +5, pommeY +5, 5, 0, 2* Math.PI); //cercle, +5 pour decaler l'origine du cercle et ainsi rentrer dans les trajectoires du serpent
    ctx.fill();
    ctx.stroke();

}

function finDuJeu() {
    
    let snakeSansTete = snake.slice(1,-1);  //on coupe la tete du snake pour verif si chaque moreceau n'est pas à la position de la tete

    let mordu = false;

    snakeSansTete.forEach(morceau => {
        if(morceau.x === snake[0].x && morceau.y===snake[0].y){
            mordu = true;
        }
    })

    const toucheMurGauche = snake[0].x <-1;
    const toucheMurDroite = snake[0].x > canvas.width - 10;
    const toucheMurTOP = snake[0].y <-1;
    const toucheMurBottom = snake[0].y > canvas.height -10;

    let gameOver = false;

    if (mordu || toucheMurGauche || toucheMurBottom || toucheMurTOP || toucheMurDroite) {
        gameOver = true;
    }
return gameOver
}

function recommencer(){
    const restart  = document.getElementById('recommencer'); //recupere la div
    restart.style.display = "block" //rend le display css block

    document.addEventListener('keydown', (e) => {
        if (e.keyCode ===32){
            document.location.reload(true); //on recharge la page si la barre espace est appuyée
        }
    })

}