const containerCalculos = document.querySelector("#info-container"),
  containerValidator = document.querySelector("#confirmacao-dados"),
  buttonConfirmation = containerValidator.querySelector("#btn-insert"),
  buttonEditValues = document.querySelector("#edit-values");

let objValores = {};

const validarDados = () => {
  let message = [];

  let camposVazios = [];

  objValores = {};

  const formInputs = containerValidator.querySelectorAll("table tbody tr td.input");
  
  formInputs.forEach((container) => {
    const campoInput = container.querySelector("input");

    if (!campoInput) {
      return;
    }
    const nameCampo = campoInput.parentNode.parentNode.querySelector(".title").textContent;

    const formatValue = campoInput.value.replace("R$", "").replace(",", ".").trim();

    const salvarObjeto = (valurInputs) => {
      objValores[nameCampo.toLowerCase()] = parseFloat(valurInputs);
    }

    
    if (formatValue === undefined || formatValue.trim() === "") {
      camposVazios.push(nameCampo);
    } else {
      salvarObjeto(formatValue);
    }

  });

  function verificarCampos(campos) {
    if (campos.includes("Copos") && campos.length === 1) {
      return true
    } else if (!campos.includes("Copos") && campos.length === 5) {
      return true
    } else if (!campos.includes("Copos") && campos.length === 0) {
      return true
    }
  }

  let validado = false;
  validado = verificarCampos(camposVazios);

  if (!validado && camposVazios.length > 0) {
    const messageCampoVazio = `Preencha o(s) seguinte(s) campo(s): ${camposVazios.join(", ")}`;
    message.push(messageCampoVazio);
  }

  return { validado, message };
};

const pressBtn = () => {
  containerCalculos.classList.add("hide");
  buttonConfirmation.addEventListener("click", () => {
    const validar = validarDados();
    if (validar.validado) {
      containerCalculos.classList.remove("hide");
      containerValidator.classList.add("hide");
      location.reload();
      salvarDadosNaSessao();
    } else {
      Swal.fire({
        title: "OPS...",
        text: validar.message.join("\n"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });
};

const salvarDadosNaSessao = () => {
  const timestamp = new Date().getTime();
  const dadosComTimestamp = { timestamp, objValores };
  sessionStorage.setItem("objValores", JSON.stringify(dadosComTimestamp));
};

const obterDadosDaSessao = () => {
  const dadosComTimestamp = sessionStorage.getItem("objValores");

  if (dadosComTimestamp) {
    const { timestamp, dados } = JSON.parse(dadosComTimestamp);
    const tempoAtual = new Date().getTime();
    const tempoExpiracao = 5 * 60 * 60 * 1000; // 5 horas em milissegundos

    // Verifica se os dados estão dentro do tempo de validade
    if (tempoAtual - timestamp < tempoExpiracao) {
      return dados;
    } else {
      // Dados expirados, remove da sessão
      sessionStorage.removeItem("objValores");
    }
  }

  return null; // Retorna null se não houver dados ou se estiverem expirados
};

const editValues = () => {
  if (containerCalculos.classList.contains("hide")) {
    buttonEditValues.parentElement.classList.add("hide")
  }
  buttonEditValues.addEventListener("click", () => {
    if (sessionStorage.getItem("objValores")) {
      sessionStorage.removeItem("objValores");

      containerCalculos.classList.add("hide");
      containerValidator.classList.remove("hide");
      pressBtn();
      location.reload();
    }
  });
};

if (sessionStorage.getItem("objValores")) {
  containerCalculos.classList.remove("hide");
  containerValidator.classList.add("hide");
} else {
  pressBtn();
  containerCalculos.classList.add("hide");
  containerValidator.classList.remove("hide");
}

editValues();
