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
let resultados = {}; // CONTAGEM DE VOTOS

let botao = document.querySelector(".botao");
let opcoesDeVoto = document.querySelector(".gostosas");

const music = document.querySelector(".audioTecla");

/* MENU */
function toggleMenu() {
  if (opcoesDeVoto.style.height === "0px" || opcoesDeVoto.style.height === "") {
    opcoesDeVoto.style.height = "270px";
    botao.innerHTML = "▴ Gostosas ▴";
  } else {
    opcoesDeVoto.style.height = "0px";
    botao.innerHTML = "▾ Candidatas ▾";
  }
}

/* INICIAR ETAPA */
function iniciarEtapa() {
  let etapa = etapas[etapaAtual];
  let numeroHTML = "";

  numero = "";
  votoBranco = false;
  votoNulo = false;

  for (let i = 0; i < etapa.numeros; i++) {
    numeroHTML += i === 0
      ? '<div class="numero pisca"></div>'
      : '<div class="numero"></div>';
  }

  seuVotoPara.style.display = "none";
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = "";
  aviso.style.display = "none";
  lateral.innerHTML = "";
  numeros.innerHTML = numeroHTML;
}

/* ATUALIZA INTERFACE */
function atualizarInterface() {
  let etapa = etapas[etapaAtual];
  let candidato = etapa.candidatos.find(c => c.numero === numero);

  if (candidato) {
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML = `
      Nome: ${candidato.nome}<br/>
      Partido: ${candidato.partido}
    `;
    cargoCenter.style.paddingRight = "107px";

    let fotosHTML = "";
    candidato.fotos.forEach(foto => {
      fotosHTML += `
        <div class="image ${foto.small ? "small" : ""}">
          <img src="src/images/${foto.url}">
          <strong>${foto.legenda}</strong>
        </div>
      `;
    });

    lateral.innerHTML = fotosHTML;
  } else {
    votoNulo = true;
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
  }
}

/* DIGITAÇÃO */
function clicou(n) {
  music.play();

  let campo = document.querySelector(".numero.pisca");
  if (campo) {
    campo.innerHTML = n;
    numero += n;

    campo.classList.remove("pisca");
    if (campo.nextElementSibling) {
      campo.nextElementSibling.classList.add("pisca");
    } else {
      atualizarInterface();
    }
  }
}

/* VOTO EM BRANCO */
function branco() {
  music.play();

  if (numero === "") {
    votoBranco = true;
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    numeros.innerHTML = "";
    descricao.innerHTML =
      '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = "";
    cargoCenter.style.paddingRight = "";
  }
}

/* CORRIGE */
function corrige() {
  music.play();
  iniciarEtapa();
}

/* CONFIRMA */
function confirma() {
  let etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  music.play();

  if (votoBranco) {
    votoConfirmado = true;
    votos.push({ etapa: etapa.titulo, voto: "branco" });
  } else if (votoNulo || numero.length !== etapa.numeros) {
    votoConfirmado = true;
    votos.push({ etapa: etapa.titulo, voto: "nulo" });
  } else {
    votoConfirmado = true;
    votos.push({ etapa: etapa.titulo, voto: numero });

    resultados[numero] = (resultados[numero] || 0) + 1;
  }

  if (votoConfirmado) {
    etapaAtual++;

    if (etapas[etapaAtual]) {
      iniciarEtapa();
    } else {
      finalizarUrna();
    }
  }
}

/* FINALIZAÇÃO */
function finalizarUrna() {
  document.getElementById("barra").style.display = "block";
  let barra = document.getElementById("barraAnimada");
  let width = 1;

  aviso.style.display = "none";
  descricao.innerHTML = "";
  seuVotoPara.style.display = "none";
  numeros.innerHTML = "";
  lateral.innerHTML = "";
  cargo.innerHTML = "";

  let i = setInterval(() => {
    if (width >= 100) {
      clearInterval(i);
      document.getElementById("barra").style.display = "none";
      document.getElementById("gravando").style.display = "none";
      mostrarResultadoFinal();
      document.querySelector(".audioFim").play();
    } else {
      width++;
      barra.style.width = width + "%";
      document.getElementById("gravando").style.display = "flex";
    }
  }, 10);
}

/* RESULTADO FINAL */
function mostrarResultadoFinal() {
  let html = `<div class="aviso--grande">Resultado Final</div><br>`;

  etapas.forEach(etapa => {
    etapa.candidatos.forEach(c => {
      html += `
        <div style="margin:10px 0; font-size:18px;">
          <strong>${c.nome}</strong> — ${resultados[c.numero] || 0} voto(s)
        </div>
      `;
    });
  });

  document.querySelector(".tela").innerHTML = html;
}

/* START */
iniciarEtapa();
