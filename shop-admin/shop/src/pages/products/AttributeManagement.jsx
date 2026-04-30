import React, { useEffect, useState, useCallback } from 'react';
import axios from '../../api/axios';

// ── tiny helpers ──────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2);

const TYPE_LABELS = { STRING: 'Text', NUMBER: 'Number', DROPDOWN: 'Dropdown' };
const TYPE_ICON   = { STRING: '𝐓', NUMBER: '#', DROPDOWN: '▾' };
const LANG_SUGGESTIONS = ['en', 'ru', 'uz', 'de', 'fr', 'ar', 'zh'];

// ─────────────────────────────────────────────────────────────────────────────
// Translation sub-panel (self-contained, FIX: no shared state conflict)
// ─────────────────────────────────────────────────────────────────────────────
function TranslationPanel({ attr, onClose, onSaved }) {
  const [lang, setLang]   = useState('');
  const [name, setName]   = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleAdd = async () => {
    if (!lang.trim() || !name.trim()) return;
    setSaving(true);
    try {
      if (attr.id) {
        // Merge: keep existing langs except the one being upserted
        const existing = (attr.translations || []).filter(t => t.language !== lang.trim());
        await axios.post(`/products/attributes/translations?attributeId=${attr.id}`, [
          ...existing,
          { language: lang.trim(), name: name.trim() },
        ]);
        await onSaved(); // refresh from server
      } else {
        // Unsaved attribute — just bubble up the new translation
        onSaved({ language: lang.trim(), name: name.trim() });
      }
      setLang(''); setName('');
    } catch (err) {
      console.error('Failed to save translation', err);
      alert('Failed to save translation');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (trans, idx) => {
    setDeleting(idx);
    try {
      if (attr.id) {
        const remaining = (attr.translations || []).filter((_, i) => i !== idx);
        await axios.post(`/products/attributes/translations?attributeId=${attr.id}`, remaining);
        await onSaved();
      } else {
        onSaved({ deleteIndex: idx });
      }
    } catch (err) {
      alert('Failed to delete translation');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Translations — <span className="text-indigo-600">{attr.name || 'new attribute'}</span>
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
      </div>

      {/* Existing translations */}
      {attr.translations?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {attr.translations.map((t, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full shadow-sm">
              <span className="font-mono text-indigo-500 font-bold">{t.language}</span>
              <span>{t.name}</span>
              <button
                onClick={() => handleDelete(t, idx)}
                disabled={deleting === idx}
                className="text-slate-300 hover:text-red-400 transition-colors ml-0.5 disabled:opacity-50"
              >
                {deleting === idx ? '…' : '×'}
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No translations yet.</p>
      )}

      {/* Add new */}
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1 w-24">
          <label className="text-xs text-slate-500">Language</label>
          <input
            list="lang-suggestions"
            value={lang}
            onChange={e => setLang(e.target.value)}
            placeholder="en"
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <datalist id="lang-suggestions">
            {LANG_SUGGESTIONS.map(l => <option key={l} value={l} />)}
          </datalist>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-slate-500">Translated name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Translated name"
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !lang.trim() || !name.trim()}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium
            hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-0"
        >
          {saving ? '…' : 'Add'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single attribute row
// ─────────────────────────────────────────────────────────────────────────────
function AttributeRow({ attr, index, onChange, onDelete, onSaveTranslation }) {
  const [showTranslations, setShowTranslations] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isSaved = !!attr.id;

  const handleDelete = async () => {
    if (!window.confirm(`Delete attribute "${attr.name}"?`)) return;
    setDeleting(true);
    try {
      if (isSaved) {
        // FIX: actually call DELETE API for saved attributes
        await axios.delete(`/products/attributes/${attr.id}`);
      }
      onDelete(index);
    } catch (err) {
      alert('Failed to delete attribute');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`rounded-xl border transition-all ${isSaved ? 'border-slate-200 bg-white' : 'border-dashed border-indigo-300 bg-indigo-50/40'}`}>
      <div className="flex flex-wrap items-center gap-2 p-3">
        {/* Saved badge */}
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isSaved ? 'saved' : 'unsaved'}
        </span>

        {/* Name */}
        <input
          type="text"
          value={attr.name}
          onChange={e => onChange(index, 'name', e.target.value)}
          placeholder="Attribute name"
          className="flex-1 min-w-[120px] border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />

        {/* Type */}
        <select
          value={attr.type}
          onChange={e => onChange(index, 'type', e.target.value)}
          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-400 w-32"
        >
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{TYPE_ICON[v]} {l}</option>
          ))}
        </select>

        {/* Required toggle */}
        <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={attr.isRequired || false}
            onChange={e => onChange(index, 'isRequired', e.target.checked)}
            className="accent-indigo-600 w-3.5 h-3.5"
          />
          Required
        </label>

        {/* Translations toggle */}
        <button
          onClick={() => setShowTranslations(v => !v)}
          title="Manage translations"
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors
            ${showTranslations
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}
        >
          🌐 {attr.translations?.length > 0 ? attr.translations.length : ''}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete attribute"
          className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50 text-lg leading-none px-1"
        >
          {deleting ? '…' : '✕'}
        </button>
      </div>

      {/* Dropdown options */}
      {attr.type === 'DROPDOWN' && (
        <div className="px-3 pb-3">
          <input
            type="text"
            value={attr.options?.join(', ') || ''}
            onChange={e => onChange(index, 'options', e.target.value.split(',').map(o => o.trim()).filter(Boolean))}
            placeholder="Options — comma separated e.g. Red, Blue, Green"
            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white
              focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Translation panel */}
      {showTranslations && (
        <div className="px-3 pb-3">
          <TranslationPanel
            attr={attr}
            onClose={() => setShowTranslations(false)}
            onSaved={onSaveTranslation ? (payload) => onSaveTranslation(index, payload) : async () => {}}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Add new attribute form
// ─────────────────────────────────────────────────────────────────────────────
function AddAttributeForm({ onAdd }) {
  const [name, setName]       = useState('');
  const [type, setType]       = useState('STRING');
  const [options, setOptions] = useState('');
  const [required, setRequired] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      _localId: uid(),
      id: null,
      name: name.trim(),
      type,
      isRequired: required,
      options: type === 'DROPDOWN' ? options.split(',').map(o => o.trim()).filter(Boolean) : [],
      translations: [],
    });
    setName(''); setType('STRING'); setOptions(''); setRequired(false);
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-600">New attribute</p>
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Attribute name"
          className="flex-1 min-w-[160px] border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white w-36
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{TYPE_ICON[v]} {l}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
            className="accent-indigo-600"
          />
          Required
        </label>
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium
            hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          + Add
        </button>
      </div>
      {type === 'DROPDOWN' && (
        <input
          type="text"
          value={options}
          onChange={e => setOptions(e.target.value)}
          placeholder="Options — comma separated e.g. Red, Blue, Green"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const AttributeManagement = () => {
  const [categories, setCategories]   = useState([]);
  const [categoryId, setCategoryId]   = useState('');
  const [attributes, setAttributes]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [catLoading, setCatLoading]   = useState(true);
  const [toast, setToast]             = useState(null); // { msg, type }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setCatLoading(true);
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => showToast('Failed to load categories', 'error'))
      .finally(() => setCatLoading(false));
  }, []);

  const fetchAttributes = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/products/attributes/category/${categoryId}`);
      setAttributes(res.data);
    } catch {
      showToast('Failed to load attributes', 'error');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { fetchAttributes(); }, [fetchAttributes]);

  // ── inline edit of any field ──────────────────────────────────────────────
  const handleChange = (index, field, value) => {
    setAttributes(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = (index) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // ── translation saved callback ────────────────────────────────────────────
  // For unsaved attributes: payload is { language, name } or { deleteIndex }
  // For saved attributes: onSaved is async and we just re-fetch
  const handleTranslationSaved = async (attrIndex, payload) => {
    if (payload === undefined) {
      // saved attr — server already updated, just re-fetch
      await fetchAttributes();
      return;
    }
    // unsaved attr — update local state
    setAttributes(prev => prev.map((a, i) => {
      if (i !== attrIndex) return a;
      if (payload.deleteIndex !== undefined) {
        return { ...a, translations: a.translations.filter((_, j) => j !== payload.deleteIndex) };
      }
      const filtered = a.translations.filter(t => t.language !== payload.language);
      return { ...a, translations: [...filtered, payload] };
    }));
  };

  // ── save all unsaved (and patch changed saved ones) ───────────────────────
  const saveAttributes = async () => {
    if (!categoryId) return showToast('Select a category first', 'error');

    const unsaved = attributes.filter(a => !a.id);
    const saved   = attributes.filter(a =>  a.id);

    if (unsaved.length === 0) return showToast('Nothing new to save', 'error');

    setSaving(true);
    try {
      const created = await Promise.all(
        unsaved.map(attr =>
          axios.post('/products/create/attributes', {
            name: attr.name,
            type: attr.type,
            isRequired: attr.isRequired,
            categoryId,
            options: attr.options,
            translations: attr.translations,
          }).then(res => ({ ...attr, id: res.data.id }))
        )
      );
      // FIX: correctly reassemble — saved existing + newly created
      setAttributes([...saved, ...created]);
      showToast(`${created.length} attribute${created.length !== 1 ? 's' : ''} saved!`);
    } catch (err) {
      showToast('Failed to save attributes', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── patch a saved attribute's edits ──────────────────────────────────────
  const patchAttribute = async (attr) => {
    if (!attr.id) return;
    try {
      await axios.put(`/products/attributes/${attr.id}`, {
        name: attr.name,
        type: attr.type,
        isRequired: attr.isRequired,
        options: attr.options,
        categoryId,
      });
      showToast('Attribute updated');
    } catch {
      showToast('Failed to update attribute', 'error');
    }
  };

  const unsavedCount = attributes.filter(a => !a.id).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          transition-all animate-fade-in
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Attributes</h1>
          <p className="text-sm text-slate-500 mt-1">Define the fields customers fill in per category.</p>
        </div>

        {/* Category selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
          {catLoading ? (
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <select
              value={categoryId}
              onChange={e => { setCategoryId(e.target.value); setAttributes([]); }}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white
                focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="">— Select a category —</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}
        </div>

        {categoryId && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">

            {/* Attribute list */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : attributes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No attributes yet for this category.
              </div>
            ) : (
              <div className="space-y-2">
                {attributes.map((attr, i) => (
                  <AttributeRow
                    key={attr.id || attr._localId || i}
                    attr={attr}
                    index={i}
                    onChange={handleChange}
                    onDelete={handleDelete}
                    onSaveTranslation={async (index, payload) => {
                      if (attr.id) {
                        // saved attr: TranslationPanel already called the API
                        await fetchAttributes();
                      } else {
                        handleTranslationSaved(index, payload);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* Patch-save buttons for already-saved attributes that were edited */}
            {attributes.some(a => a.id) && (
              <div className="flex flex-wrap gap-2">
                {attributes.filter(a => a.id).map((attr, i) => (
                  <button
                    key={attr.id}
                    onClick={() => patchAttribute(attr)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600
                      hover:bg-indigo-100 hover:text-indigo-700 transition-colors border border-slate-200"
                  >
                    Save edits → {attr.name}
                  </button>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100 pt-4">
              <AddAttributeForm onAdd={attr => setAttributes(prev => [...prev, attr])} />
            </div>

            {/* Save new attributes */}
            {unsavedCount > 0 && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <span className="text-sm text-amber-800 font-medium">
                  {unsavedCount} unsaved attribute{unsavedCount !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={saveAttributes}
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold
                    hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Saving…</>
                  ) : '💾 Save'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeManagement;