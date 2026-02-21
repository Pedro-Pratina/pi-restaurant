# Requisitos do Projeto - PI-Restaurant

**Versão:** 1.0 – Inicial (só funcionalidades principais) 
**Data:** 21 de fevereiro de 2026
**Responsável (PM):** Pedro Reis

## 1. Requisitos Funcionais

### Páginas Principais
- **index.html** (Home): Breve apresentação sobre o restaurante, e pequenas demonstrações.
- **sobre.html**: História, missão/valores, galeria simples de fotos.
- **cardapio.html**: Pratos categorizados (entradas, sushis, etc.), cada prato com foto, descrição, preço e botão "Adicionar ao Carrinho".
- **carrinho.html**: Lista de itens adicionados (nome, preço, quantidade, subtotal/total), botões + / - / remover, botão "Finalizar Pedido" (Criar uma simulação finalização de pedido, cadastro do usuário / cadastro de endereço / forma de pagamento).
- **acompanhar.html**: Status do pedido (Aguardando Confirmação → Em Preparação → Pronto → Saiu Para Entrega → Entregue), progresso visual simulado.
- **contato.html**: Formulário simples (nome, email, telefone, mensagem) com validação básica, opção de atendimento pelo whatsapp e telefone.

### Funcionalidades Principais
- Adicionar itens ao carrinho a partir do cardápio (salva em localStorage para simular).
- Gerenciar carrinho (alterar quantidade, remover, calcular total).
- Finalizar pedido: Confirmação simulada, limpa carrinho, salva status inicial e redireciona para acompanhar.
- Acompanhar pedido: Atualização automática de status (simulada com setTimeout).
- Menu mobile: Hamburger que abre/fecha.
- Popup de avaliação: Aparece no acompanhar.html após confirmação da entrega (estrelas + comentário, salva em localStorage).

## 2. Requisitos Não Funcionais

- Responsivo: Funcional em mobile, tablet e desktop.
- Performace: Sem erros no console, imagens otimizadas.
- Tema visual: A decidir na reunião - 21/02/2026 21:00.
- Código: Limpo, sem duplicação excessiva.
- Persistência: Usar localStorage para carrinho (solução temporária), status do pedido e avaliações (não perde ao atualizar página).

## Notas
- Versão inicial focada no fluxo de delivery básico.
- Atualizações futuras: adicionar extras (badge no carrinho, voltar ao topo), trocar simulação local por simulação com servidor básico e ordem de prioridades.