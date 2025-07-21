class Estoque {
    constructor() {
        this.produtos = [];
        this.carregarEstoque();
    }

    async carregarEstoque() {
        try {
            const response = await fetch('Produtos.json');
            this.produtos = await response.json();
            this.atualizarDisponibilidade();
            this.monitorarEstoque();
        } catch (error) {
            console.error('Erro ao carregar estoque:', error);
            this.produtos = this.getDadosLocais();
            this.atualizarDisponibilidade();
        }
    }

    getDadosLocais() {
        return [
            { "ID": 1, "Status": true, "Nome": "Brigadeiro", "valor": "R$ 5,00", "Estoque": 10 },
            { "ID": 2, "Status": true, "Nome": "Ninho", "valor": "R$ 5,00", "Estoque": 10 },
            { "ID": 3, "Status": true, "Nome": "Dois Amores", "valor": "R$ 5,00", "Estoque": 10 },
            { "ID": 4, "Status": true, "Nome": "Prestigio", "valor": "R$ 5,00", "Estoque": 10 },
            { "ID": 5, "Status": true, "Nome": "Sensação", "valor": "R$ 5,00", "Estoque": 10 },
            { "ID": 6, "Status": true, "Nome": "Ouro Branco", "valor": "R$ 6,00", "Estoque": 10 },
            { "ID": 7, "Status": true, "Nome": "Confete", "valor": "R$ 6,00", "Estoque": 10 },
            { "ID": 8, "Status": true, "Nome": "Maracujá", "valor": "R$ 6,00", "Estoque": 10 },
            { "ID": 9, "Status": true, "Nome": "Limão", "valor": "R$ 6,00", "Estoque": 10 },
            { "ID": 10, "Status": true, "Nome": "Oreo", "valor": "R$ 8,00", "Estoque": 10 },
            { "ID": 11, "Status": true, "Nome": "Napolitano", "valor": "R$ 8,00", "Estoque": 10 },
            { "ID": 12, "Status": true, "Nome": "Café", "valor": "R$ 8,00", "Estoque": 10 },
            { "ID": 13, "Status": true, "Nome": "Menta", "valor": "R$ 8,00", "Estoque": 10 },
            { "ID": 14, "Status": true, "Nome": "Paçoca", "valor": "R$ 8,00", "Estoque": 10 }
        ];
    }

    atualizarDisponibilidade() {
        document.querySelectorAll('.produto').forEach(elemento => {
            const id = elemento.dataset.id;
            const produto = this.produtos.find(p => p.ID == id);

            if (produto) {
                const disponivel = produto.Estoque > 0;
                elemento.setAttribute('data-status', disponivel);

                // Atualiza visualização
                if (!disponivel) {
                    elemento.style.opacity = '0.5';
                    elemento.querySelector('.quantity-controls').style.display = 'none';
                    const aviso = document.createElement('p');
                    aviso.textContent = 'Indisponível no momento';
                    aviso.style.color = 'red';
                    aviso.style.fontWeight = 'bold';
                    elemento.querySelector('.item-details').appendChild(aviso);
                } else {
                    elemento.style.opacity = '1';
                    elemento.querySelector('.quantity-controls').style.display = 'flex';
                    const aviso = elemento.querySelector('p[style="color: red; font-weight: bold;"]');
                    if (aviso) aviso.remove();
                }
            }
        });
    }

    monitorarEstoque() {
        setInterval(() => {
            this.produtos.forEach(produto => {
                if (produto.Estoque <= 0 && produto.Status) {
                    produto.Status = false;
                    this.atualizarDisponibilidade();
                }
            });
        }, 5000);
    }

    decrementarEstoque(id, quantidade) {
        const produto = this.produtos.find(p => p.ID == id);
        if (produto) {
            produto.Estoque -= quantidade;
            if (produto.Estoque < 0) produto.Estoque = 0;

            // Atualiza status se necessário
            if (produto.Estoque <= 0) {
                produto.Status = false;
            }

            this.atualizarDisponibilidade();
            return true;
        }
        return false;
    }

    verificarDisponibilidade(id, quantidade) {
        const produto = this.produtos.find(p => p.ID == id);
        return produto && produto.Status && produto.Estoque >= quantidade;
    }

    getProduto(id) {
        return this.produtos.find(p => p.ID == id);
    }
}

const estoque = new Estoque();

function verificarDisponibilidadeNoEstoque(id, quantidade) {
    return estoque.verificarDisponibilidade(id, quantidade);
}

function decrementarEstoque(id, quantidade) {
    return estoque.decrementarEstoque(id, quantidade);
}