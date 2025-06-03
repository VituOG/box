// Constantes
const LIMITE_FRETE_GRATIS = 500;
const CUSTO_FRETE = 15;

// Elementos do DOM
const formularioProduto = document.getElementById('formularioProduto');
const itensCarrinho = document.getElementById('itensCarrinho');
const elementoSubtotal = document.getElementById('subtotal');
const elementoFrete = document.getElementById('frete');
const elementoTotal = document.getElementById('total');
const inputValorPago = document.getElementById('valorPago');
const elementoTroco = document.getElementById('troco');
const botaoLimpar = document.getElementById('botaoLimpar');

// Estado
let carrinho = [];

// Formatar moeda
const formatarMoeda = (valor) => {
    return `R$ ${valor.toFixed(2)}`;
};

// Calcular totais do carrinho
const calcularTotais = () => {
    const subtotal = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const frete = subtotal >= LIMITE_FRETE_GRATIS ? 0 : CUSTO_FRETE;
    const total = subtotal + frete;

    elementoSubtotal.textContent = formatarMoeda(subtotal);
    elementoFrete.textContent = formatarMoeda(frete);
    elementoTotal.textContent = formatarMoeda(total);

    // Atualizar troco se o valor pago estiver definido
    if (inputValorPago.value) {
        calcularTroco();
    }
};

// Calcular troco
const calcularTroco = () => {
    const valorPago = parseFloat(inputValorPago.value) || 0;
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
    const frete = total >= LIMITE_FRETE_GRATIS ? 0 : CUSTO_FRETE;
    const troco = valorPago - (total + frete);

    elementoTroco.textContent = formatarMoeda(Math.max(0, troco));
};

// Adicionar item ao carrinho
const adicionarAoCarrinho = (item) => {
    carrinho.push(item);
    atualizarExibicaoCarrinho();
    calcularTotais();
};

// Remover item do carrinho
const removerDoCarrinho = (indice) => {
    carrinho.splice(indice, 1);
    atualizarExibicaoCarrinho();
    calcularTotais();
};

// Atualizar exibição do carrinho
const atualizarExibicaoCarrinho = () => {
    itensCarrinho.innerHTML = carrinho.map((item, indice) => `
        <div class="item-carrinho">
            <div>
                <strong>${item.marca} ${item.modelo}</strong>
                <br>
                <small>Numeração: ${item.tamanho}</small>
            </div>
            <div>
                <span>${formatarMoeda(item.preco)}</span>
                <button onclick="removerDoCarrinho(${indice})" class="botao-remover">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
};

// Limpar carrinho
const limparCarrinho = () => {
    carrinho = [];
    atualizarExibicaoCarrinho();
    calcularTotais();
    inputValorPago.value = '';
    elementoTroco.textContent = formatarMoeda(0);
};

// Event Listeners
formularioProduto.addEventListener('submit', (e) => {
    e.preventDefault();

    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const tamanho = document.getElementById('tamanho').value;
    const preco = parseFloat(document.getElementById('preco').value);

    const item = {
        marca,
        modelo,
        tamanho,
        preco
    };

    adicionarAoCarrinho(item);
    formularioProduto.reset();
});

inputValorPago.addEventListener('input', calcularTroco);

botaoLimpar.addEventListener('click', limparCarrinho);

// Inicializar
calcularTotais(); 