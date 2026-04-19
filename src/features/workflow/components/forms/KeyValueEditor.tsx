import type { KeyValuePair } from '../../types.ts'

interface KeyValueEditorProps {
  label: string
  rows: KeyValuePair[]
  onChange: (rows: KeyValuePair[]) => void
}

export function KeyValueEditor({ label, rows, onChange }: KeyValueEditorProps) {
  const updateRow = (index: number, field: keyof KeyValuePair, value: string) => {
    const nextRows = rows.map((row, rowIndex) =>
      rowIndex === index
        ? {
            ...row,
            [field]: value,
          }
        : row,
    )
    onChange(nextRows)
  }

  const addRow = () => {
    onChange([...rows, { key: '', value: '' }])
  }

  const removeRow = (index: number) => {
    onChange(rows.filter((_, rowIndex) => rowIndex !== index))
  }

  return (
    <div className="wf-kv-editor">
      <div className="wf-kv-header">
        <label>{label}</label>
        <button type="button" className="wf-inline-btn" onClick={addRow}>
          Add
        </button>
      </div>

      {rows.length === 0 && <p className="wf-muted">No key-value pairs yet.</p>}

      {rows.map((row, index) => (
        <div className="wf-kv-row" key={`${row.key}-${index}`}>
          <input
            type="text"
            placeholder="Key"
            value={row.key}
            onChange={(event) => updateRow(index, 'key', event.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={row.value}
            onChange={(event) => updateRow(index, 'value', event.target.value)}
          />
          <button type="button" className="wf-inline-btn danger" onClick={() => removeRow(index)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

