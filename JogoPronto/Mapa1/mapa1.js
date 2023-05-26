var tabuleiro;
var x;
var y;
var tamQuadrados;
var canvas;
var ctx;
var chaveEncontrada;
var portaFechada;
var interagir;
var bossx;
var bossy;
var bossAtivo;
var bossDirecao;
var bossVelocidade;
var bossInterval;
var vidas;

tabuleiro = [
  ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
  ["*", "@", " ", "*", ">", " ", " ", " ", "*", " ", " ", " ", " ", "O", "*"],
  ["*", " ", " ", "*", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", "*", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", "*", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", "*", "D", "*", "*", "*", "*", "D", "*", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", "##", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", " ", " ", "#", "@", " ", "D", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", " ", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", " ", " ", " ", " ", " ", "*", " ", " ", " ", " ", " ", "*"],
  ["*", "*", "*", "*", " ", " ", "*", "D", "*", "*", "*", "*", "*", "*", "*"],
  ["*", "+", " ", "*", " ", " ", "*", " ", " ", " ", " ", " ", " ", " ", "*"],
  ["*", " ", " ", "*", " ", " ", "*", " ", " ", " ", " ", " ", " ", " ", "*"],
  ["*", "<", " ", "*", " ", " ", "*", " ", " ", " ", " ", " ", " ", " ", "L"],
  ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
];

// VARIAVEIS GERAIS
chaveEncontrada = false;
portaFechada = true;
x = 1;
y = 1;
interagir = false;
tamQuadrados = 40;

// VARIAVEIS BOSS
bossAtivo = false;
bossDirecao = 2;
bossx = 8;
bossy = 6;
bossVelocidade = 10000;

vidas = 3;

canvas = document.getElementById("jogo");
ctx = canvas.getContext("2d");

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 87) {
    // W
    if (
      (tabuleiro[y - 1][x] !== "*" &&
        tabuleiro[y - 1][x] !== "D" &&
        !chaveEncontrada) ||
      (tabuleiro[y - 1][x] !== "*" && chaveEncontrada)
    ) {
      y--;
      verificarChave();
    }
  } else if (event.keyCode === 83) {
    // S
    if (
      (tabuleiro[y + 1][x] !== "*" &&
        tabuleiro[y + 1][x] !== "D" &&
        !chaveEncontrada) ||
      (tabuleiro[y + 1][x] !== "*" && chaveEncontrada)
    ) {
      y++;
      verificarChave();
    }
  } else if (event.keyCode === 65) {
    // A
    if (
      (tabuleiro[y][x - 1] !== "*" &&
        tabuleiro[y][x - 1] !== "D" &&
        !chaveEncontrada) ||
      (tabuleiro[y][x - 1] !== "*" && chaveEncontrada)
    ) {
      x--;
      verificarChave();
    }
  } else if (event.keyCode === 68) {
    // D
    if (
      (tabuleiro[y][x + 1] !== "*" &&
        tabuleiro[y][x + 1] !== "D" &&
        !chaveEncontrada) ||
      (tabuleiro[y][x + 1] !== "*" && chaveEncontrada)
    ) {
      x++;
      verificarChave();
    }
  } else if (event.keyCode === 49) {
    // Tecla 1
    interagir = true;
    verificarInteracao();
  }
});

function verificarChave() {
  if (tabuleiro[y][x] === "@" && !chaveEncontrada) {
    chaveEncontrada = true;
    tabuleiro[y][x] = " ";
    alert("Você encontrou uma chave!");
  } else if (tabuleiro[y][x] === "D") {
    if (chaveEncontrada) {
      tabuleiro[y][x] = "=";
      portaFechada = false;
      alert("Parabéns, você escapou!");
    } else {
      desenharTabuleiro();
      return;
    }
  }

  // ESPINHO
  if (tabuleiro[y][x] === "#") {
    --vidas;
    alert(`Você morreu! Você agora tem ${vidas} Restantes`);
    reiniciarJogo();
    return;
  }

  // TELEPORTE IDA
  if (tabuleiro[y][x] === ">") {
    alert("Você foi teleportado!");
    y = 13;
    x = 2;
  }

  // TELEPORTE VOLTA
  if (tabuleiro[y][x] === "<") {
    alert("Você foi teleportado!");
    y = 1;
    x = 5;
  }

  // VIDA EXTRA
  if (tabuleiro[y][x] === "+") {
    vidas++;
    tabuleiro[y][x] = " ";
    alert(`Você ganhou uma vida extra! Agora restam ${vidas} vidas`);
  }

  // PASSAR DE MAPA
  if (tabuleiro[y][x] === "L") {
    redirecionarParaOutroMapa();
  }

  // TELA DE DERROTA
  if (vidas == 0) {
    window.location.href = "/JogoPronto/Telas/indexDerrota.html";
  }

  desenharTabuleiro();
}

// REDIRECIONA PRA OUTRO MAPA
function redirecionarParaOutroMapa() {
  window.location.href = "/JogoPronto/Mapa2/mapa2.html";
}

// FUNÇÃO DO BOTÃO
function verificarInteracao() {
  if (tabuleiro[y][x] === "O" && interagir) {
    alert("Foi ser curioso e liberou o CASSEB!");
    bossAtivo = true;
    bossx = 10;
    bossy = 5;
    moverBossAutomaticamente();
    clearInterval(bossInterval);
  }
}

// VERIFICA SE O JOGADOR FOI PEGO PELO BOSS
function verificarBoss() {
  if (y === bossy && x === bossx && bossAtivo == true) {
    --vidas;
    alert(`Você foi pego pelo Casseb! Agora você só tem ${vidas} Restantes`);
    reiniciarJogo();
    return;
  }
}

// ATIVA O BOSS
function ativarBoss() {
  bossAtivo = true;
}

// MOVER AUTOMATICAMENTE O BOSS
function moverBossAutomaticamente() {
  moverBoss();
  desenharTabuleiro();
}

// FUNÇÃO DE MOVER O BOSS
function moverBoss() {
  if (bossAtivo) {
    bossx += bossDirecao;
    if (bossx === 12) {
      bossDirecao = -1;
    } else if (bossx === 6) {
      bossDirecao = 1;
    }
  }
}

function desenharTabuleiro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < tabuleiro.length; i++) {
    for (var j = 0; j < tabuleiro[i].length; j++) {
      //PAREDE
      if (tabuleiro[i][j] === "*") {
        ctx.fillStyle = "black";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("*", j * tamQuadrados, (i + 1) * tamQuadrados);

        //CHAVE
      } else if (tabuleiro[i][j] === "@") {
        ctx.fillStyle = "yellow";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("@", j * tamQuadrados, (i + 1) * tamQuadrados);

        //PORTA ABERTA
      } else if (tabuleiro[i][j] === "=") {
        ctx.fillStyle = "green";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("=", j * tamQuadrados, (i + 1) * tamQuadrados);

        //PORTA FECHADA
      } else if (tabuleiro[i][j] === "D") {
        ctx.fillStyle = "red";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("D", j * tamQuadrados, (i + 1) * tamQuadrados);

        //ESPINHO
      } else if (tabuleiro[i][j] === "#") {
        ctx.fillStyle = "purple";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("#", j * tamQuadrados, (i + 1) * tamQuadrados);

        //BOTAO
      } else if (tabuleiro[i][j] === "O") {
        ctx.fillStyle = "#97fb57";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("O", j * tamQuadrados, (i + 1) * tamQuadrados);

        // LETRA PARA PASSAR MAPA
      } else if (tabuleiro[i][j] === "L") {
        ctx.fillStyle = "orange";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("L", j * tamQuadrados, (i + 1) * tamQuadrados);

        // BOSS CASSEB
      } else if (i === bossy && j === bossx && bossAtivo) {
        ctx.fillStyle = "#ff2483";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("$", bossx * tamQuadrados, (bossy + 1) * tamQuadrados);
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(
          "Casseb",
          (bossx - 0.3) * tamQuadrados,
          (bossy + 0.1) * tamQuadrados
        );

        // VIDA EXTRA
      } else if (tabuleiro[i][j] === "+") {
        ctx.fillStyle = "PaleVioletRed";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("+", j * tamQuadrados, (i + 1) * tamQuadrados);

        // TELEPORTE IDA
      } else if (tabuleiro[i][j] === ">") {
        ctx.fillStyle = "#ff2483";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText(">", j * tamQuadrados, (i + 1) * tamQuadrados);

        // TELEPORTE VOLTA
      } else if (tabuleiro[i][j] === "<") {
        ctx.fillStyle = "#ff2483";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("<", j * tamQuadrados, (i + 1) * tamQuadrados);
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(
          j * tamQuadrados,
          i * tamQuadrados,
          tamQuadrados,
          tamQuadrados
        );
      }

      // PERSONAGEM
      if (i === y && j === x) {
        ctx.fillStyle = "#42e2b8";
        ctx.font = "bold " + tamQuadrados + "px sans-serif";
        ctx.fillText("&", x * tamQuadrados, (y + 1) * tamQuadrados);
      }
    }
  }
}

// REINICIA O JOGO
function reiniciarJogo() {
  x = 1;
  y = 1;
  chaveEncontrada = false;
  portaFechada = true;
  bossAtivo = false;
  desenharTabuleiro();
}

// LOOP DO JOGO
function loop() {
  desenharTabuleiro();
  verificarBoss();
  moverBossAutomaticamente();
  requestAnimationFrame(loop);
}

loop();
