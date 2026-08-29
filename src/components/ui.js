import React from 'react';

export const Button = ({ children, variant = 'primary', small = false, className = '', ...props }) => (
  <button className={`button button-${variant}${small ? ' button-small' : ''} ${className}`.trim()} {...props}>{children}</button>
);

export const Badge = ({ children, tone = 'neutral' }) => <span className={`badge badge-${tone}`}>{children}</span>;

export const LoadingState = ({ label = '데이터를 불러오고 있습니다.' }) => (
  <div className="state-box"><div><div className="spinner" /><p>{label}</p></div></div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="state-box"><div><h3>데이터를 불러오지 못했습니다</h3><p>{message}</p>{onRetry && <Button onClick={onRetry}>다시 시도</Button>}</div></div>
);

export const Modal = ({ open, title, children, footer, onClose, wide = false }) => {
  if(!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if(event.target === event.currentTarget) onClose?.(); }}>
      <section className={`modal-card${wide ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header"><h2>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="닫기">×</button></header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  );
};

export const DataTable = ({ columns, rows, rowKey, selectedKeys = new Set(), onSelect, emptyText = '표시할 데이터가 없습니다.' }) => {
  const selectable = Boolean(onSelect);
  const keys = rows.map(rowKey);
  const allSelected = selectable && keys.length > 0 && keys.every((key) => selectedKeys.has(key));

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr>
          {selectable && <th style={{ width: 52 }}><input className="checkbox" type="checkbox" aria-label="전체 선택" checked={allSelected} onChange={(event) => onSelect(event.target.checked ? new Set(keys) : new Set())} /></th>}
          {columns.map((column) => <th key={column.key}>{column.label}</th>)}
        </tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td className="empty-cell" colSpan={columns.length + (selectable ? 1 : 0)}>{emptyText}</td></tr> : rows.map((row) => {
            const key = rowKey(row);
            const selected = selectable && selectedKeys.has(key);
            return (
              <tr key={key} className={selected ? 'selected' : ''}>
                {selectable && <td><input className="checkbox" type="checkbox" aria-label="행 선택" checked={selected} onChange={(event) => {
                  const next = new Set(selectedKeys);
                  if(event.target.checked) next.add(key); else next.delete(key);
                  onSelect(next);
                }} /></td>}
                {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const formatDate = (value, includeTime = false) => {
  if(!value) return '-';
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('ko-KR', includeTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(date);
};
