/**
 * Main Application Logic - Declaração de Conteúdo
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initParticles();
    initTabs();
    initDarkMode();
    initFullscreen();
    initMasks();
    initCEPLookup();
    initItemsTable();
    initFormActions();
    initProgressTracker();
    initEnderecadorSync();
    initHistory();
    loadSavedDraft();
    initAutoSave();
}

// ============================================
// PARTICLES BACKGROUND
// ============================================

function initParticles() {
    const container = document.getElementById('particles-bg');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.width = (4 + Math.random() * 6) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============================================
// TABS
// ============================================

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });
}

// ============================================
// DARK MODE
// ============================================

function initDarkMode() {
    const btn = document.getElementById('btn-dark-mode');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        btn.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';

        btn.classList.add('animate-bounce');
        setTimeout(() => btn.classList.remove('animate-bounce'), 500);
        
        showToast(
            newTheme === 'dark' ? 'Modo escuro ativado 🌙' : 'Modo claro ativado ☀️',
            'info', 2000
        );
    });
}

// ============================================
// FULLSCREEN
// ============================================

function initFullscreen() {
    const btn = document.getElementById('btn-fullscreen');
    
    btn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            btn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            btn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            btn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
}

// ============================================
// INPUT MASKS
// ============================================

function initMasks() {
    // CPF
    const cpfInput = document.getElementById('rem-cpf');
    cpfInput.addEventListener('input', (e) => {
        e.target.value = maskCPF(e.target.value);
    });
    cpfInput.addEventListener('blur', (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (raw.length === 11 && !validateCPF(raw)) {
            e.target.style.borderColor = 'var(--danger)';
            showToast('CPF inválido! Verifique o número informado.', 'warning');
        } else if (raw.length === 11) {
            e.target.style.borderColor = 'var(--success)';
        }
    });
    cpfInput.addEventListener('focus', (e) => {
        e.target.style.borderColor = '';
    });

    // Phone masks
    document.querySelectorAll('[id$="-telefone"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    });

    // CEP masks
    document.querySelectorAll('[id$="-cep"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = maskCEP(e.target.value);
        });
    });

    // Money masks
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('input-money')) {
            e.target.value = maskMoney(e.target.value);
            updateTotals();
        }
    });
}

// ============================================
// CEP LOOKUP
// ============================================

function initCEPLookup() {
    document.getElementById('btn-busca-cep-rem').addEventListener('click', () => {
        handleCEPLookup('rem');
    });

    document.getElementById('btn-busca-cep-dest').addEventListener('click', () => {
        handleCEPLookup('dest');
    });

    // Also trigger on Enter
    document.getElementById('rem-cep').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleCEPLookup('rem'); }
    });
    document.getElementById('dest-cep').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleCEPLookup('dest'); }
    });
}

async function handleCEPLookup(prefix) {
    const cepInput = document.getElementById(`${prefix}-cep`);
    const cep = cepInput.value;

    if (cep.replace(/\D/g, '').length < 8) {
        showToast('Digite um CEP válido com 8 dígitos.', 'warning');
        cepInput.classList.add('animate-shake');
        setTimeout(() => cepInput.classList.remove('animate-shake'), 500);
        return;
    }

    const btn = document.getElementById(`btn-busca-cep-${prefix}`);
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const result = await buscarCEP(cep);

    btn.innerHTML = '<i class="fas fa-search"></i>';
    btn.disabled = false;

    if (result.error) {
        showToast(result.error, 'error');
        cepInput.classList.add('animate-shake');
        setTimeout(() => cepInput.classList.remove('animate-shake'), 500);
    } else {
        document.getElementById(`${prefix}-endereco`).value = result.endereco;
        document.getElementById(`${prefix}-complemento`).value = result.complemento;
        document.getElementById(`${prefix}-cidade`).value = result.cidade;
        document.getElementById(`${prefix}-uf`).value = result.uf;

        showToast('Endereço encontrado com sucesso! ✓', 'success');
        
        // Animate filled fields
        ['endereco', 'complemento', 'cidade', 'uf'].forEach(field => {
            const el = document.getElementById(`${prefix}-${field}`);
            el.classList.add('animate-scale-in');
            setTimeout(() => el.classList.remove('animate-scale-in'), 400);
        });

        updateProgress();
        syncEnderecador();
    }
}

// ============================================
// ITEMS TABLE
// ============================================

let itemCount = 1;

function initItemsTable() {
    document.getElementById('btn-add-item').addEventListener('click', addItem);
    
    // Delegate remove button clicks
    document.getElementById('items-body').addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-item');
        if (removeBtn) {
            removeItem(removeBtn.closest('tr'));
        }
    });

    // Delegate input changes for live totals
    document.getElementById('items-body').addEventListener('input', (e) => {
        if (e.target.classList.contains('input-money') || e.target.classList.contains('input-number')) {
            updateTotals();
        }
    });

    updateTotals();
}

function addItem() {
    itemCount++;
    const tbody = document.getElementById('items-body');
    const row = document.createElement('tr');
    row.className = 'item-row item-row-enter';
    row.dataset.index = itemCount;
    
    row.innerHTML = `
        <td class="col-item">${itemCount}</td>
        <td class="col-conteudo"><input type="text" name="item-conteudo-${itemCount}" placeholder="Descrição do item" class="input-table"></td>
        <td class="col-quant"><input type="number" name="item-quant-${itemCount}" min="1" value="1" class="input-table input-number"></td>
        <td class="col-valor"><input type="text" name="item-valor-${itemCount}" placeholder="0,00" class="input-table input-money"></td>
        <td class="col-actions"><button type="button" class="btn-remove-item" title="Remover"><i class="fas fa-trash-alt"></i></button></td>
    `;

    tbody.appendChild(row);
    
    // Focus on the new content input
    row.querySelector('input[type="text"]').focus();
    
    showToast(`Item #${itemCount} adicionado`, 'success', 2000);
    reindexItems();
}

function removeItem(row) {
    const tbody = document.getElementById('items-body');
    if (tbody.children.length <= 1) {
        showToast('É necessário manter pelo menos 1 item.', 'warning');
        row.classList.add('animate-shake');
        setTimeout(() => row.classList.remove('animate-shake'), 500);
        return;
    }

    row.classList.add('item-row-exit');
    setTimeout(() => {
        row.remove();
        reindexItems();
        updateTotals();
    }, 300);
}

function reindexItems() {
    const rows = document.querySelectorAll('#items-body .item-row');
    rows.forEach((row, idx) => {
        row.dataset.index = idx + 1;
        row.querySelector('.col-item').textContent = idx + 1;
    });
    itemCount = rows.length;
}

function updateTotals() {
    const rows = document.querySelectorAll('#items-body .item-row');
    let totalQuant = 0;
    let totalValor = 0;

    rows.forEach(row => {
        const quant = parseInt(row.querySelector('.input-number')?.value) || 0;
        const valorStr = row.querySelector('.input-money')?.value || '0';
        const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.')) || 0;

        totalQuant += quant;
        totalValor += valor * quant;
    });

    const quantEl = document.getElementById('total-quant');
    const valorEl = document.getElementById('total-valor');

    quantEl.textContent = totalQuant;
    valorEl.textContent = `R$ ${totalValor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;

    quantEl.classList.add('value-updated');
    valorEl.classList.add('value-updated');
    setTimeout(() => {
        quantEl.classList.remove('value-updated');
        valorEl.classList.remove('value-updated');
    }, 500);
}

// ============================================
// FORM ACTIONS
// ============================================

function initFormActions() {
    document.getElementById('btn-save').addEventListener('click', saveDeclaration);
    document.getElementById('btn-print').addEventListener('click', printDeclaration);
    document.getElementById('btn-pdf').addEventListener('click', generatePDF);
    document.getElementById('btn-clear').addEventListener('click', clearForm);
    document.getElementById('btn-print-enderecador').addEventListener('click', printEnderecador);
}

function getFormData() {
    const form = document.getElementById('form-declaracao');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add items
    data.items = [];
    document.querySelectorAll('#items-body .item-row').forEach(row => {
        const conteudo = row.querySelector('input[name^="item-conteudo"]')?.value || '';
        const quant = row.querySelector('input[name^="item-quant"]')?.value || '1';
        const valor = row.querySelector('input[name^="item-valor"]')?.value || '0,00';
        if (conteudo.trim()) {
            data.items.push({ conteudo, quant, valor });
        }
    });

    data.pesoTotal = document.getElementById('peso-total').value;
    data.localData = document.getElementById('local-data').value;
    data.assinatura = document.getElementById('assinatura').value;
    
    return data;
}

function loadFormData(data) {
    if (!data) return;

    // Fill basic fields
    const fieldMappings = [
        'rem-nome', 'rem-cpf', 'rem-telefone', 'rem-endereco', 'rem-complemento',
        'rem-cep', 'rem-cidade', 'rem-uf',
        'dest-nome', 'dest-telefone', 'dest-cep', 'dest-endereco',
        'dest-complemento', 'dest-cidade', 'dest-uf'
    ];

    fieldMappings.forEach(field => {
        const el = document.getElementById(field);
        if (el && data[field]) {
            el.value = data[field];
        }
    });

    // Fill extra fields
    if (data.pesoTotal) document.getElementById('peso-total').value = data.pesoTotal;
    if (data.localData) document.getElementById('local-data').value = data.localData;
    if (data.assinatura) document.getElementById('assinatura').value = data.assinatura;

    // Fill items
    if (data.items && data.items.length > 0) {
        const tbody = document.getElementById('items-body');
        tbody.innerHTML = '';
        itemCount = 0;
        
        data.items.forEach((item, idx) => {
            itemCount = idx + 1;
            const row = document.createElement('tr');
            row.className = 'item-row';
            row.dataset.index = itemCount;
            row.innerHTML = `
                <td class="col-item">${itemCount}</td>
                <td class="col-conteudo"><input type="text" name="item-conteudo-${itemCount}" value="${item.conteudo}" class="input-table"></td>
                <td class="col-quant"><input type="number" name="item-quant-${itemCount}" min="1" value="${item.quant}" class="input-table input-number"></td>
                <td class="col-valor"><input type="text" name="item-valor-${itemCount}" value="${item.valor}" class="input-table input-money"></td>
                <td class="col-actions"><button type="button" class="btn-remove-item" title="Remover"><i class="fas fa-trash-alt"></i></button></td>
            `;
            tbody.appendChild(row);
        });
    }

    updateTotals();
    updateProgress();
    syncEnderecador();
}

function saveDeclaration() {
    const data = getFormData();
    
    if (!data['rem-nome'] && !data['dest-nome']) {
        showToast('Preencha ao menos o nome do remetente ou destinatário.', 'warning');
        return;
    }

    // Save to history
    const history = loadFromLocalStorage('declaracoes_history') || [];
    const entry = {
        id: generateId(),
        data: data,
        timestamp: Date.now(),
        label: `${data['rem-nome'] || 'Sem nome'} → ${data['dest-nome'] || 'Sem destinatário'}`
    };
    
    history.unshift(entry);
    if (history.length > 20) history.pop(); // Keep max 20
    
    saveToLocalStorage('declaracoes_history', history);
    saveToLocalStorage('declaracao_draft', data);
    
    showToast('Declaração salva com sucesso! ✓', 'success');
    renderHistory();
}

function printDeclaration() {
    window.print();
}

function printEnderecador() {
    // Switch to endereçador tab before printing
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="enderecador"]').classList.add('active');
    document.getElementById('tab-enderecador').classList.add('active');
    
    setTimeout(() => window.print(), 100);
}

function generatePDF() {
    showToast('Use a opção "Imprimir" e selecione "Salvar como PDF" na impressora.', 'info', 5000);
    setTimeout(() => window.print(), 1000);
}

function clearForm() {
    if (!confirm('Tem certeza que deseja limpar todos os campos?')) return;

    document.getElementById('form-declaracao').reset();
    
    // Reset items table
    const tbody = document.getElementById('items-body');
    tbody.innerHTML = `
        <tr class="item-row" data-index="1">
            <td class="col-item">1</td>
            <td class="col-conteudo"><input type="text" name="item-conteudo-1" placeholder="Descrição do item" class="input-table"></td>
            <td class="col-quant"><input type="number" name="item-quant-1" min="1" value="1" class="input-table input-number"></td>
            <td class="col-valor"><input type="text" name="item-valor-1" placeholder="0,00" class="input-table input-money"></td>
            <td class="col-actions"><button type="button" class="btn-remove-item" title="Remover"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
    `;
    itemCount = 1;
    
    updateTotals();
    updateProgress();
    syncEnderecador();
    removeFromLocalStorage('declaracao_draft');
    
    showToast('Formulário limpo com sucesso.', 'info');
}

// ============================================
// PROGRESS TRACKER
// ============================================

function initProgressTracker() {
    const form = document.getElementById('form-declaracao');
    form.addEventListener('input', updateProgress);
    form.addEventListener('change', updateProgress);
    updateProgress();
}

function updateProgress() {
    const importantFields = [
        'rem-nome', 'rem-cpf', 'rem-endereco', 'rem-cep', 'rem-cidade', 'rem-uf',
        'dest-nome', 'dest-endereco', 'dest-cep', 'dest-cidade', 'dest-uf'
    ];

    let filled = 0;
    importantFields.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim()) filled++;
    });

    // Check if at least one item has content
    const firstItemContent = document.querySelector('input[name="item-conteudo-1"]');
    if (firstItemContent && firstItemContent.value.trim()) filled++;

    const total = importantFields.length + 1;
    const percentage = Math.round((filled / total) * 100);

    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');

    fill.style.width = percentage + '%';
    text.textContent = percentage + '% preenchido';

    // Change color based on progress
    if (percentage < 30) {
        fill.style.background = 'linear-gradient(90deg, #ef4444, #f97316)';
    } else if (percentage < 70) {
        fill.style.background = 'linear-gradient(90deg, #f59e0b, #84cc16)';
    } else {
        fill.style.background = 'linear-gradient(90deg, #10b981, #3b82f6)';
    }
}

// ============================================
// ENDEREÇADOR SYNC
// ============================================

function initEnderecadorSync() {
    const watchFields = [
        'rem-nome', 'rem-endereco', 'rem-complemento', 'rem-cidade', 'rem-uf', 'rem-cep',
        'dest-nome', 'dest-endereco', 'dest-complemento', 'dest-cidade', 'dest-uf', 'dest-cep'
    ];

    watchFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', syncEnderecador);
            el.addEventListener('change', syncEnderecador);
        }
    });
}

function syncEnderecador() {
    const fields = {
        'end-rem-nome': 'rem-nome',
        'end-rem-endereco': 'rem-endereco',
        'end-rem-complemento': 'rem-complemento',
        'end-rem-cidade': 'rem-cidade',
        'end-rem-uf': 'rem-uf',
        'end-rem-cep': 'rem-cep',
        'end-dest-nome': 'dest-nome',
        'end-dest-endereco': 'dest-endereco',
        'end-dest-complemento': 'dest-complemento',
        'end-dest-cidade': 'dest-cidade',
        'end-dest-uf': 'dest-uf',
        'end-dest-cep': 'dest-cep'
    };

    Object.entries(fields).forEach(([displayId, sourceId]) => {
        const source = document.getElementById(sourceId);
        const display = document.getElementById(displayId);
        if (source && display) {
            display.textContent = source.value || '—';
        }
    });
}

// ============================================
// HISTORY
// ============================================

function initHistory() {
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if (!confirm('Deseja apagar todo o histórico?')) return;
        removeFromLocalStorage('declaracoes_history');
        renderHistory();
        showToast('Histórico limpo.', 'info');
    });
    
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    const history = loadFromLocalStorage('declaracoes_history') || [];

    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Nenhuma declaração salva ainda.</p>
                <p class="hint-text">Use o botão "Salvar Rascunho" para guardar suas declarações.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(entry => `
        <div class="history-item" data-id="${entry.id}">
            <div class="history-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="history-info">
                <h4>${entry.label}</h4>
                <p>${getTimestampFormatted(entry.timestamp)}</p>
            </div>
            <div class="history-actions">
                <button class="btn-load" onclick="loadHistoryEntry('${entry.id}')">
                    <i class="fas fa-upload"></i> Carregar
                </button>
                <button class="btn-delete-history" onclick="deleteHistoryEntry('${entry.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function loadHistoryEntry(id) {
    const history = loadFromLocalStorage('declaracoes_history') || [];
    const entry = history.find(h => h.id === id);
    
    if (entry) {
        loadFormData(entry.data);
        
        // Switch to declaracao tab
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="declaracao"]').classList.add('active');
        document.getElementById('tab-declaracao').classList.add('active');
        
        showToast('Declaração carregada com sucesso!', 'success');
    }
}

function deleteHistoryEntry(id) {
    let history = loadFromLocalStorage('declaracoes_history') || [];
    history = history.filter(h => h.id !== id);
    saveToLocalStorage('declaracoes_history', history);
    renderHistory();
    showToast('Entrada removida do histórico.', 'info', 2000);
}

// ============================================
// AUTO-SAVE DRAFT
// ============================================

function initAutoSave() {
    let autoSaveTimer;
    const form = document.getElementById('form-declaracao');
    
    form.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => {
            const data = getFormData();
            saveToLocalStorage('declaracao_draft', data);
        }, 2000);
    });
}

function loadSavedDraft() {
    const draft = loadFromLocalStorage('declaracao_draft');
    if (draft && (draft['rem-nome'] || draft['dest-nome'])) {
        loadFormData(draft);
        showToast('Rascunho anterior restaurado automaticamente.', 'info', 3000);
    }
}
