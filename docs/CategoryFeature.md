# Funcionalidade de Categorias - Principais Códigos

## Interface da Categoria

```typescript
interface Category {
  name: string;
  type: 'income' | 'expense';
  color: string;
}
```

## Gerenciamento de Categorias (TransactionManager)

```typescript
class TransactionManager {
  private categories: Category[] = [];

  // Carrega categorias do localStorage
  private loadCategories(): void {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
    } else {
      // Categorias padrão
      this.categories = [
        { name: 'Salário', type: 'income', color: '#4CAF50' },
        { name: 'Investimentos', type: 'income', color: '#2196F3' },
        { name: 'Alimentação', type: 'expense', color: '#FF5722' },
        // ... outras categorias padrão
      ];
      this.saveCategories();
    }
  }

  // Salva categorias no localStorage
  private saveCategories(): void {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  // Adiciona nova categoria
  addCategory(name: string, type: 'income' | 'expense', color: string): void {
    if (!this.categories.some(c => c.name === name)) {
      this.categories.push({ name, type, color });
      this.saveCategories();
    }
  }

  // Remove categoria
  removeCategory(name: string): void {
    this.categories = this.categories.filter(c => c.name !== name);
    this.saveCategories();
  }

  // Retorna todas as categorias
  getCategories(): Category[] {
    return [...this.categories];
  }

  // Retorna categorias por tipo
  getCategoriesByType(type: 'income' | 'expense'): Category[] {
    return this.categories.filter(c => c.type === type);
  }
}
```

## Modal de Nova Categoria (React)

```typescript
// Estado do modal
const [isAddingCategory, setIsAddingCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState('');
const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
const [newCategoryColor, setNewCategoryColor] = useState('#4CAF50');

// Função para adicionar categoria
const handleAddCategory = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newCategoryName) {
    toast.error('Digite um nome para a categoria');
    return;
  }

  manager.addCategory(newCategoryName, newCategoryType, newCategoryColor);
  setNewCategoryName('');
  setIsAddingCategory(false);
  toast.success('Categoria adicionada com sucesso!');
};
```

## Template do Modal

```jsx
{isAddingCategory && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Nova Categoria
        </h3>
        <button
          onClick={() => setIsAddingCategory(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleAddCategory} className="space-y-4">
        {/* Campo: Nome da Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            placeholder="Ex: Academia, Streaming"
          />
        </div>

        {/* Campo: Tipo da Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo
          </label>
          <select
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        {/* Campo: Cor da Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cor
          </label>
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-full h-10 p-1 rounded-md cursor-pointer"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setIsAddingCategory(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  </div>
)}
```

## Uso das Categorias no Gráfico

```typescript
// Obtém dados para o gráfico de categorias
const getCategoryData = () => {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));
};

// Renderiza células do gráfico com cores das categorias
<Pie data={getCategoryData()} dataKey="value" nameKey="name">
  {getCategoryData().map((entry, index) => {
    const category = manager.getCategories().find(c => c.name === entry.name);
    return (
      <Cell key={`cell-${index}`} fill={category?.color || '#607D8B'} />
    );
  })}
</Pie>
```

## Principais Características

1. **Persistência**:
   - Utiliza localStorage para salvar categorias
   - Carrega categorias ao inicializar
   - Mantém categorias padrão se não houver dados salvos

2. **Validações**:
   - Verifica nome vazio
   - Evita categorias duplicadas
   - Garante tipo válido (receita/despesa)

3. **Interface**:
   - Modal responsivo
   - Seletor de cores
   - Feedback visual com toasts
   - Suporte a tema escuro

4. **Integração**:
   - Atualização automática do select de categorias
   - Cores personalizadas no gráfico
   - Filtros por categoria