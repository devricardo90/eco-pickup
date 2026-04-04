# Testing Rules

## Objetivo

Definir a abordagem de testes antes da implementacao.

## Principios

- nenhum item entra como `DONE` sem criterio de aceite verificavel
- testar no nivel mais barato que valide o comportamento esperado
- contratos compartilhados devem ter validacao automatizavel quando existirem
- bugs regressivos devem resultar em cobertura adequada

## Estrategia inicial

- API: testes unitarios e de integracao para regras e endpoints
- Web: testes de componentes e fluxos essenciais
- Contratos: validacao de consistencia entre consumidor e provedor quando aplicavel

## Regras operacionais

- cada historia tecnica relevante deve declarar expectativa de verificacao
- backlog deve indicar quando um item exige teste automatizado
- status resumido nao substitui evidencia tecnica de validacao

## Nao fazer nesta fase

- nao criar suite de testes antes do scaffolding base
- nao inventar cobertura artificial sem comportamento implementado

## Dependencias

- definicao da ferramenta de monorepo
- subida da API base e da web base
- definicao inicial de pipeline local
