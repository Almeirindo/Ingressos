# 🎟️ IngressosDaBanda  

**Os melhores eventos em um só lugar.**  
Aplicação completa para compra e gestão de ingressos de eventos em Angola.  

![Hero Section](./docs/hero-preview.png)  
*Interface inicial da aplicação.*  

---

## 🚀 Tecnologias Utilizadas  

### **Frontend**
- ⚛️ [React.js](https://reactjs.org/) — biblioteca para construção de interfaces  
- 🎨 [TailwindCSS](https://tailwindcss.com/) — estilização rápida e responsiva  
- 🌀 [TypeScript](https://www.typescriptlang.org/) — tipagem estática para maior robustez  
- 🔗 [React Icons](https://react-icons.github.io/react-icons/) — ícones modernos e acessíveis  

### **Backend**
- 🟢 [Node.js](https://nodejs.org/) — ambiente de execução JavaScript no servidor  
- 🚂 [Express.js](https://expressjs.com/) — framework minimalista para APIs  
- 🗄️ [Prisma ORM](https://www.prisma.io/) — mapeamento de dados para MySQL  
- 🐬 [MySQL](https://www.mysql.com/) — banco de dados relacional  
- 🔒 [JWT](https://jwt.io/) — autenticação segura por tokens  
- ✉️ [Nodemailer](https://nodemailer.com/) — envio de emails  
- 🔑 [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) — hashing de senhas  
- 📱 [Twilio](https://www.twilio.com/) — envio de SMS  

---

## ✨ Funcionalidades
- Cadastro e login de usuários (com autenticação JWT)  
- Diferentes perfis: **usuário** e **administrador**  
- Listagem e compra de ingressos online  
- Gestão de eventos (admin)  
- Gestão de usuários e compras (admin)  
- Envio de confirmações por **email** e **SMS**  
- Design moderno e responsivo, adaptado a desktop e mobile  

---

## 📸 Demonstração
- **Home Page** com destaque para eventos e chamadas para ação  
- **Dashboard do Usuário** para acompanhar compras  
- **Área Administrativa** para gerenciar eventos e usuários  

---

## 🛠️ Como Executar o Projeto  

### Pré-requisitos
- Node.js >= 18  
- MySQL rodando localmente ou em container  

### Passos
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ingressos-da-banda.git

# Acesse a pasta
cd ingressos-da-banda

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)
cp .env.example .env

# Rode as migrations do Prisma
npx prisma migrate dev

# Inicie o backend
npm run dev:server

# Inicie o frontend
npm run dev
