const cardContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("#search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let dados = [];
let filtroAtual = "all";

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        aplicarFiltros();
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>";
    }
}

function aplicarFiltros() {
    const termoBusca = campoBusca.value.toLowerCase();

    const dadosFiltrados = dados.filter(dado => {
        const correspondeBusca = termoBusca === '' ||
            dado.nome.toLowerCase().includes(termoBusca) ||
            dado.descricao.toLowerCase().includes(termoBusca) ||
            dado.tags.some(tag => tag.toLowerCase().includes(termoBusca));

        const correspondeFiltro = filtroAtual === 'all' ||
            dado.tags.some(tag => tag.toLowerCase() === filtroAtual.toLowerCase());

        return correspondeBusca && correspondeFiltro;
    });

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dadosParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = "<p class='no-results'>Nenhum resultado encontrado.</p>";
        return;
    }

    for (const dado of dadosParaRenderizar) {
        const article = document.createElement("article");
        article.classList.add("card");
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p class="card-date">${dado.data_criacao}</p>
            <p>${dado.descricao}</p>
            <div class="card-footer">
                <div class="tags-container">${tagsHtml}</div>
                ${dado.link ? `<a href="${dado.link}" target="_blank">Saiba Mais</a>` : ''}
            </div>
        `;
        cardContainer.appendChild(article);
    }
}

campoBusca.addEventListener('input', aplicarFiltros);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filtroAtual = button.dataset.filter;
        aplicarFiltros();
    });
});

document.addEventListener('DOMContentLoaded', carregarDados);