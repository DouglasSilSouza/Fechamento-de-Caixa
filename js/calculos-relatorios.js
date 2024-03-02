// Seletores
const infoIndices = document.querySelectorAll(".info-indice ul li");
const metodosPagamentos = document.querySelectorAll(".finally .info-metodo-pagamento ul");
const totalDiv = document.querySelector("#total span");

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// Funções
const valoresSacos = JSON.parse(sessionStorage.getItem("objValores"));

const formtarMoeda = (value) =>`R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const calculoCadaItem = (container) => {
  container.querySelectorAll("li span").forEach((element) => {
    const nameClass = element.parentNode.className;

    LabelInputs(element);

    const itemAdquiridoInput = element.querySelector("input.item-adquirido");
    const itemVendidoInput = element.querySelector("input.item-vendido");

    // console.log(element.parentNode.querySelectorAll(".pulseiras span input"))
    if (itemAdquiridoInput && itemVendidoInput) {
      [itemAdquiridoInput, itemVendidoInput].forEach((input) => {
        if (!valoresSacos) {
          return;
        }
        if (!valoresSacos.objValores[nameClass] && nameClass !== "pulseiras") {
          input.disabled = true;
          if (nameClass !== "copos") {
            const pulseirasInput = document.querySelectorAll(".pulseiras span input");
            pulseirasInput.forEach((elementInput) => {
                elementInput.disabled = true;
            })
          }
          return;
        }

        input.addEventListener("change", (event) => {
          const itemAdquirido = parseInt(itemAdquiridoInput.value);
          const itemVendido = parseInt(itemVendidoInput.value);
          const itemRestante = element.querySelector("input.item-restante");
          const itemSubtotal = element.querySelector("input.item-subtotal");

          if (isNaN(itemAdquirido) || isNaN(itemVendido)) {
            return;
          }

          if (itemAdquirido < itemVendido) {
            if (event.target === itemVendidoInput) {
              itemVendidoInput.value = "";
            }
            itemRestante.value = "";
            itemSubtotal.value = "";
            alert(
              "A quantidade vendida não pode ser superior à quantidade adquirida"
            );
          } else {
            const qtdItens = itemAdquirido - itemVendido;
            itemRestante.value = qtdItens === 0 ? "" : qtdItens;
            
            if (nameClass !== "pulseiras") {
              const calculandoItems =
              itemVendido * valoresSacos.objValores[nameClass];
              itemSubtotal.value = calculandoItems === 0 ? "" : formtarMoeda(calculandoItems);
              
              if (nameClass === "copos"){ somandoTotal(nameClass, calculandoItems); return}
              
              somaQuantidadeTodosItens(nameClass, qtdItens, container);
              somaValoresTodosItens(nameClass, calculandoItems, container);
            }
            verificarDiferenca(container);
          }
        });
      });
    }
  });
};

const somaValoresTodosItens = (nameClass, valueItem, container) => {
  const todosSubtotais = container.parentNode.querySelector(
    ".Subtotal span #valores-subtotal"
  ) ? container.parentNode.querySelector(
    ".Subtotal span #valores-subtotal"
  ) : container.parentNode.querySelector(".Subtotal span span .subtotal")

  if (!somaValoresTodosItens.obj) {
    somaValoresTodosItens.obj = {};
  }
  somaValoresTodosItens.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somaValoresTodosItens.obj) {
    if (somaValoresTodosItens.obj.hasOwnProperty(propriedade)) {
      soma += somaValoresTodosItens.obj[propriedade];
    }
  }

  todosSubtotais.value = formtarMoeda(soma);
  somandoTotal(nameClass, valueItem);
};

const somaQuantidadeTodosItens = (nameClass, qtd, container) => {
  const containerPai = container.parentNode,
        todosRestantes = containerPai.querySelector(".Subtotal span #item-restante-subtotal")
        ? containerPai.querySelector(".Subtotal span #item-restante-subtotal")
        : containerPai.querySelector(".Subtotal span span .restante");
  
  if (!somaQuantidadeTodosItens.obj) {
    somaQuantidadeTodosItens.obj = {};
  }
  somaQuantidadeTodosItens.obj[nameClass] = qtd;

  let soma = 0;
  for (const propriedade in somaQuantidadeTodosItens.obj) {
    if (somaQuantidadeTodosItens.obj.hasOwnProperty(propriedade)) {
      soma += somaQuantidadeTodosItens.obj[propriedade];
    }
  }
  console.log(todosRestantes)
  todosRestantes.value = soma;
};

const somaValoresMetodosPagamentos = (nameClass, valueItem) => {
  if (!somaValoresMetodosPagamentos.obj) {
    somaValoresMetodosPagamentos.obj = {};
  }
  somaValoresMetodosPagamentos.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somaValoresMetodosPagamentos.obj) {
    if (somaValoresMetodosPagamentos.obj.hasOwnProperty(propriedade)) {
      soma += somaValoresMetodosPagamentos.obj[propriedade];
    }
  }
  somandoTotal(nameClass, valueItem);
  // todosRestantes.value = soma
};

const verificarDiferenca = (container) => {
  const containerPai = container.parentNode,
        todosRestantes = containerPai.querySelector(".Subtotal span #item-restante-subtotal"),
        messageInvalid = containerPai.querySelector(".Subtotal div#igualrestante"),
        pulseirasRestantes = containerPai.querySelector(".pulseiras span .item-restante");

  if ((parseInt(pulseirasRestantes.value) === parseInt(todosRestantes.value)) || (pulseirasRestantes.value === "" || todosRestantes.value === "")) {
    messageInvalid.classList.add("hide");
    todosRestantes.classList.remove("is-invalid");
  } else {
    messageInvalid.classList.remove("hide");
    todosRestantes.classList.add("is-invalid");
  }
}

const somaMetodosPagamentos = (container) => {
  container.querySelectorAll("li").forEach((element) => {
    const creditoInput = element.querySelector("input#card-credit"),
      debitoInput = element.querySelector("input#card-debit"),
      pixInput = element.querySelector("input#pix");

    element.addEventListener("change", () => {
      const credito = creditoInput ? parseFloat(creditoInput.value) : 0,
        debito = debitoInput ? parseFloat(debitoInput.value) : 0,
        pix = pixInput ? parseFloat(pixInput.value) : 0;

      if (isNaN(credito) || isNaN(debito) || isNaN(pix)) {
        return;
      }

      let valueItem = credito + debito + pix;

      const nameClass = element.className;
      somaValoresMetodosPagamentos(nameClass, valueItem);
    });
  });
};

const somandoTotal = (nameClass, valueItem) => {
  if (!somandoTotal.obj) {
    somandoTotal.obj = {};
  }
  somandoTotal.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somandoTotal.obj) {
    if (somandoTotal.obj.hasOwnProperty(propriedade)) {
      soma += somandoTotal.obj[propriedade];
    }
  }
  totalDiv.textContent = formtarMoeda(soma);
};

const mediaQuery = window.matchMedia("(max-width: 540px)");

const LabelInputs = (inputs) => {
  const getInputs = inputs.querySelectorAll("input");
  if (mediaQuery.matches) {
      getInputs.forEach((input) => {
        const creatSpan = document.createElement("span");
        const placeholderLabel = input.getAttribute("placeholder");
        let classLabel = (input.className).replace("form-control", "").trim();
        const creatLabel = document.createElement("label");
  
        console.log(classLabel, typeof classLabel)
        creatLabel.setAttribute('for', classLabel);
        creatSpan.appendChild(creatLabel);

        
        creatLabel.innerHTML = `Item ${placeholderLabel}`;
        
        
        input.setAttribute("id", classLabel);
        input.parentNode.insertBefore(creatSpan, input);
        creatSpan.appendChild(input);
      });
    }
};

// Eventos
infoIndices.forEach(async (container) => {
  calculoCadaItem(container);
});

metodosPagamentos.forEach(async (container) => {
  somaMetodosPagamentos(container);
});
