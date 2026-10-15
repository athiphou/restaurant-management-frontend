import { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../ui/Button'
import { Input, Textarea, Select } from '../ui/Input'
import { Toggle } from '../ui/Toggle'
import { classNames } from '../../utils/formatters'

/*
  FormModal — schema-driven create/edit dialog for admin CRUD.
  fields: [{ name, label, type, options?, required?, numeric?, hint?, placeholder?,
             rows?, default?, colSpan? }]
  type ∈ text | textarea | number | url | select | toggle
*/
export function FormModal({ open, title, fields, initial, id, onCancel, onSubmit, saving }) {
  const defaults = () => Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'toggle' ? false : '')]))
  const [values, setValues] = useState(defaults)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setValues({ ...defaults(), ...(initial || {}) })
      setErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial])

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  const submit = () => {
    const errs = {}
    for (const f of fields) {
      if (f.required && f.type !== 'toggle' && !String(values[f.name] ?? '').trim()) errs[f.name] = `${f.label} is required`
    }
    setErrors(errs)
    if (Object.keys(errs).length) return
    const payload = {}
    for (const f of fields) {
      let v = values[f.name]
      if (f.numeric) v = v === '' || v == null ? null : Number(v)
      payload[f.name] = v
    }
    onSubmit(payload, id)
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button loading={saving} onClick={submit}>{id ? 'Save changes' : 'Create'}</Button>
        </div>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="grid gap-4 p-5 sm:grid-cols-2"
      >
        {fields.map((f) => {
          const span = f.colSpan === 'full' || f.type === 'textarea' ? 'sm:col-span-2' : ''
          if (f.type === 'toggle') {
            return (
              <div key={f.name} className={classNames('flex items-center justify-between rounded-xl border border-line px-4 py-3', span)}>
                <div>
                  <p className="text-sm font-medium text-ink">{f.label}</p>
                  {f.hint && <p className="text-xs text-muted">{f.hint}</p>}
                </div>
                <Toggle checked={Boolean(values[f.name])} onChange={(v) => set(f.name, v)} />
              </div>
            )
          }
          if (f.type === 'select') {
            return (
              <Select key={f.name} className={span} label={f.label} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} error={errors[f.name]}>
                <option value="">{f.placeholder || 'Select…'}</option>
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            )
          }
          if (f.type === 'textarea') {
            return <Textarea key={f.name} className={span} label={f.label} rows={f.rows || 3} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} placeholder={f.placeholder} error={errors[f.name]} />
          }
          return (
            <Input
              key={f.name}
              className={span}
              label={f.label}
              type={
                f.type === 'number' ? 'number'
                  : f.type === 'url' ? 'url'
                  : f.type === 'date' ? 'date'
                  : f.type === 'datetime' ? 'datetime-local'
                  : 'text'
              }
              value={values[f.name] ?? ''}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              hint={f.hint}
              error={errors[f.name]}
              step={f.type === 'number' ? '0.01' : undefined}
            />
          )
        })}
        <button type="submit" className="hidden" />
      </form>
    </Modal>
  )
}
