# Meu Totem App

Aplicação React + Vite + TypeScript para um sistema de totem de autoatendimento de restaurante, com interface touch-friendly, carrinho, resumo do pedido, fluxo de confirmação e pagamento simulado.

## Tecnologias

- React 19
- Vite 8
- TypeScript
- Tailwind CSS
- Axios
- Context API para gerenciamento do carrinho

## Requisitos

- Node.js 18+ recomendado
- npm ou pnpm

## Clonando o projeto

```bash
git clone <url-do-repositorio>
cd meu-totem-app
```

## Instalando dependências

```bash
npm install
```

Se quiser usar pnpm, também é possível:

```bash
pnpm install
```

## Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

## Build para produção

```bash
npm run build
```

## Versionamento e fluxo Git

Recomenda-se manter o projeto versionado com commits semânticos e branches para cada feature.

Exemplo:

```bash
git checkout -b feature/nova-funcionalidade
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

## Estrutura principal

```text
src/
  components/
  hooks/
  i18n/
  pages/
  services/
  types/
```

## Observações

- O projeto já inclui um mock local para os produtos e para o processamento do pedido.
- A interface suporta dois idiomas: Português Brasileiro e Inglês Americano.
