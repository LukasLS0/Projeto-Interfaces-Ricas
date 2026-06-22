import express from 'express';
import cors from 'cors';
import { autenticar, autenticarMiddleware } from './auth.ts';

// Reaproveitando a interface do seu Angular
export interface IpBloqueado {
  id: number;
  ip: string;
  tentativas: number;
  bloqueado: boolean;
  origem: string;
}

const app = express();
app.use(cors()); // Permite que o Angular (portas diferentes) acesse a API
app.use(express.json());

// Dados iniciais (Mockados em memória)
let dados: IpBloqueado[] = [
  { id: 1, ip: '192.168.0.14', tentativas: 24, bloqueado: true, origin: 'Firewall' },
  { id: 2, ip: '10.0.1.53', tentativas: 11, bloqueado: true, origin: 'IDS' },
  { id: 3, ip: '172.16.4.8', tentativas: 6, bloqueado: false, origin: 'Login web' },
].map(d => ({ ...d, origem: d.origin })); // Ajuste para a propriedade 'origem' em português

// --- ROTA DE AUTENTICAÇÃO (pública) ---

// Login: recebe usuário e senha e devolve um token JWT.
app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body ?? {};

  if (!usuario || !senha) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  const token = autenticar(usuario, senha);

  if (!token) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }

  res.json({ token, usuario });
});

// A partir daqui, todas as rotas /api/ips exigem um token JWT válido.
app.use('/api/ips', autenticarMiddleware);

// --- ROTAS DA API (protegidas) ---

// 1. Listar todos
app.get('/api/ips', (req, res) => {
  res.json(dados);
});

// 2. Buscar por ID
app.get('/api/ips/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const registro = dados.find(ip => ip.id === id);
  if (!registro) return res.status(404).json({ message: 'IP não encontrado' });
  res.json(registro);
});

// 3. Inserir (Salvar)
app.post('/api/ips', (req, res) => {
  const dto: Omit<IpBloqueado, 'id'> = req.body;
  const newId = dados.length > 0 ? Math.max(...dados.map(ip => ip.id)) + 1 : 1;
  
  const novoRegistro: IpBloqueado = {
    ...dto,
    id: newId
  };
  
  dados.push(novoRegistro);
  res.status(201).json(novoRegistro);
});

// 4. Atualizar
app.put('/api/ips/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = dados.findIndex(ip => ip.id === id);
  
  if (index === -1) return res.status(404).json({ message: 'IP não encontrado' });
  
  dados[index] = { ...req.body, id }; // Garante que o ID continua o mesmo
  res.json(dados[index]);
});

// 5. Remover
app.delete('/api/ips/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  dados = dados.filter(ip => ip.id !== id);
  res.status(204).send();
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});