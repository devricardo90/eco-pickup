# EcoPickup - Staging Landing Validation (EPIC-017B)

## Data da Validação
2026-05-02

## Ambiente
- URL Frontend: https://eco-pickup-web.vercel.app
- URL API (Health): https://ecopickup-api-stg.onrender.com/health

## Checklist de Validação

| Item | Status | Observações |
|---|---|---|
| 1. Acesso Desktop | PASS | Validado via HEAD request e feedback do auditor. |
| 2. Acesso Mobile/Responsivo | PASS | Feedback do auditor: acessível. |
| 3. Ausência de quebras visuais | PASS | Feedback do auditor: landing acessível e consistente. |
| 4. Mensagem coerente | PASS | Copy principal reflete produto real (EcoPickup). |
| 5. CTA principal visível/claro | PASS | "Começar agora" e "Entrar" visíveis. |
| 6. Rotas do CTA não dão 404 | PASS | `/auth/register` e `/auth/login` retornam 200 OK. |
| 7. Sem promessas de R2/fotos prontas | PASS | Nenhuma promessa de upload identificada na landing. |
| 8. Navegação funcional | PASS | Links de navegação operacionais (200 OK). |
| 9. Caminho de request público alcançável | PASS | Fluxo via "Começar agora" operacional. |

## Evidências e Achados

### 1. Validação de Conectividade (Terminal)
- `GET https://ecopickup-api-stg.onrender.com/health` -> **200 OK (Healthy)**
- `HEAD https://eco-pickup-web.vercel.app` -> **200 OK**
- `HEAD https://eco-pickup-web.vercel.app/auth/register` -> **200 OK**
- `HEAD https://eco-pickup-web.vercel.app/auth/login` -> **200 OK**

### 2. Observações do Auditor
- Landing pública acessível com linguagem de produto real.
- CTA "Começar agora" direciona corretamente para cadastro.
- CTA "Entrar" direciona corretamente para login.
- **Páginas de autenticação:** Mantêm linguagem técnica/interna (ex: "slice", "backend auth flow").

## Classificação de Problemas Remanescentes

| Severidade | Problema | Descrição |
|---|---|---|
| MEDIUM | Linguagem técnica em Auth | Páginas de login/cadastro ainda exibem termos como "existing backend auth flow", "slice", "operational mutations". |
| MEDIUM | Landing Portuguese-first | A landing page pública está em Português-BR. |
| PASS | API Health | Estável (200 OK) após revalidação técnica. O 503 anterior foi pontual ou cold-start. |

## Conclusão e Recomendação
A landing page está operacional e cumpre o papel de vitrine funcional. O problema crítico de API (503) não foi reproduzido, estando saudável no momento.

### Decisão Estratégica: English-First
- **Impacto:** O estado atual (Portuguese-first) é aceitável para validação local e técnica, mas possui impacto negativo na percepção de valor para portfólio e recrutadores internacionais.
- **Decisão:** O public showcase do EcoPickup deve ser transicionado para **English-first** para maximizar o alcance internacional.
- **Recomendação:** Fechar EPIC-017B com achados. Tratar a correção da linguagem técnica e a transição de idioma na tarefa futura **EPIC-017C — Make Public Showcase English-First**.
