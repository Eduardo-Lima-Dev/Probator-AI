# Design System — Probator-AI

> Documento criado com base na tela de referência enviada.  
> Produto: **Probator-AI**  
> Plataforma: **Web App**  
> Fonte oficial: **Manrope**  
> Stack de implementação: **Tailwind CSS**

---

## Como usar este documento

Este arquivo possui duas partes separadas:

1. **Versão de documentação visual** — explica identidade, cores, tipografia, componentes e regras de uso.
2. **Versão de implementação** — transforma o design system em tokens, configuração Tailwind e exemplos de classes/componentes.

---

# Parte 1 — Documentação visual

## 1. Identidade visual

O **Probator-AI** utiliza uma linguagem visual limpa, moderna e institucional, com superfícies azuladas claras e uma cor primária dourada para destacar ações principais, estados ativos e elementos ligados à inteligência artificial.

A interface deve transmitir:

- Clareza para leitura e tomada de decisão.
- Organização visual para criação, edição e correção de provas.
- Sensação de tecnologia, confiabilidade e apoio educacional.
- Destaques pontuais para ações importantes, evitando excesso de cores fortes.

### Direção visual

- Fundos claros e suaves.
- Cards grandes com cantos arredondados.
- Uso predominante de azul claro em superfícies.
- Dourado como cor de destaque e ação principal.
- Azul escuro para contraste, botões invertidos e textos fortes.
- Ícones lineares simples.
- Espaçamento confortável entre componentes.

---

## 2. Paleta de cores

### 2.1 Cores principais

| Token | Nome | Hex | Uso recomendado |
|---|---|---:|---|
| `primary` | Dourado | `#D4AF37` | Ações principais, item ativo, destaque, progresso principal |
| `secondary` | Azul escuro | `#1A2B48` | Botões invertidos, textos fortes, áreas de contraste |
| `tertiary` | Branco frio | `#F8FAFC` | Fundos neutros e texto invertido |
| `neutral` | Azul acinzentado | `#64748B` | Textos secundários, ícones neutros e apoio visual |

### 2.2 Cores de fundo

| Token | Hex | Uso recomendado |
|---|---:|---|
| `background.page` | `#C9D8F2` | Fundo geral do Web App |
| `background.surface` | `#E7F0FC` | Cards, containers e blocos principais |
| `background.surface-soft` | `#DDEBFA` | Inputs, navegação, botões secundários e elementos internos |
| `background.dark` | `#1F242B` | Áreas externas, previews ou modo apresentação |

### 2.3 Cores de texto

| Token | Hex | Uso recomendado |
|---|---:|---|
| `text.primary` | `#0B1D33` | Títulos e textos principais |
| `text.secondary` | `#4B5563` | Textos de apoio |
| `text.muted` | `#7C8798` | Placeholders, labels secundários e metadados |
| `text.inverted` | `#F8FAFC` | Texto sobre fundo escuro |
| `text.brand` | `#4B3F00` | Texto sobre dourado claro ou elementos de marca |

### 2.4 Cores semânticas

| Token | Hex | Uso recomendado |
|---|---:|---|
| `success` | `#2E7D32` | Confirmação, prova gerada, operação concluída |
| `warning` | `#D4AF37` | Atenção, pendência, destaque moderado |
| `danger` | `#D01818` | Exclusão, erro crítico, ação destrutiva |
| `info` | `#64748B` | Informação neutra ou status auxiliar |

---

## 3. Escalas de cor sugeridas

### 3.1 Primary — Dourado

| Token | Hex | Uso |
|---|---:|---|
| `primary.950` | `#1F1900` | Texto muito escuro sobre fundos claros |
| `primary.900` | `#2F2700` | Texto associado à marca |
| `primary.800` | `#4B3F00` | Texto em labels douradas |
| `primary.700` | `#665600` | Botão primário com melhor contraste |
| `primary.600` | `#806B00` | Hover/active de elementos primários |
| `primary.500` | `#9B8100` | Elementos ativos escuros |
| `primary.400` | `#B89720` | Hover suave |
| `primary.300` | `#D4AF37` | Cor primária base |
| `primary.200` | `#F0D060` | Destaque suave |
| `primary.100` | `#FFE6A0` | Fundo leve de destaque |
| `primary.50` | `#FFF7D6` | Fundo muito claro |

### 3.2 Secondary — Azul escuro

| Token | Hex | Uso |
|---|---:|---|
| `secondary.950` | `#020617` | Texto/fundo de máximo contraste |
| `secondary.900` | `#07111F` | Fundo muito escuro |
| `secondary.800` | `#0B1D33` | Texto principal escuro |
| `secondary.700` | `#132742` | Hover escuro |
| `secondary.600` | `#1A2B48` | Cor secundária base |
| `secondary.500` | `#344762` | Ícones e textos fortes |
| `secondary.400` | `#50627C` | Ícones e elementos secundários |
| `secondary.300` | `#6F819D` | Bordas ou estados desabilitados |
| `secondary.200` | `#93A5C0` | Elementos intermediários |
| `secondary.100` | `#C9D8F2` | Fundo geral azulado |
| `secondary.50` | `#E7F0FC` | Superfície clara |

### 3.3 Neutral — Neutros

| Token | Hex | Uso |
|---|---:|---|
| `neutral.950` | `#111827` | Texto forte |
| `neutral.900` | `#1F2933` | Texto principal alternativo |
| `neutral.800` | `#374151` | Texto médio forte |
| `neutral.700` | `#4B5563` | Texto secundário |
| `neutral.600` | `#64748B` | Cor neutra base |
| `neutral.500` | `#7C8798` | Placeholder |
| `neutral.400` | `#9CA3AF` | Ícones suaves e bordas |
| `neutral.300` | `#B8C0CC` | Divisórias |
| `neutral.200` | `#D1D5DB` | Bordas claras |
| `neutral.100` | `#E5E7EB` | Fundo neutro claro |
| `neutral.50` | `#F8FAFC` | Fundo quase branco |

---

## 4. Tipografia

### 4.1 Fonte oficial

| Token | Fonte |
|---|---|
| `font.family.base` | `Manrope`, `Inter`, `Arial`, `sans-serif` |

A fonte oficial do **Probator-AI** é **Manrope**.

### 4.2 Escala tipográfica

| Token | Tamanho | Peso | Linha | Uso |
|---|---:|---:|---:|---|
| `display` | `96px` | `400` | `1.0` | Demonstrações, hero ou destaque visual grande |
| `heading-xl` | `48px` | `600` | `1.1` | Títulos principais de tela |
| `heading-lg` | `32px` | `600` | `1.2` | Títulos de seção |
| `heading-md` | `24px` | `600` | `1.3` | Subtítulos e títulos de cards |
| `body-lg` | `20px` | `400` | `1.5` | Texto de destaque |
| `body-md` | `16px` | `400` | `1.5` | Texto padrão do sistema |
| `body-sm` | `14px` | `400` | `1.4` | Texto auxiliar |
| `label` | `14px` | `600` | `1.2` | Labels, botões e badges |
| `caption` | `12px` | `400` | `1.3` | Legendas e metadados |

### 4.3 Regras de tipografia

- Use `heading-xl` apenas para o título principal da página.
- Use `heading-md` para títulos de cards e blocos.
- Use `body-md` como texto padrão.
- Use `body-sm` e `caption` para informações auxiliares.
- Evite pesos muito pesados; a tela de referência usa uma aparência leve e limpa.

---

## 5. Espaçamento

Escala baseada em múltiplos de `4px`.

| Token | Valor |
|---|---:|
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `20px` |
| `space.6` | `24px` |
| `space.8` | `32px` |
| `space.10` | `40px` |
| `space.12` | `48px` |
| `space.16` | `64px` |

### Uso recomendado

| Contexto | Espaçamento sugerido |
|---|---:|
| Padding de botão | `12px 24px` |
| Padding de input | `0 16px` |
| Padding de card | `24px` |
| Gap entre componentes | `16px` a `24px` |
| Espaço entre seções | `32px` a `48px` |
| Margem lateral em desktop | `24px` a `40px` |

---

## 6. Bordas e raios

| Token | Valor | Uso |
|---|---:|---|
| `radius.sm` | `8px` | Inputs pequenos, badges e tags |
| `radius.md` | `12px` | Botões e campos |
| `radius.lg` | `20px` | Cards menores |
| `radius.xl` | `24px` | Cards principais e containers |
| `radius.2xl` | `28px` | Grandes blocos visuais |
| `radius.full` | `999px` | Ícones circulares e navegação pill |

A tela de referência usa cantos bastante arredondados, principalmente em cards, áreas de navegação e botões de ícone.

---

## 7. Sombras

| Token | Valor | Uso |
|---|---|---|
| `shadow.sm` | `0 1px 2px rgba(15, 23, 42, 0.08)` | Componentes discretos |
| `shadow.md` | `0 4px 12px rgba(15, 23, 42, 0.10)` | Cards e menus |
| `shadow.lg` | `0 12px 32px rgba(15, 23, 42, 0.14)` | Modais, popovers e elementos elevados |

Na interface base, as sombras devem ser leves. A hierarquia visual deve vir principalmente de cor, espaçamento e bordas arredondadas.

---

## 8. Componentes visuais

## 8.1 Botão primário

Uso: ação principal da tela, como **Gerar prova**, **Salvar prova**, **Criar questão** ou **Confirmar correção**.

| Propriedade | Valor |
|---|---|
| Fundo | `primary.700` ou `#665600` |
| Texto | `#FFFFFF` |
| Raio | `12px` |
| Padding | `12px 24px` |
| Fonte | `label` |
| Peso | `600` |

### Estados

| Estado | Comportamento |
|---|---|
| `default` | Fundo `primary.700` |
| `hover` | Fundo `primary.600` |
| `active` | Fundo `primary.800` |
| `focus` | Outline dourado visível |
| `disabled` | Opacidade `40%`, sem interação |

---

## 8.2 Botão secundário

Uso: ações complementares, como **Cancelar**, **Filtrar**, **Voltar** ou **Limpar seleção**.

| Propriedade | Valor |
|---|---|
| Fundo | `background.surface-soft` |
| Texto | `text.primary` |
| Raio | `12px` |
| Padding | `12px 24px` |

---

## 8.3 Botão invertido

Uso: ação com alto contraste em áreas claras.

| Propriedade | Valor |
|---|---|
| Fundo | `secondary.600` |
| Texto | `text.inverted` |
| Raio | `12px` |
| Padding | `12px 24px` |

---

## 8.4 Botão outlined

Uso: ação alternativa, menos prioritária ou opção dentro de um grupo de botões.

| Propriedade | Valor |
|---|---|
| Fundo | `transparent` |
| Borda | `1px solid primary.600` |
| Texto | `text.primary` |
| Raio | `12px` |
| Padding | `12px 24px` |

---

## 8.5 Input de busca

Uso: busca de provas, questões, disciplinas, alunos e correções.

| Propriedade | Valor |
|---|---|
| Altura | `56px` |
| Fundo | `background.surface-soft` |
| Borda | `1px solid #C9B16A` |
| Raio | `8px` |
| Ícone | `neutral.400` |
| Placeholder | `neutral.500` |
| Texto | `text.primary` |
| Padding horizontal | `16px` |

Placeholder recomendado em português:

```txt
Buscar
```

---

## 8.6 Card

Uso: agrupamento de conteúdo, blocos de formulário, listas de provas, banco de questões e painéis de IA.

| Propriedade | Valor |
|---|---|
| Fundo | `background.surface` |
| Raio | `24px` |
| Padding | `24px` |
| Sombra | Opcional, `shadow.sm` |
| Borda | Opcional, `1px solid border.soft` |

---

## 8.7 Barra de progresso

Uso: progresso de geração de prova, etapas de criação, upload ou correção.

| Elemento | Valor |
|---|---|
| Fundo da trilha | `background.surface-soft` |
| Progresso principal | `primary.700` |
| Progresso secundário | `secondary.400` |
| Progresso neutro | `neutral.600` |
| Altura | `8px` |
| Raio | `999px` |

---

## 8.8 Navegação inferior ou compacta

Uso: navegação principal em telas compactas, dashboards ou painéis internos.

| Propriedade | Valor |
|---|---|
| Container | `background.surface-soft` |
| Raio | `24px` ou `999px` |
| Item ativo | `primary.700` |
| Ícone ativo | `#FFFFFF` |
| Ícones inativos | `text.brand` ou `neutral.700` |
| Padding | `12px 24px` |
| Gap | `32px` |

---

## 8.9 Botões de ícone

| Tipo | Fundo | Ícone | Uso |
|---|---|---|---|
| `icon.primary` | `primary.700` | `#FFFFFF` | Ação principal, IA ou destaque |
| `icon.secondary` | `secondary.400` | `#FFFFFF` | Ação secundária |
| `icon.neutral` | `neutral.700` | `#FFFFFF` | Ação neutra |
| `icon.danger` | `danger` | `#FFFFFF` | Excluir ou remover |

### Tamanhos

| Token | Valor |
|---|---:|
| `icon-button.sm` | `32px` |
| `icon-button.md` | `44px` |
| `icon-button.lg` | `56px` |

---

## 8.10 Badge / Label

Uso: status de prova, categoria, nível de dificuldade, disciplina, tipo de questão ou tag de IA.

| Propriedade | Valor |
|---|---|
| Fundo | `primary.300` |
| Texto | `text.brand` |
| Ícone | `text.brand` |
| Raio | `8px` |
| Padding | `8px 16px` |
| Fonte | `label` |

Exemplos de labels para o Probator-AI:

- `IA`
- `Fácil`
- `Médio`
- `Difícil`
- `Objetiva`
- `Discursiva`
- `Correção pendente`

---

## 9. Ícones

### Estilo recomendado

- Ícones lineares.
- Espessura entre `1.75px` e `2px`.
- Cantos arredondados.
- Tamanho padrão: `20px` ou `24px`.
- Biblioteca recomendada: **Lucide React**.

### Ícones identificados na tela

| Ícone | Uso sugerido no Probator-AI |
|---|---|
| Home | Dashboard |
| Search | Busca de provas, questões e alunos |
| User | Perfil ou conta |
| Edit | Editar prova ou questão |
| Magic Wand | Gerar com IA |
| Shapes | Categorias, tipos de questão ou módulos |
| Tag | Marcadores e assuntos |
| Trash | Excluir item |

---

## 10. Acessibilidade

### 10.1 Contraste

- Textos principais devem manter contraste mínimo de `4.5:1`.
- Botões primários dourados devem usar texto branco somente quando o fundo estiver escurecido.
- Para fundos dourados claros, prefira texto escuro `#4B3F00`.
- Ícones em botões circulares devem ter contraste alto com o fundo.

### 10.2 Foco visível

Todo componente interativo deve possuir foco visível:

```css
outline: 2px solid #D4AF37;
outline-offset: 2px;
```

### 10.3 Área mínima de clique

| Elemento | Mínimo recomendado |
|---|---:|
| Botões | `44px` de altura |
| Botões de ícone | `44px x 44px` |
| Inputs | `44px` de altura |
| Distância entre ações | `8px` |

---

## 11. Regras de uso visual

### Use dourado para

- Ação principal.
- Estado selecionado.
- Destaques de IA.
- Progresso principal.
- Labels importantes.

### Use azul escuro para

- Botões invertidos.
- Títulos fortes.
- Áreas de contraste.
- Componentes institucionais.

### Use tons claros para

- Fundo de página.
- Cards.
- Inputs.
- Containers de navegação.
- Áreas internas de formulário.

### Use vermelho apenas para

- Excluir.
- Remover.
- Erros críticos.
- Ações destrutivas.

---

## 12. Padrão visual para telas do Probator-AI

### Dashboard

- Fundo `background.page`.
- Cards em `background.surface`.
- Ação principal com botão dourado escuro.
- Indicadores e status em badges.

### Banco de questões

- Busca com input claro e borda dourada suave.
- Filtros em botões secundários ou outlined.
- Níveis de dificuldade como badges.

### Criação de prova com IA

- Botão principal com ícone de varinha/magic wand.
- Etapas com barra de progresso.
- Cards separados para configurações, questões selecionadas e prévia.

### Correção de provas

- Estados de correção com cores semânticas.
- Ações destrutivas sempre em vermelho.
- Informações auxiliares em `text.secondary` ou `text.muted`.

---

# Parte 2 — Implementação com Tailwind CSS

## 13. Instalação da fonte Manrope

### Opção com Google Fonts no CSS global

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
```

Depois, configure a fonte no Tailwind.

---

## 14. Configuração Tailwind

Exemplo de `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FFF7D6',
          100: '#FFE6A0',
          200: '#F0D060',
          300: '#D4AF37',
          400: '#B89720',
          500: '#9B8100',
          600: '#806B00',
          700: '#665600',
          800: '#4B3F00',
          900: '#2F2700',
          950: '#1F1900',
        },
        secondary: {
          50: '#E7F0FC',
          100: '#C9D8F2',
          200: '#93A5C0',
          300: '#6F819D',
          400: '#50627C',
          500: '#344762',
          600: '#1A2B48',
          700: '#132742',
          800: '#0B1D33',
          900: '#07111F',
          950: '#020617',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#B8C0CC',
          400: '#9CA3AF',
          500: '#7C8798',
          600: '#64748B',
          700: '#4B5563',
          800: '#374151',
          900: '#1F2933',
          950: '#111827',
        },
        page: '#C9D8F2',
        surface: '#E7F0FC',
        surfaceSoft: '#DDEBFA',
        danger: '#D01818',
        success: '#2E7D32',
        warning: '#D4AF37',
        info: '#64748B',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '24px',
        '2xl': '28px',
        full: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(15, 23, 42, 0.08)',
        md: '0 4px 12px rgba(15, 23, 42, 0.10)',
        lg: '0 12px 32px rgba(15, 23, 42, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 15. Tokens CSS opcionais

Caso o projeto precise expor tokens globais no `globals.css`:

```css
:root {
  --color-primary: #D4AF37;
  --color-secondary: #1A2B48;
  --color-tertiary: #F8FAFC;
  --color-neutral: #64748B;

  --background-page: #C9D8F2;
  --background-surface: #E7F0FC;
  --background-surface-soft: #DDEBFA;

  --text-primary: #0B1D33;
  --text-secondary: #4B5563;
  --text-muted: #7C8798;
  --text-inverted: #F8FAFC;
  --text-brand: #4B3F00;

  --border-default: #C9B16A;
  --border-soft: #D8E4F4;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 28px;
  --radius-full: 999px;

  --font-family-base: 'Manrope', 'Inter', Arial, sans-serif;
}
```

---

## 16. Classes base recomendadas

### Layout da página

```tsx
<div className="min-h-screen bg-page font-sans text-secondary-800">
  <main className="mx-auto max-w-7xl px-6 py-8">
    {/* conteúdo */}
  </main>
</div>
```

### Card

```tsx
<section className="rounded-xl bg-surface p-6 shadow-sm">
  {/* conteúdo do card */}
</section>
```

### Botão primário

```tsx
<button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary-700 px-6 text-sm font-semibold text-white transition hover:bg-primary-600 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
  Gerar prova
</button>
```

### Botão secundário

```tsx
<button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-surfaceSoft px-6 text-sm font-semibold text-secondary-800 transition hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
  Cancelar
</button>
```

### Botão outlined

```tsx
<button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary-600 bg-transparent px-6 text-sm font-semibold text-secondary-800 transition hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">
  Ver detalhes
</button>
```

### Input de busca

```tsx
<div className="relative w-full max-w-md">
  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
  <input
    type="search"
    placeholder="Buscar"
    className="h-14 w-full rounded-sm border border-[#C9B16A] bg-surfaceSoft pl-12 pr-4 text-base text-secondary-800 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-300"
  />
</div>
```

### Badge / Label

```tsx
<span className="inline-flex items-center gap-2 rounded-sm bg-primary-300 px-4 py-2 text-sm font-semibold text-primary-800">
  IA
</span>
```

### Botão de ícone

```tsx
<button className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-white transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2">
  <Wand2 className="h-5 w-5" />
</button>
```

### Barra de progresso

```tsx
<div className="h-2 w-full overflow-hidden rounded-full bg-surfaceSoft">
  <div className="h-full rounded-full bg-primary-700" style={{ width: '70%' }} />
</div>
```

---

## 17. Componente exemplo — Button

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'danger'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800',
  secondary: 'bg-surfaceSoft text-secondary-800 hover:bg-secondary-100',
  inverted: 'bg-secondary-600 text-white hover:bg-secondary-700',
  outlined: 'border border-primary-600 bg-transparent text-secondary-800 hover:bg-primary-50',
  danger: 'bg-danger text-white hover:brightness-95',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}
```

---

## 18. Componente exemplo — Card

```tsx
type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-surface p-6 shadow-sm ${className}`}
      {...props}
    />
  )
}
```

---

## 19. Componente exemplo — SearchInput

```tsx
import { Search } from 'lucide-react'

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        className="h-14 w-full rounded-sm border border-[#C9B16A] bg-surfaceSoft pl-12 pr-4 text-base text-secondary-800 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-primary-300"
        {...props}
      />
    </div>
  )
}
```

---

## 20. Sugestão de estrutura de pastas

```txt
src/
  components/
    ui/
      Button.tsx
      Card.tsx
      SearchInput.tsx
      Badge.tsx
      IconButton.tsx
  styles/
    globals.css
  lib/
    utils.ts
  pages/
  features/
```

---

## 21. Padrões de nomenclatura

### Tokens

Use nomes semânticos para intenção visual:

```txt
primary
secondary
surface
surfaceSoft
page
danger
success
warning
info
```

### Componentes

Use nomes claros e reutilizáveis:

```txt
Button
Card
SearchInput
Badge
IconButton
ProgressBar
BottomNavigation
```

---

## 22. Breakpoints recomendados

Como o Probator-AI é um Web App, recomenda-se seguir os breakpoints padrão do Tailwind:

| Prefixo | Largura mínima | Uso |
|---|---:|---|
| `sm` | `640px` | Celulares grandes |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Notebooks |
| `xl` | `1280px` | Desktop |
| `2xl` | `1536px` | Telas grandes |

---

## 23. Checklist de implementação

- [ ] Adicionar fonte Manrope ao projeto.
- [ ] Configurar tokens no `tailwind.config.ts`.
- [ ] Criar componentes base em `components/ui`.
- [ ] Aplicar `bg-page` no layout principal.
- [ ] Usar `bg-surface` para cards e containers.
- [ ] Usar `bg-primary-700` para ações principais.
- [ ] Garantir foco visível em todos os elementos interativos.
- [ ] Validar contraste dos botões dourados.
- [ ] Padronizar ícones com Lucide React.
- [ ] Documentar novos componentes conforme forem criados.

---

## 24. Pendências futuras

Para evoluir este design system, ainda pode ser definido:

- Logo oficial do Probator-AI.
- Modo escuro.
- Grid/layout padrão das telas principais.
- Componentes específicos: tabela, modal, dropdown, toast, tabs, stepper e sidebar.
- Estados vazios para listas de provas e questões.
- Padrões de feedback para geração com IA.
- Guia de tom de voz e microcopy.

