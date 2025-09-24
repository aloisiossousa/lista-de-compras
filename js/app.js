// Estado da aplicação
let currentUser = null;
let shoppingList = [];
let currentFilter = '';
let budget = 0;

// Credenciais de exemplo
const users = {
    'admin': '123456',
    'usuario': 'senha123'
};

// Sistema de notificações
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }
    
    static getIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons.info;
    }
}

// Utilitários
class Utils {
    static formatCurrency(value) {
        // Verifica se o valor é válido
        if (value === null || value === undefined || value === '') {
            return 'R$ 0,00';
        }
        
        // Garante que o valor seja um número válido
        const numValue = parseFloat(value);
        if (isNaN(numValue) || !isFinite(numValue)) {
            return 'R$ 0,00';
        }
        
        // Formata o valor usando Intl.NumberFormat
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numValue);
        } catch (error) {
            console.warn('Erro na formatação de moeda:', error);
            // Fallback caso Intl.NumberFormat não funcione
            return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
        }
    }
    
    static validatePrice(price) {
        const numPrice = parseFloat(price);
        return !isNaN(numPrice) && numPrice > 0 && isFinite(numPrice);
    }
    
    static validateQuantity(quantity) {
        return !isNaN(quantity) && quantity > 0 && Number.isInteger(Number(quantity));
    }
    
    static sanitizeInput(input) {
        return input.trim().replace(/[<>]/g, '');
    }
}

// Gerenciamento de dados
class DataManager {
    static saveShoppingList() {
        if (window.localStorage) {
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        }
    }
    
    static loadShoppingList() {
        if (window.localStorage) {
            const saved = localStorage.getItem('shoppingList');
            if (saved) {
                try {
                    shoppingList = JSON.parse(saved);
                } catch (e) {
                    console.error('Erro ao carregar lista:', e);
                    shoppingList = [];
                }
            }
        }
    }
    
    static saveBudget() {
        if (window.localStorage) {
            localStorage.setItem('budget', budget.toString());
        }
    }
    
    static loadBudget() {
        if (window.localStorage) {
            const saved = localStorage.getItem('budget');
            if (saved) {
                budget = parseFloat(saved) || 0;
            }
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados salvos
    DataManager.loadShoppingList();
    DataManager.loadBudget();
    
    // Verifica se existe tema salvo
    const savedTheme = window.localStorage && localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // Verifica se há usuário logado
    const savedUser = window.sessionStorage && sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    } else {
        // Se não há usuário logado, redireciona para login
        window.location.href = 'login.html';
    }
    
    // Adiciona listeners para atalhos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Inicializa estado da seção colapsável
    initializeCollapsibleSection();
});

// Atalhos de teclado
function handleKeyboardShortcuts(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(event.key) {
        case 'Escape':
            if (document.getElementById('mainApp').style.display !== 'none') {
                logout();
            }
            break;
        case 'Enter':
            if (document.getElementById('mainApp').style.display !== 'none') {
                document.getElementById('itemName').focus();
            }
            break;
        case 'a':
        case 'A':
            // Alt + A para alternar seção de adicionar produto
            if (event.altKey) {
                event.preventDefault();
                toggleAddProductSection();
            }
            break;
    }
}

// Autenticação
function logout() {
    currentUser = null;
    if (window.sessionStorage) {
        sessionStorage.removeItem('currentUser');
    }
    NotificationSystem.show('Logout realizado com sucesso!', 'info');
    // Redireciona para a tela de login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function showMainApp() {
    document.getElementById('welcomeUser').textContent = `Bem-vindo, ${currentUser}!`;
    updateDisplay();
    updateBudgetDisplay();
}

        // Alternância de tema
        function toggleTheme() {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            if (window.localStorage) {
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            }
        }

// Gerenciamento da lista
function addItem(event) {
    event.preventDefault();
    
    const name = Utils.sanitizeInput(document.getElementById('itemName').value);
    const priceInput = document.getElementById('itemPrice').value;
    const quantityInput = document.getElementById('itemQuantity').value;
    const category = document.getElementById('itemCategory').value;
    
    // Converte e valida preço
    const price = parseFloat(priceInput);
    const quantity = parseInt(quantityInput);

    // Validações
    if (!name) {
        NotificationSystem.show('Nome do produto é obrigatório!', 'warning');
        return;
    }
    
    if (!Utils.validatePrice(price)) {
        NotificationSystem.show('Preço deve ser um valor positivo!', 'warning');
        return;
    }
    
    if (!Utils.validateQuantity(quantity)) {
        NotificationSystem.show('Quantidade deve ser um número inteiro positivo!', 'warning');
        return;
    }
    
    if (!category) {
        NotificationSystem.show('Categoria é obrigatória!', 'warning');
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        price: price,
        quantity: quantity,
        category: category,
        total: price * quantity
    };

    shoppingList.push(newItem);
    DataManager.saveShoppingList();
    
    // Limpar formulário
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemQuantity').value = '1';
    document.getElementById('itemCategory').value = '';

    NotificationSystem.show('Produto adicionado com sucesso!', 'success');
    updateDisplay();
    
    // Expande a seção se estiver colapsada (para mostrar o item adicionado)
    const content = document.getElementById('addProductSection');
    if (content && content.classList.contains('collapsed')) {
        toggleAddProductSection();
    }
}

function removeItem(id) {
    const item = shoppingList.find(item => item.id === id);
    if (confirm(`Tem certeza que deseja remover "${item.name}" da lista?`)) {
        shoppingList = shoppingList.filter(item => item.id !== id);
        DataManager.saveShoppingList();
        NotificationSystem.show('Produto removido com sucesso!', 'success');
        updateDisplay();
    }
}

function editItem(id) {
    const item = shoppingList.find(item => item.id === id);
    if (!item) return;
    
    // Preenche o formulário com os dados do item
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemCategory').value = item.category;
    
    // Remove o item da lista (será readicionado quando o formulário for submetido)
    shoppingList = shoppingList.filter(item => item.id !== id);
    DataManager.saveShoppingList();
    
    // Foca no campo de nome
    document.getElementById('itemName').focus();
    
    NotificationSystem.show('Item carregado para edição. Modifique e clique em "Atualizar"', 'info');
    updateDisplay();
}

function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemQuantity').value = '1';
    document.getElementById('itemCategory').value = '';
    document.getElementById('itemName').focus();
}

function filterByCategory(event, category) {
    currentFilter = category;
    
    // Atualizar botões ativos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateDisplay();
}

function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredList = shoppingList.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayItems(filteredList);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    updateDisplay();
}

function updateDisplay() {
    const listContainer = document.getElementById('shoppingList');
    const filteredList = currentFilter 
        ? shoppingList.filter(item => item.category === currentFilter)
        : shoppingList;

    displayItems(filteredList);
    updateSummary();
}

function displayItems(items) {
    const listContainer = document.getElementById('shoppingList');
    
    if (items.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 48px; margin-bottom: 10px;">🛒</div>
                <h3>${currentFilter ? 'Nenhum item nesta categoria' : 'Sua lista está vazia'}</h3>
                <p>${currentFilter ? 'Adicione produtos desta categoria para vê-los aqui!' : 'Adicione alguns produtos para começar suas compras!'}</p>
            </div>
        `;
    } else {
        listContainer.innerHTML = items.map(item => `
            <div class="list-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        ${item.quantity}x ${Utils.formatCurrency(item.price)}
                        <span class="category-badge">${getCategoryIcon(item.category)} ${item.category}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <span class="item-price">${Utils.formatCurrency(item.total)}</span>
                    <button class="btn-edit" onclick="editItem(${item.id})" title="Editar">✏️</button>
                    <button class="btn-remove" onclick="removeItem(${item.id})" title="Remover">🗑️</button>
                </div>
            </div>
        `).join('');
    }
}

// Funções de orçamento
function setBudget() {
    const budgetInput = prompt('Digite o valor do orçamento (R$):');
    if (budgetInput !== null) {
        const newBudget = parseFloat(budgetInput);
        if (Utils.validatePrice(newBudget)) {
            budget = newBudget;
            DataManager.saveBudget();
            updateBudgetDisplay();
            NotificationSystem.show(`Orçamento definido: ${Utils.formatCurrency(budget)}`, 'success');
        } else {
            NotificationSystem.show('Valor de orçamento inválido!', 'error');
        }
    }
}

function updateBudgetDisplay() {
    const budgetElement = document.getElementById('budgetDisplay');
    if (budgetElement) {
        if (budget > 0) {
            const totalValue = shoppingList.reduce((sum, item) => sum + item.total, 0);
            const remaining = budget - totalValue;
            const percentage = (totalValue / budget) * 100;
            budgetElement.innerHTML = `
                <div class="budget-info">
                    <div class="budget-total">Orçamento: ${Utils.formatCurrency(budget)}</div>
                    <div class="budget-used">Gasto: ${Utils.formatCurrency(totalValue)} (${percentage.toFixed(1)}%)</div>
                    <div class="budget-remaining ${remaining < 0 ? 'over-budget' : ''}">Restante: ${Utils.formatCurrency(remaining)}</div>
                    <div class="budget-bar">
                        <div class="budget-progress" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button class="btn-secondary" onclick="setBudget()">Alterar Orçamento</button>
                        <button class="btn-danger" onclick="clearBudget()">Limpar Orçamento</button>
                    </div>
                </div>
            `;
        } else {
            budgetElement.innerHTML = `
                <div class="budget-info">
                    <button class="btn-secondary" onclick="setBudget()">Definir Orçamento</button>
                </div>
            `;
        }
    }
}

// Limpar orçamento
function clearBudget() {
    if (confirm('Deseja remover o valor do orçamento?')) {
        budget = 0;
        DataManager.saveBudget();
        updateBudgetDisplay();
        NotificationSystem.show('Orçamento removido.', 'info');
    }
}
function updateSummary() {
    const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = shoppingList.reduce((sum, item) => sum + item.total, 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = Utils.formatCurrency(totalValue);
    document.getElementById('grandTotal').textContent = Utils.formatCurrency(totalValue);

    updateBudgetDisplay();
    updateCategoryBreakdown();
}

function updateCategoryBreakdown() {
    const categoryTotals = {};
    shoppingList.forEach(item => {
        if (!categoryTotals[item.category]) {
            categoryTotals[item.category] = 0;
        }
        categoryTotals[item.category] += item.total;
    });

    const breakdownHtml = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .map(([category, total]) => `
            <div class="summary-item">
                <span>${getCategoryIcon(category)} ${category}:</span>
                <span>${Utils.formatCurrency(total)}</span>
            </div>
        `).join('');

    document.getElementById('categoryBreakdown').innerHTML = breakdownHtml || '<p style="text-align: center; color: #666;">Nenhuma categoria</p>';
}

function getCategoryIcon(category) {
    const icons = {
        'frutas': '🍎',
        'verduras': '🥬',
        'carnes': '🥩',
        'laticínios': '🥛',
        'padaria': '🍞',
        'limpeza': '🧽',
        'higiene': '🧴',
        'bebidas': '🥤',
        'congelados': '🧊',
        'outros': '📦'
    };
    return icons[category] || '📦';
}

// Funções de exportação
function exportList() {
    const data = {
        user: currentUser,
        date: new Date().toISOString(),
        items: shoppingList,
        total: shoppingList.reduce((sum, item) => sum + item.total, 0),
        budget: budget
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    NotificationSystem.show('Lista exportada com sucesso!', 'success');
}

function clearList() {
    if (confirm('Tem certeza que deseja limpar toda a lista?')) {
        shoppingList = [];
        DataManager.saveShoppingList();
        updateDisplay();
        NotificationSystem.show('Lista limpa com sucesso!', 'success');
    }
}

// Funções para seção colapsável
function initializeCollapsibleSection() {
    // Carrega estado salvo da seção colapsável
    const isCollapsed = window.localStorage && localStorage.getItem('addProductCollapsed') === 'true';
    if (isCollapsed) {
        toggleAddProductSection();
    }
}

function toggleAddProductSection() {
    const content = document.getElementById('addProductSection');
    const icon = document.querySelector('.collapse-icon');
    
    if (content.classList.contains('collapsed')) {
        // Expandir
        content.classList.remove('collapsed');
        icon.classList.remove('collapsed');
        icon.textContent = '-';
        // Salva estado
        if (window.localStorage) {
            localStorage.setItem('addProductCollapsed', 'false');
        }
    } else {
        // Colapsar
        content.classList.add('collapsed');
        icon.classList.add('collapsed');
        icon.textContent = '+';
        // Salva estado
        if (window.localStorage) {
            localStorage.setItem('addProductCollapsed', 'true');
        }
    }
}
  