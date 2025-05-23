# API Reference

## Introdução

A API do FinFlow segue os princípios REST e utiliza JSON para serialização de dados. Todas as requisições devem ser feitas via HTTPS.

## Autenticação

```bash
curl -X POST https://api.finflow.com/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "seu@email.com", "password": "sua_senha"}'
```

### Headers Necessários

```http
Authorization: Bearer seu_token_jwt
Content-Type: application/json
```

## Endpoints

### Transações

#### Listar Transações

```http
GET /api/v1/transactions
```

**Parâmetros de Query:**
- `page`: número da página (default: 1)
- `limit`: itens por página (default: 20)
- `start_date`: data inicial (YYYY-MM-DD)
- `end_date`: data final (YYYY-MM-DD)
- `type`: tipo de transação (income/expense)
- `category`: categoria

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "description": "Pagamento",
      "amount": 1000.00,
      "type": "income",
      "category": "Salário",
      "date": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Criar Transação

```http
POST /api/v1/transactions
```

**Corpo:**
```json
{
  "description": "Pagamento",
  "amount": 1000.00,
  "type": "income",
  "category": "Salário",
  "date": "2025-01-01T10:00:00Z"
}
```

### Categorias

#### Listar Categorias

```http
GET /api/v1/categories
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Salário",
      "type": "income",
      "color": "#4CAF50"
    }
  ]
}
```

### Relatórios

#### Gerar Relatório

```http
POST /api/v1/reports
```

**Corpo:**
```json
{
  "type": "monthly",
  "date": "2025-01",
  "format": "pdf"
}
```

## Webhooks

### Configuração

```http
POST /api/v1/webhooks
```

**Corpo:**
```json
{
  "url": "https://seu-dominio.com/webhook",
  "events": ["transaction.created", "transaction.updated"]
}
```

## Rate Limiting

- 1000 requisições por hora para planos Enterprise
- 100 requisições por hora para planos Basic
- Headers de resposta incluem limite e uso atual

## Códigos de Erro

| Código | Significado |
|--------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Versionamento

A API é versionada através do prefixo na URL: `/v1/`

## SDKs Oficiais

- [JavaScript](https://github.com/finflow/js-sdk)
- [Python](https://github.com/finflow/python-sdk)
- [Java](https://github.com/finflow/java-sdk)
- [.NET](https://github.com/finflow/dotnet-sdk)

## Exemplos

### Node.js
```javascript
const FinFlow = require('@finflow/sdk');

const client = new FinFlow({
  apiKey: 'seu_api_key'
});

const transactions = await client.transactions.list({
  limit: 10,
  type: 'income'
});
```

### Python
```python
from finflow import FinFlow

client = FinFlow(api_key='seu_api_key')

transactions = client.transactions.list(
    limit=10,
    type='income'
)
```

## Suporte

Para suporte relacionado à API:
- Email: api@finflow.com.br
- Documentação: docs.finflow.com.br
- Status: status.finflow.com.br