/**
 * operator.js — banking operations for TREEBANk operator page
 */

'use strict';

// ── Init ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  carregarSaldo();

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  });
});

// ── Saldo ──────────────────────────────────────────────────────────────────

async function carregarSaldo() {
  try {
    const res  = await fetch('/api/saldo');
    if (!res.ok) { window.location.href = '/'; return; }
    const data = await res.json();
    atualizarSaldoUI(data);
  } catch (err) {
    console.error('Erro ao carregar saldo:', err);
  }
}

function atualizarSaldoUI({ saldo, agencia, numero }) {
  const el = document.getElementById('saldo-display');
  if (el) el.textContent = formatBRL(saldo);

  const info = document.getElementById('conta-info');
  if (info && agencia && numero) {
    info.textContent = `Agência ${agencia} · Conta ${String(numero).padStart(5, '0')}`;
  }
}

// ── Depósito ───────────────────────────────────────────────────────────────

document.getElementById('depositoForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg('deposito-msg');

  const valor = parseFloat(document.getElementById('valor-deposito').value);
  if (!valor || valor <= 0) {
    showMsg('deposito-msg', 'Informe um valor positivo.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  setBtnLoading(btn, true);
  try {
    const res  = await fetch('/api/depositar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ valor }),
    });
    const data = await res.json();

    if (res.ok) {
      showMsg('deposito-msg', data.message, 'success');
      atualizarSaldoUI(data);
      e.target.reset();
    } else {
      showMsg('deposito-msg', data.erro || 'Erro ao depositar.', 'error');
    }
  } catch (err) {
    showMsg('deposito-msg', 'Erro de conexão.', 'error');
  } finally {
    setBtnLoading(btn, false);
  }
});

// ── Saque ──────────────────────────────────────────────────────────────────

document.getElementById('saqueForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMsg('saque-msg');

  const valor = parseFloat(document.getElementById('valor-saque').value);
  if (!valor || valor <= 0) {
    showMsg('saque-msg', 'Informe um valor positivo.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  setBtnLoading(btn, true);
  try {
    const res  = await fetch('/api/sacar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ valor }),
    });
    const data = await res.json();

    if (res.ok) {
      showMsg('saque-msg', data.message, 'success');
      atualizarSaldoUI(data);
      e.target.reset();
    } else {
      showMsg('saque-msg', data.erro || 'Erro ao sacar.', 'error');
    }
  } catch (err) {
    showMsg('saque-msg', 'Erro de conexão.', 'error');
  } finally {
    setBtnLoading(btn, false);
  }
});

// ── Extrato ────────────────────────────────────────────────────────────────

async function carregarExtrato() {
  const lista = document.getElementById('extrato-lista');
  clearMsg('extrato-msg');
  if (lista) lista.innerHTML = '<p class="empty-state">Carregando…</p>';

  try {
    const res  = await fetch('/api/extrato');
    const data = await res.json();

    if (!res.ok) {
      showMsg('extrato-msg', data.erro || 'Erro ao carregar extrato.', 'error');
      return;
    }

    renderExtrato(data.transacoes, data.saldo);
  } catch (err) {
    showMsg('extrato-msg', 'Erro de conexão.', 'error');
    console.error('Extrato error:', err);
  }
}

function renderExtrato(transacoes, saldo) {
  const lista = document.getElementById('extrato-lista');
  if (!lista) return;

  if (!transacoes.length) {
    lista.innerHTML = '<p class="empty-state">Nenhuma movimentação registrada.</p>';
    return;
  }

  lista.innerHTML = transacoes.map(t => `
    <div class="transacao-item">
      <div class="transacao-tipo">
        <span class="tipo-badge ${t.tipo}"></span>
        <div>
          <div>${t.tipo === 'deposito' ? 'Depósito' : 'Saque'}</div>
          <div class="transacao-data">${t.criado_em}</div>
        </div>
      </div>
      <span class="transacao-valor ${t.tipo}">
        ${t.tipo === 'deposito' ? '+' : '-'} ${formatBRL(t.valor)}
      </span>
    </div>
  `).join('');

  // Append saldo summary
  const summary = document.createElement('div');
  summary.style.cssText = 'text-align:right;padding:0.75rem 0.5rem;font-weight:700;color:var(--clr-gold)';
  summary.textContent = `Saldo atual: ${formatBRL(saldo)}`;
  lista.appendChild(summary);
}
