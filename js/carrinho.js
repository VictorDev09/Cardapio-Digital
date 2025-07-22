document.addEventListener('DOMContentLoaded', function () {
    const botaoAdicionarTodos = document.getElementById('adicionar-todos-carrinho');
    const contadorItens = document.querySelector('.item-count');
    const botaoLimparCarrinho = document.createElement('button');
    const sacola = document.querySelector('.sacola');

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Configuração do botão limpar carrinho
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
            if (quantity > 0) {
                display.textContent = quantity - 1;
            }
        });
    });

    botaoAdicionarTodos.addEventListener('click', function ()
    {
        const produtos = document.querySelectorAll('.produto');
        let adicionouAlgo = false;

        produtos.forEach(produtoElemento =>
        {
            const quantity = parseInt(produtoElemento.querySelector('.quantity-display').textContent);
            const id = produtoElemento.dataset.id;

            if (quantity > 0) {
                if (!verificarDisponibilidadeNoEstoque(id, quantity)) {
                    alert(`Desculpe, o produto ${produtoElemento.dataset.nome} não tem estoque suficiente!\n  Disponível: ${estoque.getProduto(id).Estoque}`);

                    return;
                }

                const produto = {
                    id: id,
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

                produtoElemento.querySelector('.quantity-display').textContent = '0';
                adicionouAlgo = true;
            }
        });

        if (adicionouAlgo) {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContador();

            // Feedback visual
            const originalText = this.textContent;
            this.textContent = '✔ Itens Adicionados!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        } else {
            alert('Selecione a quantidade de pelo menos um produto!');
        }
    });

    botaoLimparCarrinho.addEventListener('click', function () {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            carrinho = [];
            localStorage.removeItem('carrinho');
            atualizarContador();
        }
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
            const produtoEstoque = estoque.getProduto(produto.id);
            const disponivel = produtoEstoque ? produtoEstoque.Estoque >= produto.quantidade : false;

            mensagem += ` 🍫- ${produto.nome} (x${produto.quantidade}) - R$ ${(produto.preco * produto.quantidade).toFixed(2)}`;
            mensagem += disponivel ? ' ✅ Disponível\n' : ' ⚠️ Verificar disponibilidade\n';
            total += produto.preco * produto.quantidade;
        });

        mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;
        mensagem += `\n\nFormas de pagamento: Pix (mandar comprovante) | Cartão (somente aproximação) | Dinheiro`;
        mensagem += `\n\n(Informe o endereço)`;
        mensagem += `\n\n👉 Deseja finalizar o pedido agora?`;

        if (confirm(mensagem)) {
            carrinho.forEach(produto => {
                decrementarEstoque(produto.id, produto.quantidade);
            });

            const textoPedido = encodeURIComponent(mensagem.replace('👉 Deseja finalizar o pedido agora?', ''));
            window.open(`https://wa.me/5534988336859?text=Olá! Gostaria de encomendar:\n${textoPedido}`, '_blank');

            carrinho = [];
            localStorage.removeItem('carrinho');
            atualizarContador();
        }
    }
});