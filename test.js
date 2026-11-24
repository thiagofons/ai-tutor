async function testarFluxo() {
  console.log('1. Enviando POST para criar o job...');
  const res = await fetch('http://localhost:8080/api/itens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Teste via Node.js' }),
  });

  if (!res.ok) {
    throw new Error(`Erro no POST: ${res.status} ${await res.text()}`);
  }

  const { jobId, topic } = await res.json();
  console.log(`2. Job criado! ID: ${jobId} | Conectando ao SSE: ${topic}`);

  const sseRes = await fetch(`http://localhost:8080${topic}`, {
    headers: { Accept: 'text/event-stream' },
  });

  const reader = sseRes.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('4. Stream encerrado pelo servidor.');
      break;
    }
    console.log('3. Evento SSE recebido:\n' + decoder.decode(value));
  }
}

testarFluxo().catch(console.error);