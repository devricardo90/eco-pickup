# Security Rules

## Objetivo

Estabelecer diretrizes minimas de seguranca para a foundation do projeto.

## Regras iniciais

- aplicar principio de minimo privilegio desde o desenho inicial
- limitar coleta de dados pessoais ao necessario para a operacao
- nao expor segredos em repositorio
- usar variaveis de ambiente para configuracoes sensiveis
- registrar requisitos de autenticacao e autorizacao antes da implementacao

## Dados e privacidade

- tratar dados de contato e endereco como sensiveis do ponto de vista operacional
- evitar logar payloads completos com dados pessoais
- definir politica de retencao posteriormente, antes de producao

## Aplicacao e API

- validar entrada em todos os boundaries
- padronizar erros sem vazar detalhes internos
- prever separacao entre acessos administrativos e acessos de usuario final
- armazenar senha apenas com hash seguro
- emitir tokens JWT com expiracao curta e chave de assinatura controlada
- manter roles basicas explicitamente separadas entre `USER` e `ADMIN`

## Infra e operacao

- imagens Docker devem evitar dependencia desnecessaria
- segredos nao devem ser versionados em arquivos locais
- pipeline futuro deve incluir verificacoes de seguranca e dependencia

## Pendencias para validacao

- requisitos legais especificos da Suecia e da UE aplicaveis ao produto
- estrategia de refresh token e revogacao
- regras de consentimento e retencao

## Riscos

- discovery insuficiente sobre dados pessoais pode gerar retrabalho
- falta de separacao de papeis pode comprometer governanca do produto
