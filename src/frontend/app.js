class CreditCalculator {
  constructor() {
    this.form = document.createElement('form');
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.results = [];
    this.setupForm();
    this.setupResultsTable();
    this.setupEventListeners();
  }

  createFormGroup(parent, group) {
    const div = document.createElement('div');
    div.className = 'form-group';

    const label = document.createElement('label');
    label.textContent = group.label;
    div.appendChild(label);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    if (group.type === 'select') {
      const select = document.createElement('select');
      select.name = group.name;
      select.className = 'form-control';
      group.options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
      });
      inputContainer.appendChild(select);
    } else {
      const input = document.createElement('input');
      input.type = group.type;
      input.name = group.name;
      input.className = 'form-control';
      inputContainer.appendChild(input);
    }

    div.appendChild(inputContainer);
    parent.appendChild(div);
  }

  setupForm() {
    // Definir los grupos de campos por columna
    const column1Groups = [
      {
        label: 'Nombre del Cliente',
        type: 'text',
        name: 'clientName'
      },
      {
        label: 'Importe del Crédito',
        type: 'number',
        name: 'amount'
      },
      {
        label: 'Número de Cuotas',
        type: 'number',
        name: 'installments'
      }
    ];

    const column2Groups = [
      {
        label: 'Modalidad',
        type: 'select',
        name: 'frequency',
        options: ['Mensual', 'Quincenal', 'Semanal']
      },
      {
        label: 'Tasa de Interés (%)',
        type: 'number',
        name: 'interestRate'
      },
      {
        label: 'Fecha de Inicio',
        type: 'date',
        name: 'startDate'
      }
    ];

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    // Crear y agregar las columnas
    const column1 = document.createElement('div');
    column1.className = 'column';
    column1Groups.forEach(group => this.createFormGroup(column1, group));

    const column2 = document.createElement('div');
    column2.className = 'column';
    column2Groups.forEach(group => this.createFormGroup(column2, group));

    formContainer.appendChild(column1);
    formContainer.appendChild(column2);

    // Crear el botón y agregarlo al final
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Calcular';
    button.className = 'calculate-button';
    formContainer.appendChild(button);

    this.form.appendChild(formContainer);
    this.container.appendChild(this.form);
  }

  setupResultsTable() {
    const table = document.createElement('table');
    table.className = 'results-table';
    
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    
    const headers = ['ID', 'Cliente', 'Importe', 'Modalidad', 'Tasa (%)', 'Cuotas', 'Fecha Inicio', 'Cuota', 'Total', 'Ganancia', 'Acciones'];
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tr.appendChild(th);
    });
    
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    this.container.appendChild(table);
    this.resultsTable = tbody;

    // Cargar resultados iniciales
    this.loadResults();
  }

  async loadResults() {
    try {
      const response = await fetch('http://127.0.0.1:3000/credits', {
        credentials: 'include'
      });
      const results = await response.json();
      this.updateResultsTable(results);
    } catch (error) {
      console.error('Error al cargar los resultados:', error);
    }
  }

  updateResultsTable(results) {
    this.resultsTable.innerHTML = '';
    results.forEach(result => {
      const tr = document.createElement('tr');
      
      const data = [
        result.id,
        result.cliente,
        `$${result.importe.toFixed(2)}`,
        result.modalidad,
        `${result.tasaInteres}%`,
        result.numeroCuotas,
        new Date(result.fechaInicio).toLocaleDateString(),
        `$${result.importeCuota.toFixed(2)}`,
        `$${result.importeTotal.toFixed(2)}`,
        `$${result.ganancia.toFixed(2)}`,
        `<button class="delete-btn" data-id="${result.id}">Eliminar</button>`
      ];

      data.forEach(cell => {
        const td = document.createElement('td');
        td.innerHTML = cell;
        tr.appendChild(td);
      });

      this.resultsTable.appendChild(tr);
    });

    // Agregar event listeners a los botones de eliminar
    this.resultsTable.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar este cálculo?')) {
          try {
            const response = await fetch(`http://127.0.0.1:3000/credits/${id}`, {
              method: 'DELETE',
              credentials: 'include'
            });
            if (response.ok) {
              this.loadResults();
            }
          } catch (error) {
            console.error('Error al eliminar el cálculo:', error);
          }
        }
      });
    });
  }

  addResultToTable(results, formData) {
    const tbody = this.resultsTable;
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${results.id}</td>
      <td>${formData.clientName}</td>
      <td>$${formData.amount}</td>
      <td>${formData.frequency}</td>
      <td>${formData.interestRate}%</td>
      <td>${formData.installments}</td>
      <td>${formData.startDate}</td>
      <td>$${results.importeCuota.toFixed(2)}</td>
      <td>$${results.importeTotal.toFixed(2)}</td>
      <td>$${results.ganancia.toFixed(2)}</td>
    `;
    
    tbody.appendChild(row);
    this.results.push({
      ...formData,
      ...results
    });
  }

  async calculate() {
    const formData = new FormData(this.form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    if (!data.amount || !data.interestRate || !data.installments) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/credits/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cliente: data.clientName,
          importe: parseFloat(data.amount),
          modalidad: data.frequency,
          tasaInteres: parseFloat(data.interestRate),
          numeroCuotas: parseInt(data.installments),
          fechaInicio: data.startDate
        })
      });

      if (!response.ok) {
        throw new Error('Error al calcular el crédito');
      }

      const results = await response.json();
      this.addResultToTable(results, data);
    } catch (error) {
      alert('Error al calcular el crédito: ' + error.message);
    }
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculate();
    });
  }
}

// Inicializar la calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const calculator = new CreditCalculator();
  document.getElementById('root').appendChild(calculator.container);
});
