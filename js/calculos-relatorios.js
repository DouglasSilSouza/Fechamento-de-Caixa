import { obterDadosDaSessao } from "./validar-inputs.js";

// Seletores
const infoIndices = document.querySelectorAll(".info-indice ul li");
const metodosPagamentos = document.querySelectorAll(".finally .info-metodo-pagamento ul")
const totalDiv = document.querySelector("#total span");

const valoresSacos = obterDadosDaSessao()

const formtarMoeda = (value) => `R$ ${value.toLocaleString("pt-BR",{minimumFractionDigits: 2,})}`;

// Funções
const calculoCadaItem = (container) => {
  container.querySelectorAll("li span").forEach((element) => {
    const itemAdquiridoInput = element.querySelector("input.item-adquirido");
    const itemVendidoInput = element.querySelector("input.item-vendido");

    if (itemAdquiridoInput && itemVendidoInput) {
      [itemAdquiridoInput, itemVendidoInput].forEach((input) => {
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
            const nameClass = element.parentNode.className;
            
            const qtdItens = itemAdquirido - itemVendido;
            itemRestante.value = qtdItens;
            if (nameClass !== "pulseiras") {
              somaQuantidadeTodosItens(nameClass, qtdItens, container)

              const calculandoItems = itemVendido * valoresSacos[nameClass];
              somaValoresTodosItens(nameClass, calculandoItems, container);
              itemSubtotal.value = formtarMoeda(calculandoItems)
            }
          }
        });
      });
    }
  });
};

const somaValoresTodosItens = (nameClass, valueItem, container) => {
  const todosSubtotais =  container.parentNode.querySelector(".Subtotal span #valores-subtotal");

  if (!somaValoresTodosItens.obj) {
    somaValoresTodosItens.obj = {}
  }
  somaValoresTodosItens.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somaValoresTodosItens.obj) {
    if (somaValoresTodosItens.obj.hasOwnProperty(propriedade)) {
      soma += somaValoresTodosItens.obj[propriedade];
    }
  }

  todosSubtotais.value = formtarMoeda(soma)
  somandoTotal(nameClass, valueItem)
};

const somaQuantidadeTodosItens = (nameClass, qtd, container) => {
  const todosRestantes =  container.parentNode.querySelector(".Subtotal span #item-restante-subtotal");

  if (!somaQuantidadeTodosItens.obj) {
    somaQuantidadeTodosItens.obj = {}
  }
  somaQuantidadeTodosItens.obj[nameClass] = qtd;

  let soma = 0;
  for (const propriedade in somaQuantidadeTodosItens.obj) {
    if (somaQuantidadeTodosItens.obj.hasOwnProperty(propriedade)) {
      soma += somaQuantidadeTodosItens.obj[propriedade];
    }
  }

  todosRestantes.value = soma
}

const somaValoresMetodosPagamentos = (nameClass, valueItem) => {
  if (!somaValoresMetodosPagamentos.obj) {
    somaValoresMetodosPagamentos.obj = {}
  }
  somaValoresMetodosPagamentos.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somaValoresMetodosPagamentos.obj) {
    if (somaValoresMetodosPagamentos.obj.hasOwnProperty(propriedade)) {
      soma += somaValoresMetodosPagamentos.obj[propriedade];
    }
  }
  somandoTotal(nameClass, valueItem)
  // todosRestantes.value = soma
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

        let valueItem = credito + debito + pix

        const nameClass = element.className;
        somaValoresMetodosPagamentos(nameClass, valueItem)

      });
  });
};

const somandoTotal = (nameClass, valueItem) => {
  if (!somandoTotal.obj) {
    somandoTotal.obj = {}
  }
  somandoTotal.obj[nameClass] = valueItem;

  let soma = 0;
  for (const propriedade in somandoTotal.obj) {
    if (somandoTotal.obj.hasOwnProperty(propriedade)) {
      soma += somandoTotal.obj[propriedade];
    }
  }
  totalDiv.textContent = formtarMoeda(soma)
};

// Eventos

infoIndices.forEach(async (container) => {
  calculoCadaItem(container);
});

metodosPagamentos.forEach(async (container) => {
  somaMetodosPagamentos(container);
})