# EcoPickup - Agent Execution Rules

## Fonte canonica

- `docs/ops/backlog.md` e a fonte canonica de prioridade e ordem.
- `docs/ops/status.md` e o estado executivo atual.
- `status.md` nao substitui o backlog.

## Regra fixa de inicio

Antes de qualquer trabalho, o agente deve:

1. localizar onde o projeto parou usando backlog e status
2. identificar a proxima task `READY` coerente no backlog canonico
3. confirmar se essa task esta bloqueada por dependencias, autorizacao, custos ou decisoes abertas
4. executar apenas uma task por vez

## Execucao

O agente deve:

- executar com escopo minimo e controlado
- nao abrir nova frente por conta propria
- nao ampliar escopo
- nao refatorar por conveniencia
- documentar apenas o necessario para manter o projeto operacionalmente claro
- validar na pratica sempre que a slice for tecnica
- nao assumir sucesso sem evidencia real
- registrar comandos reais, testes, bloqueios e resultado
- se houver bloqueio, parar no bloqueio, explicar a causa e propor a menor correcao possivel

## Documentacao

Quando a slice alterar regras, arquitetura, operacao, deploy, runtime ou comportamento:

- atualizar a documentacao impactada no mesmo recorte
- manter backlog e status alinhados
- nao registrar trabalho incompleto como `DONE`

Quando a slice for apenas documental:

- deixar explicito que nao houve implementacao tecnica
- validar consistencia documental

## Validacao

Quando a slice for tecnica:

- executar os gates compativeis com os arquivos tocados
- registrar evidencia real dos comandos
- documentar falhas, reruns e permissoes especiais quando ocorrerem

Quando a slice for documental:

- validar consistencia do texto e do backlog/status
- nao executar gates tecnicos sem necessidade

## Commit

Regras:

- `READY` nao gera commit por si so
- `IN_PROGRESS` nao gera commit final
- `DONE` representa entrega concluida e apta a commit
- commit acontece quando houver entrega real fechada, validada e coesa
- evitar commit apenas por fila/prioridade no backlog, salvo quando a propria slice for documental e esse for o entregavel
- nao misturar mudancas nao relacionadas
- usar mensagens em ingles e Conventional Commits

Depois de concluir uma slice:

1. verificar se ficou em condicao de commit
2. se ficou, preparar ou executar o commit conforme instrucao vigente
3. localizar a proxima `READY` no backlog
4. informar o proximo passo exato recomendado

## Proxima READY bloqueada

Se a proxima `READY` exigir provisionamento externo, custo, deploy real, secrets reais ou acesso fora do repositorio:

- nao executar sem autorizacao explicita
- registrar o bloqueio
- solicitar ou listar as decisoes necessarias
- nao criar uma frente alternativa por conta propria

## Formato padrao de resposta

Responder objetivamente com:

1. esta de acordo ou nao
2. o que foi feito
3. o que foi validado
4. bloqueios/gaps
5. se ficou em condicao de commit
6. commit realizado ou mensagem sugerida
7. proxima `READY` no backlog
8. proximo passo exato recomendado

## Economia de contexto

- nao reexplicar o protocolo inteiro em toda resposta
- nao repetir restricoes ja conhecidas
- detalhar mais apenas quando houver risco, bloqueio ou decisao importante
