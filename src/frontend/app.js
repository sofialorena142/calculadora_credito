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
    this.resultsTable = document.createElement('div');
    this.resultsTable.className = 'results-table';
    
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Cliente</th>
      <th>Importe</th>
      <th>Modalidad</th>
      <th>Tasa (%)</th>
      <th>Cuotas</th>
      <th>Fecha</th>
      <th>Importe Cuota</th>
      <th>Total a Pagar</th>
      <th>Ganancia</th>
    `;
    thead.appendChild(headerRow);
    
    table.appendChild(thead);
    table.appendChild(tbody);
    this.resultsTable.appendChild(table);
    
    this.container.appendChild(this.resultsTable);
  }

  addResultToTable(results, formData) {
    const tbody = this.resultsTable.querySelector('tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
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
      const response = await fetch('http://localhost:3000/credits/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
