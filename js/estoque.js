document.addEventListener('DOMContentLoaded', async function () {

    fetch('data/produtos.json')
        .then(response => response.json())
        .then(data => console.log(data));

    // 2. Atualiza a visibilidade dos produtos no HTML
    async function sincronizarStatus() {
        const produtos = await fetchProdutos();


        // Atualiza o data-status no HTML
        elemento.setAttribute('data-status', produto.status);

        // Oculta ou mostra o item
        elemento.style.display = produto.status ? 'block' : 'none';

        // Opcional: Desativa o botão se status = false
        const botao = elemento.querySelector('.adicionar-carrinho');
        if (botao) botao.disabled = !produto.status;
    }
    sincronizarStatus();
});