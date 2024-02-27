export { obterDadosDaSessao };

const containerCalculos = document.querySelector(".info-container"),
  containerValidator = document.querySelector(".confirmacao-dados"),
  buttonConfirmation = containerValidator.querySelector("#btn-insert");

const objValores = {
  obj: {},
};

const validarDados = () => {
  containerCalculos.classList.add("hide");

  let validado = true;
  let message = [];
  let camposVazios = [];

  objValores.obj = {};

  const formInputs = containerValidator.querySelectorAll(
    "table tbody tr td.input"
  );
  formInputs.forEach((container) => {
    const campoInput = container.querySelector("input");

    if (!campoInput) {
      return;
    }

    const nameCampo =
      campoInput.parentNode.parentNode.querySelector(".title").textContent;

    if (campoInput.value === undefined || campoInput.value.trim() === "") {
      camposVazios.push(nameCampo);
      validado = false;
    } else {
      const formatValue = campoInput.value
        .replace("R$", "")
        .replace(",", ".")
        .trim();
      objValores.obj[nameCampo.toLowerCase()] = parseFloat(formatValue);
    }
  });

  // Adiciona a mensagem apenas se houver campos vazios
  if (!validado && camposVazios.length > 0) {
    const messageCampoVazio = `Preencha o(s) seguinte(s) campo(s): ${camposVazios.join(
      ", "
    )}`;
    message.push(messageCampoVazio);
  }

  return { validado, message, objValores };
};

const pressBtn = () => {
  buttonConfirmation.addEventListener("click", () => {
    const validar = validarDados();
    if (validar.validado) {
      containerCalculos.classList.remove("hide");
      containerValidator.classList.add(".hide");
      salvarDadosNaSessao(objValores);
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

const salvarDadosNaSessao = (dados) => {
  const timestamp = new Date().getTime();
  const dadosComTimestamp = { timestamp, dados };
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
pressBtn();
