const BASE_URL = 'http://localhost:4000'; // Ajuste para 4000 se estiver rodando via Docker Compose

const CREDENTIALS = {
  email: 'thiagofa2506@gmail.com',
  password: 'batman123',
};

async function testarFluxo() {
  // 1. Autenticação
  console.log('1. Autenticando em /auth/login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!loginRes.ok) {
    throw new Error(`Erro no login: ${loginRes.status} ${await loginRes.text()}`);
  }

  const loginData = await loginRes.json();
  // Suporta os nomes de campo mais comuns retornados pelo backend (token, accessToken ou jwt)
  console.log('Login response:', loginData);

  const token = loginData.token || loginData.accessToken || loginData.jwt;

  if (!token) {
    throw new Error(`Token não encontrado na resposta do login: ${JSON.stringify(loginData)}`);
  }

  console.log('   Token JWT obtido com sucesso.');

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
  };

  // 2. Criação do Job (rota privada)
  console.log('2. Enviando POST para criar o job...');
  const res = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: 'Qual é o sentido da vida?' }),
  });

  if (!res.ok) {
    throw new Error(`Erro no POST: ${res.status} ${await res.text()}`);
  }

  const { jobId, topic } = await res.json();
  console.log(`3. Job criado! ID: ${jobId} | Conectando ao SSE: ${topic}`);

  // 3. Escuta do SSE (rota privada)
  const sseRes = await fetch(`${BASE_URL}${topic}`, {
    headers: {
      ...authHeaders,
      'Accept': 'text/event-stream',
    },
  });

  if (!sseRes.ok) {
    throw new Error(`Erro ao conectar no SSE: ${sseRes.status} ${await sseRes.text()}`);
  }

  const reader = sseRes.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('5. Stream encerrado pelo servidor.');
      break;
    }
    console.log('4. Evento SSE recebido:\n' + decoder.decode(value));
  }
}

testarFluxo().catch(console.error);