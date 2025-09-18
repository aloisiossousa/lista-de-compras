# 🛒 Lista de Compras

Uma aplicação web moderna para gerenciamento de listas de compras com controle de orçamento, categorização e persistência de dados.

## ✨ Funcionalidades

### 🎯 Principais
- **Autenticação**: Sistema de login com usuários pré-definidos
- **Gestão de Produtos**: Adicionar, editar e remover itens da lista
- **Categorização**: Organize produtos por categorias (frutas, verduras, carnes, etc.)
- **Busca**: Encontre produtos rapidamente por nome ou categoria
- **Persistência**: Dados salvos automaticamente no navegador
- **Controle de Orçamento**: Defina e monitore seu orçamento de compras
- **Exportação**: Exporte sua lista em formato JSON

### 🎨 Interface
- **Design Responsivo**: Funciona em desktop e mobile
- **Tema Escuro/Claro**: Alternância entre temas
- **Notificações**: Sistema de alertas elegante
- **Acessibilidade**: Suporte a navegação por teclado e leitores de tela

### ⌨️ Atalhos de Teclado
- `Enter`: Focar no campo de nome do produto
- `Escape`: Fazer logout

## 🚀 Como Usar

### Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### Execução
```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Credenciais de Teste
- **Usuário**: `admin` | **Senha**: `123456`
- **Usuário**: `usuario` | **Senha**: `senha123`

## 📱 Como Usar a Aplicação

### 1. Login
- Digite suas credenciais na tela de login
- Use as credenciais de teste fornecidas

### 2. Adicionar Produtos
- Preencha o formulário com:
  - Nome do produto
  - Preço (formato: 0.00)
  - Quantidade (número inteiro)
  - Categoria
- Clique em "Adicionar" ou pressione Enter

### 3. Gerenciar Lista
- **Editar**: Clique no ícone ✏️ ao lado do produto
- **Remover**: Clique no ícone 🗑️ (confirmação será solicitada)
- **Buscar**: Use o campo de busca para filtrar produtos
- **Filtrar por Categoria**: Clique nos botões de categoria

### 4. Controle de Orçamento
- Clique em "Definir Orçamento" no painel lateral
- Digite o valor desejado
- Acompanhe o progresso na barra visual

### 5. Exportar Lista
- Clique em "Exportar Lista" para baixar um arquivo JSON
- O arquivo inclui todos os dados da lista e orçamento

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com flexbox e grid
- **JavaScript ES6+**: Funcionalidades interativas
- **LocalStorage**: Persistência de dados
- **Vite**: Build tool e servidor de desenvolvimento

## 📁 Estrutura do Projeto

```
lista-de-compras/
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   └── app.js              # Lógica da aplicação
├── index.html              # Página principal
├── package.json            # Configurações do projeto
├── eslint.config.json      # Configurações do ESLint
└── README.md              # Este arquivo
```

## 🔧 Configuração de Desenvolvimento

### ESLint
```bash
npm run lint
```

### Prettier
```bash
npm run format
```

### Testes
```bash
npm test
```

## 📋 Funcionalidades Implementadas

### ✅ Versão 2.0.0
- [x] Sistema de notificações
- [x] Validação robusta de entrada
- [x] Persistência de dados com localStorage
- [x] Funcionalidade de edição de itens
- [x] Sistema de busca
- [x] Controle de orçamento
- [x] Exportação de listas
- [x] Confirmação para deletar itens
- [x] Melhorias de acessibilidade
- [x] Atalhos de teclado
- [x] Formatação de moeda brasileira

## 🎯 Próximas Funcionalidades

- [ ] Histórico de compras
- [ ] Compartilhamento de listas
- [ ] Sincronização em nuvem
- [ ] Relatórios de gastos
- [ ] Integração com APIs de preços
- [ ] Modo offline completo

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📞 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/devcom/lista-de-compras/issues) no repositório.
