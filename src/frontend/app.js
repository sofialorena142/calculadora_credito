class CreditCalculator {
  constructor() {
    this.form = document.createElement('form');
    this.container = document.createElement('div');
    this.container.className = 'container';
    this.setupForm();
    this.setupResults();
    this.setupEventListeners();
  }

  setupForm() {
    const formGroups = [
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
        label: 'Número de Cuotas',
        type: 'number',
        name: 'installments'
      },
      {
        label: 'Fecha de Inicio',
        type: 'date',
        name: 'startDate'
      }
    ];

    formGroups.forEach(group => {
      const div = document.createElement('div');
      div.className = 'form-group';

      const label = document.createElement('label');
      label.textContent = group.label;
      div.appendChild(label);

      if (group.type === 'select') {
        const select = document.createElement('select');
        select.name = group.name;
        group.options.forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option;
          select.appendChild(opt);
        });
        div.appendChild(select);
      } else {
        const input = document.createElement('input');
        input.type = group.type;
        input.name = group.name;
        div.appendChild(input);
      }

      this.form.appendChild(div);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Calcular';
    this.form.appendChild(button);

    this.container.appendChild(this.form);
  }

  setupResults() {
    this.resultsDiv = document.createElement('div');
    this.resultsDiv.className = 'results';
    this.resultsDiv.style.display = 'none';
    this.container.appendChild(this.resultsDiv);
  }

  showResults(results) {
    this.resultsDiv.innerHTML = `
      <h2>Resultado del Cálculo</h2>
      <p>Importe de cuota: $${results.importeCuota.toFixed(2)}</p>
      <p>Importe total a pagar: $${results.importeTotal.toFixed(2)}</p>
      <p>Ganancia percibida: $${results.ganancia.toFixed(2)}</p>
    `;
    this.resultsDiv.style.display = 'block';
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
          tazaInteres: parseFloat(data.interestRate),
          numeroCuotas: parseInt(data.installments),
          fechaInicio: data.startDate
        })
      });

      if (!response.ok) {
        throw new Error('Error al calcular el crédito');
      }

      const results = await response.json();
      this.showResults(results);
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
