# Declaração de Conteúdo & Endereçador - Correios

Sistema moderno e interativo para preenchimento de **Declaração de Conteúdo** e **Endereçador** para envios dos Correios.

## 🚀 Funcionalidades Implementadas

### Interface
- ✅ Design moderno com gradientes e glassmorphism
- ✅ Tema escuro/claro (Dark Mode) com persistência
- ✅ Partículas animadas no background
- ✅ Animações CSS avançadas (fade, slide, bounce, shake, glow)
- ✅ Layout totalmente responsivo (mobile-first)
- ✅ Notificações toast interativas
- ✅ Barra de progresso do preenchimento
- ✅ Tela cheia (Fullscreen mode)

### Formulário - Declaração de Conteúdo
- ✅ Dados do Remetente (nome, CPF, telefone, endereço completo)
- ✅ Dados do Destinatário (nome, telefone, endereço completo)
- ✅ Tabela de itens dinâmica (adicionar/remover itens)
- ✅ Cálculo automático de totais (quantidade e valor)
- ✅ Peso total
- ✅ Texto legal oficial dos Correios
- ✅ Local, data e assinatura

### Endereçador
- ✅ Sincronização automática com dados da declaração
- ✅ Pré-visualização em formato de etiqueta
- ✅ Impressão independente do endereçador

### Funcionalidades Avançadas
- ✅ **Busca automática de CEP** (API ViaCEP)
- ✅ **Máscaras de input** (CPF, telefone, CEP, valores monetários)
- ✅ **Validação de CPF** com algoritmo oficial
- ✅ **Auto-save** (salva rascunho automaticamente a cada 2s)
- ✅ **Histórico** de declarações salvas (máx. 20 entradas)
- ✅ **Carregar/Excluir** declarações do histórico
- ✅ **Impressão** otimizada com CSS print-specific
- ✅ **Gerar PDF** via impressão do navegador
- ✅ **Persistência** via localStorage

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal
├── css/
│   ├── style.css       # Estilos principais + variáveis CSS + responsivo
│   ├── animations.css  # Animações CSS avançadas
│   └── print.css       # Estilos de impressão
├── js/
│   ├── utils.js        # Funções utilitárias (máscaras, CEP, toast, validações)
│   └── main.js         # Lógica principal da aplicação
└── README.md           # Este arquivo
```

## 🌐 URIs Funcionais

| Caminho | Descrição |
|---------|-----------|
| `/index.html` | Página principal com todas as abas |
| Aba "Declaração de Conteúdo" | Formulário completo |
| Aba "Endereçador" | Pré-visualização de etiqueta |
| Aba "Histórico" | Declarações salvas |

## 🛠 Tecnologias Utilizadas

- **HTML5** semântico
- **CSS3** com Custom Properties, Grid, Flexbox, Animations
- **JavaScript ES6+** vanilla (sem frameworks)
- **Font Awesome 6** para ícones
- **Google Fonts** (Inter) para tipografia
- **ViaCEP API** para consulta de endereços
- **LocalStorage** para persistência de dados

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Recursos Visuais

- Partículas animadas de fundo
- Efeitos hover com elevação
- Transições suaves em todos os elementos
- Feedback visual imediato (animações de sucesso/erro)
- Gradientes modernos no cabeçalho e botões

## ⏭ Próximos Passos Recomendados

- [ ] Integração com API real dos Correios para rastreamento
- [ ] Export em múltiplos formatos (PDF direto, CSV)
- [ ] Assinatura digital com canvas
- [ ] Modo offline completo com Service Worker
- [ ] Compartilhamento via link/QR Code
