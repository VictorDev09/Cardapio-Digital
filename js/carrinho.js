document.addEventListener('DOMContentLoaded', function () {
    const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
    const contadorItens = document.querySelector('.item-count');
    const botaoLimparCarrinho = document.createElement('button');
    const sacola = document.querySelector('.sacola');


    let carrinho = [];

    if (localStorage.getItem('carrinho')) {
        carrinho = JSON.parse(localStorage.getItem('carrinho'));
        atualizarContador();
    }

    botaoLimparCarrinho.textContent = 'X';
    botaoLimparCarrinho.classList.add('limpar-carrinho');
    botaoLimparCarrinho.style.marginTop = '7px';
    botaoLimparCarrinho.style.marginRight = '15px';
    botaoLimparCarrinho.style.padding = '5px 10px';
    botaoLimparCarrinho.style.backgroundColor = '#ff4d4d';
    botaoLimparCarrinho.style.color = 'white';
    botaoLimparCarrinho.style.border = 'none';
    botaoLimparCarrinho.style.borderRadius = '5px';
    botaoLimparCarrinho.style.cursor = 'pointer';
    botaoLimparCarrinho.style.position = 'fixed';
    botaoLimparCarrinho.style.right = '10px';
    botaoLimparCarrinho.style.zIndex = '1000';

    const containerSacola = document.querySelector('.container-sacola');
    containerSacola.appendChild(botaoLimparCarrinho);

    atualizarContador();


    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const display = this.previousElementSibling;
            display.textContent = parseInt(display.textContent) + 1;
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const display = this.nextElementSibling;
            let quantity = parseInt(display.textContent);
            if (quantity > 1) {
                display.textContent = quantity - 1;
            }
        });
    });

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function () {
            const produtoElemento = this.closest('.produto');
            const quantity = parseInt(this.parentNode.querySelector('.quantity-display').textContent);

            const produto = {
                id: produtoElemento.dataset.id,
                nome: produtoElemento.dataset.nome,
                preco: parseFloat(produtoElemento.dataset.preco),
                quantidade: quantity
            };

            const produtoExistente = carrinho.findIndex(item => item.id === produto.id);

            if (produtoExistente !== -1) {
                carrinho[produtoExistente].quantidade += quantity;
            } else {
                carrinho.push(produto);
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContador();

            this.textContent = '✔ Adicionado!';
            setTimeout(() => {
                this.textContent = 'Adicionar';
                this.parentNode.querySelector('.quantity-display').textContent = '1';
            }, 1500);
        });

    });

    botaoLimparCarrinho.addEventListener('click', function () {
        carrinho = [];
        localStorage.removeItem('carrinho');
        atualizarContador();
        alert('Carrinho limpo!');
    });



    sacola.addEventListener('click', function (e) {
        e.preventDefault();
        mostrarCarrinho();
    });

    function atualizarContador() {
        const totalItens = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
        contadorItens.textContent = totalItens;
    }

    function mostrarCarrinho() {
        if (carrinho.length === 0) {
            alert('Sua sacola está vazia!');
            return;
        }

        let mensagem = '📋 Seu Pedido:\n\n';
        let total = 0;

        carrinho.forEach(produto => {
            mensagem += ` 🍫- ${produto.nome} (x${produto.quantidade})\n`;
            total += produto.preco * produto.quantidade;
        });

        mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
        mensagem += `\n\n👉 Deseja finalizar o pedido agora?`;

        if (confirm(mensagem)) {
            const textoPedido = encodeURIComponent(mensagem.replace('📋 Seu Pedido:\n\n', '').replace('\n\n👉 Deseja finalizar o pedido agora?', ''));
            window.open(`https://wa.me/5534988336859?text=Olá! Gostaria de encomendar:\n${textoPedido}`, '_blank');
        }

    }

}
);