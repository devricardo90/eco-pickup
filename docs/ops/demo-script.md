# EcoPickup - Portfolio Demo Script (EPIC-018B)

## Objetivo
Demonstrar a jornada principal do EcoPickup (MVP) em até 2 minutos, destacando a proposta de valor sustentável e a solidez técnica da plataforma.

## Preparação Operacional (Warm-up)
- **Atenção:** A API no Render possui *cold start*.
- **Ação:** Acessar `https://ecopickup-api-stg.onrender.com/health` 1 minuto antes de iniciar a demonstração para garantir respostas imediatas.

## Dados Sugeridos para Demo (Profissional)
- **User:** `alex.green@example.com`
- **Pickup Request:** `Living Room Furniture Upgrade`
- **Items:**
  - 1x `Large Sofa` (Good condition, needs recycling)
  - 1x `Wooden Coffee Table` (Minor scratches)
- **Address:** `742 Evergreen Terrace, Eco District, Floor 2`

---

## Roteiro da Jornada (Est. 1m50s)

### 1. Landing Page (0s - 20s)
- **Ação:** Mostrar a Home Page (`/`).
- **Foco:** Destacar a proposta de valor English-first: *"Your solution for conscious and sustainable disposal"*.
- **Narrativa:** "EcoPickup connects users with sustainable collection services for items that need a second life or proper recycling."
- **📸 Screenshot:** `01-landing.png`

### 2. Authentication (20s - 45s)
- **Ação:** Clicar em "Sign in" ou "Get started".
- **Foco:** Mostrar a interface de login/registro limpa, sem jargões técnicos.
- **Narrativa:** "The onboarding process is smooth and focuses on a clean user experience."
- **📸 Screenshot:** `02-auth-ui.png`

### 3. User Dashboard (45s - 1m00s)
- **Ação:** Após o login, mostrar a lista de solicitações.
- **Foco:** Mostrar que o usuário já tem um contexto (se houver requests anteriores) ou um convite claro para a primeira coleta.
- **📸 Screenshot:** `03-dashboard.png`

### 4. Create New Request (1m00s - 1m30s)
- **Ação:** Clicar em "Request collection" e preencher os dados sugeridos.
- **Foco:** Mostrar a complexidade do formulário (multi-itens, endereço, janela de coleta).
- **📸 Screenshot:** `04-request-form.png`

### 5. Submission & Success (1m30s - 1m40s)
- **Ação:** Clicar em "Submit Request".
- **Foco:** O feedback visual de processamento e redirecionamento.
- **📸 Screenshot:** `05-submission-success.png`

### 6. Tracking & Timeline (1m40s - 2m00s)
- **Ação:** Visualizar o detalhe da solicitação recém-criada (`/tracking/:id`).
- **Foco:** A Timeline dinâmica e o status consolidado.
- **Narrativa:** "Every request is tracked in real-time, providing transparency from submission to final disposal."
- **📸 Screenshot:** `06-tracking-timeline.png`

---

## Limitações e Roadmap (Honest Disclosure)
- **Photo Upload (Object Storage):** Atualmente em desenvolvimento (Roadmap). O MVP foca na persistência estrutural e integridade dos dados de inventário.
- **Pricing/Payment:** No estágio atual, o pricing é definido administrativamente e o fluxo de pagamento segue a fundação técnica validada, mas pode ser simulado via admin dashboard para demos profundas.

## Checklist de Capturas Técnicas
- [ ] 01-landing.png (High Resolution)
- [ ] 02-auth-ui.png (Login screen)
- [ ] 03-dashboard.png (Empty or with requests)
- [ ] 04-request-form.png (Filled with demo data)
- [ ] 05-submission-success.png (Success message/state)
- [ ] 06-tracking-timeline.png (Full detail view)
