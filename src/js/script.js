let seuVotoPara = document.querySelector(".tela-left-1 span");
let cargo = document.querySelector(".tela-left-2 span");
let cargoCenter = document.querySelector(".tela-left-2");
let numeros = document.querySelector(".tela-left-3");
let descricao = document.querySelector(".tela-left-4");
let aviso = document.querySelector(".lower");
let lateral = document.querySelector(".tela--right");

let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votoNulo = false;
let votos = [];

let botao = document.querySelector(".botao");
let opcoesDeVoto = document.querySelector(".gostosas");

const music = document.querySelector(".audioTecla");

function toggleMenu() {
  if (opcoesDeVoto.style.height == "0px" || opcoesDeVoto.style.height == "") {
    opcoesDeVoto.style.height = "270px";
    botao.innerHTML = "▴ Gostosas ▴";
  } else {
    opcoesDeVoto.style.height = "0px";
    botao.innerHTML = "▾ Candidatas ▾";
  }
}

function iniciarEtapa() {
  let etapa = etapas[etapaAtual];
  let numeroHTML = "";
  numero = "";
  votoBranco = false;

  for (let i = 0; i < etapa.numeros; i++) {
    if (i === 0) {
      numeroHTML += '<div class="numero pisca"></div>';
    } else {
      numeroHTML += '<div class="numero"></div>';
    }
  }

  seuVotoPara.style.display = "none";
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = "";
  aviso.style.display = "none";
  lateral.innerHTML = "";
  numeros.innerHTML = numeroHTML;
}

function atualizarInterface() {
  let etapa = etapas[etapaAtual];
  let canditato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });

  if (canditato.length > 0) {
    canditato = canditato[0];
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML = `Nome: ${canditato.nome}<br/>Partido: ${canditato.partido}<br/>`;
    cargoCenter.style.paddingRight = "107px";

    let fotosHTML = "";
    for (let i in canditato.fotos) {
      if (canditato.fotos[i].small) {
        fotosHTML += `<div class="image small"><img src="src/images/${canditato.fotos[i].url}" alt=""><strong>${canditato.fotos[i].legenda}</strong></div>`;
      } else {
        fotosHTML += `<div class="image"><img src="src/images/${canditato.fotos[i].url}" alt=""><strong>${canditato.fotos[i].legenda}</strong></div>`;
      }
    }

    lateral.innerHTML = fotosHTML;
  } else {
    voto_Nulo();
  }
}

function voto_Nulo() {
  votoNulo = true;
  seuVotoPara.style.display = "block";
  aviso.style.display = "block";
  descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
}

function clicou(n) {
  const music = document.querySelector(".audioTecla");
  music.play();

  let campoPiscando = document.querySelector(".numero.pisca");
  if (campoPiscando !== null) {
    campoPiscando.innerHTML = n;
    numero = `${numero}${n}`;

    campoPiscando.classList.remove("pisca");
    if (campoPiscando.nextElementSibling !== null) {
      campoPiscando.nextElementSibling.classList.add("pisca");
    } else {
      atualizarInterface();
    }
  }
}

function branco() {
  music.play();

  if (numero == "") {
    votoBranco = true;
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    numeros.innerHTML = "";
    descricao.innerHTML =
      '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = "";
    cargoCenter.style.paddingRight = "";
  } else {
    alert("Para votar EM BRANCO, não pode ser digitado nenhum núemro!");
  }
}

function corrige() {
  iniciarEtapa();
  music.play();
}

function confirma() {
  let etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  music.play();

  if (votoBranco === true) {
    votoConfirmado = true;

    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: "branco",
    });
  } else if (
    (numero.length === etapa.numeros && votoNulo === true) ||
    numero == ""
  ) {
    votoConfirmado = true;

    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: "nulo",
    });
  } else {
    votoConfirmado = true;

    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: numero,
    });
  }

  if (votoConfirmado) {
    votoNulo = false;
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      iniciarEtapa();
    } else {
      document.getElementById("barra").style.display = "block";

      let barra = document.getElementById("barraAnimada");
      let width = 1;

      aviso.style.display = "none";
      descricao.innerHTML = "";
      seuVotoPara.style.display = "none";
      numeros.innerHTML = "";
      lateral.innerHTML = "";
      cargo.innerHTML = "";

      let i = setInterval(cena, 10);
      function cena() {
        if (width >= 100) {
          clearInterval(i);
          document.getElementById("barra").style.display = "none";
          document.getElementById("gravando").style.display = "none";

          document.querySelector(".tela").innerHTML =
            '<div class="aviso--fim pisca">FIM</div>';
          console.log(votos);
        } else {
          width++;
          barra.style.width = width + "%";
          document.getElementById("gravando").style.display = "flex";
        }
      }

      setTimeout(() => {
        const music = document.querySelector(".audioFim");
        music.play();
      }, 1200);
    }
  }
}

iniciarEtapa();
