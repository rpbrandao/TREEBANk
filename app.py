/**
 * utils.js — shared helpers for TREEBANk frontend
 */

'use strict';

// ── Tab switching ──────────────────────────────────────────────────────────

/**
 * Initialise a tab group.
 * Looks for .tab buttons and .tab-panel sections within `container`.
 * @param {HTMLElement} container
 */
function initTabs(container) {
  const tabs   = container.querySelectorAll('.tab');
  const panels = container.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t   => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
      panels.forEach(p => { p.classList.toggle('active', p.id === `tab-${target}`); });

      // Auto-load extrato when that tab is opened
      if (target === 'extrato' && typeof carregarExtrato === 'function') {
        carregarExtrato();
      }
    });
  });
}

// ── Message helper ─────────────────────────────────────────────────────────

/**
 * Show a feedback message in an element.
 * @param {string}  elementId
 * @param {string}  text
 * @param {'success'|'error'} type
 */
function showMsg(elementId, text, type = 'error') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className   = `msg ${type}`;
}

function clearMsg(elementId) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = ''; el.className = 'msg'; }
}

// ── Loading state ──────────────────────────────────────────────────────────

/**
 * Toggle the loading state of a submit button.
 * @param {HTMLButtonElement} btn
 * @param {boolean}           loading
 */
function setBtnLoading(btn, loading) {
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (text)   text.hidden   =  loading;
  if (loader) loader.hidden = !loading;
}

// ── CPF helpers ────────────────────────────────────────────────────────────

/**
 * Apply 000.000.000-00 mask to a CPF input as the user types.
 * @param {HTMLInputElement} input
 */
function maskCpf(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
    input.value = v;
  });
}

/**
 * Validate a CPF string (digits only or formatted).
 * @param   {string} cpf
 * @returns {boolean}
 */
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

// ── Email validation ───────────────────────────────────────────────────────

/**
 * @param   {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ── Currency format ────────────────────────────────────────────────────────

/**
 * Format a number as Brazilian currency string.
 * @param   {number} value
 * @returns {string}  e.g. "R$ 1.234,56"
 */
function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(value);
}

// ── Password toggle ────────────────────────────────────────────────────────

document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    if (!input) return;
    input.type  = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── Init all tab groups on page ────────────────────────────────────────────

document.querySelectorAll('.container, .operations').forEach(initTabs);
