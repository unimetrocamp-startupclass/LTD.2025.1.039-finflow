# Funcionalidade de Relatórios - Principais Códigos

## Exportação de Relatórios (TransactionManager)

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

class TransactionManager {
  // Exportação para PDF
  exportToPDF(): void {
    const doc = new jsPDF();
    const total = this.getTotal();

    // Título
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 14, 20);

    // Saldo total
    doc.setFontSize(14);
    doc.text(`Saldo Total: R$ ${total.toFixed(2)}`, 14, 30);

    // Tabela de transações
    const tableData = this.transactions.map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.category,
      t.type === 'income' ? 'Receita' : 'Despesa',
      `R$ ${t.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    doc.save('relatorio-financeiro.pdf');
  }

  // Exportação para Excel
  exportToExcel(): void {
    const data = this.transactions.map(t => ({
      Data: new Date(t.date).toLocaleDateString('pt-BR'),
      Descrição: t.description,
      Categoria: t.category,
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
      Valor: t.amount.toFixed(2)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 12 }, // Data
      { wch: 30 }, // Descrição
      { wch: 15 }, // Categoria
      { wch: 10 }, // Tipo
      { wch: 12 }  // Valor
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'relatorio-financeiro.xlsx');
  }
}
```

## Interface dos Botões de Exportação (React)

```jsx
<div className="flex gap-2">
  <button
    onClick={() => manager.exportToPDF()}
    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
  >
    <FileDown size={18} />
    PDF
  </button>
  <button
    onClick={() => manager.exportToExcel()}
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
  >
    <FileDown size={18} />
    Excel
  </button>
</div>
```

## Principais Características

1. **Exportação PDF**:
   - Título e cabeçalho formatados
   - Tabela com dados completos
   - Cores personalizadas
   - Formatação em português
   - Saldo total incluído

2. **Exportação Excel**:
   - Planilha organizada
   - Colunas dimensionadas
   - Cabeçalhos em português
   - Formatação de valores
   - Nome das colunas otimizado

3. **Interface**:
   - Botões com ícones intuitivos
   - Cores distintas para cada formato
   - Feedback visual ao interagir
   - Posicionamento estratégico
   - Design responsivo

4. **Dados Exportados**:
   - Data formatada em pt-BR
   - Descrição completa
   - Categoria da transação
   - Tipo (Receita/Despesa)
   - Valor formatado em reais

5. **Bibliotecas Utilizadas**:
   - jsPDF para geração de PDF
   - jsPDF-autoTable para tabelas em PDF
   - XLSX para arquivos Excel
   - Lucide React para ícones