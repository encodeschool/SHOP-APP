import { useEffect, useState, useCallback, useRef } from 'react';
import axios from '../../api/axios';
import DynamicAttributeForm from '../../components/DynamicAttributeForm';
import MapPicker from '../../components/MapPicker';
import {
  FaClipboardList,
  FaThList,
  FaMapMarkerAlt,
  FaImage,
  FaCheck,
  FaTimes,
  FaPlus,
  FaStar,
  FaRegStar,
  FaBoxOpen,
  FaCamera,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaSatelliteDish,
  FaFilter
} from 'react-icons/fa';

// ─── constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const STEPS = [
  { id: 1, label: 'Basics', icon: <FaClipboardList /> },
  { id: 2, label: 'Category', icon: <FaThList /> },
  { id: 3, label: 'Location', icon: <FaMapMarkerAlt /> },
  { id: 4, label: 'Media', icon: <FaImage /> },
];
const EMPTY_PRODUCT = {
  title: '', description: '', price: '', stock: '',
  condition: 'NEW', categoryId: '', subcategoryId: '', subsubcategoryId: '',
  userId: '', featured: false, images: [], brandId: '', attributes: [],
  translations: [], unitId: '', currencyId: '',
  location: { latitude: null, longitude: null, city: '', region: '', country: '', address: '', source: 'MANUAL' },
};
const LANG_OPTIONS = [{ value: 'en', label: 'English' }, { value: 'ru', label: 'Russian' }, { value: 'uz', label: 'Uzbek' }];

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function useDebounce(val, ms) {
  const [dv, setDv] = useState(val);
  useEffect(() => { const t = setTimeout(() => setDv(val), ms); return () => clearTimeout(t); }, [val, ms]);
  return dv;
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white transition-all
      ${type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
      {type === 'error' ? <FaTimes /> : <FaCheck />} {msg}
    </div>
  );
}

// ─── validation per step ──────────────────────────────────────────────────────
function validateStep(step, product) {
  const errs = {};
  if (step === 1) {
    if (!product.title.trim())         errs.title       = 'Title is required';
    if (!product.price || isNaN(product.price) || +product.price <= 0) errs.price = 'Valid price required';
    if (!product.stock || isNaN(product.stock) || +product.stock < 0)  errs.stock = 'Valid stock required';
    if (!product.currencyId)           errs.currencyId  = 'Select a currency';
    if (!product.userId)               errs.userId      = 'Select a user';
  }
  if (step === 2) {
    if (!product.categoryId)           errs.categoryId  = 'Select a category';
  }
  if (step === 3) {
    if (!product.location.latitude)    errs.location    = 'Set product location on the map or use GPS';
  }
  return errs;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current, maxReached, onGoto }) {
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      {STEPS.map((s, idx) => {
        const done    = s.id < current;
        const active  = s.id === current;
        const locked = s.id > maxReached;
        return (
          <div key={s.id} className="flex items-center flex-1">
            <button
              disabled={locked}
              onClick={() => onGoto(s.id)}
              className={`flex flex-col items-center gap-1 group disabled:cursor-default`}
            >
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-all border-2
                ${active  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110' :
                  done    ? 'bg-emerald-500 border-emerald-500 text-white' :
                  locked  ? 'bg-slate-100 border-slate-200 text-slate-300' :
                            'bg-white border-slate-300 text-slate-500 hover:border-indigo-400'}`}>
                {done ? <FaCheck /> : s.icon}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-indigo-700' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────
function FieldErr({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}

// ─── FormField wrapper ────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <FieldErr msg={error} />
    </div>
  );
}

const inputCls = (err) =>
  `w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition
   ${err ? 'border-red-400 bg-red-50' : 'border-slate-300'}`;

// ─── Image preview ────────────────────────────────────────────────────────────
function ImagePreviews({ files, existing, onRemoveFile, onRemoveExisting }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {/* existing images */}
      {existing?.map((url, i) => (
        <div key={`ex-${i}`} className="relative group w-20 h-20 rounded-xl overflow-hidden border shadow-sm">
          <img
            src={url.startsWith('http') ? url : `${BASE_URL}${url}`}
            alt="existing"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => onRemoveExisting(i)}
            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ))}

      {/* new files */}
      {files.map((f, i) => (
        <div key={`new-${i}`} className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-indigo-300">
          <img
            src={URL.createObjectURL(f)}
            alt="new"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => onRemoveFile(i)}
            className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            ×
          </button>
          <span className="absolute bottom-0 w-full text-center text-[9px] bg-indigo-600 text-white">
            new
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Filter bar ──────────────────────────────────────────────────────────────
function FilterBar({ categories, filters, onChange, onReset }) {
  const hasFilters = filters.categoryId || filters.condition || filters.featured !== '' || filters.minPrice || filters.maxPrice;
  return (
    <div className="flex flex-wrap gap-2 items-end mt-3">
      <select value={filters.categoryId} onChange={e => onChange('categoryId', e.target.value)}
        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <option value="">All Categories</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={filters.condition} onChange={e => onChange('condition', e.target.value)}
        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <option value="">All Conditions</option>
        <option value="NEW">New</option>
        <option value="USED">Used</option>
      </select>
      <select value={filters.featured} onChange={e => onChange('featured', e.target.value)}
        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <option value="">Featured: All</option>
        <option value="true">Featured only</option>
        <option value="false">Non-featured</option>
      </select>
      <div className="flex items-center gap-1">
        <input type="number" placeholder="Min $" value={filters.minPrice}
          onChange={e => onChange('minPrice', e.target.value)}
          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <span className="text-slate-400 text-sm">—</span>
        <input type="number" placeholder="Max $" value={filters.maxPrice}
          onChange={e => onChange('maxPrice', e.target.value)}
          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
      {hasFilters && (
        <button onClick={onReset} className="text-xs text-indigo-600 hover:text-indigo-800 underline">Clear filters</button>
      )}
    </div>
  );
}

// ─── Main Products page ───────────────────────────────────────────────────────
export default function Products() {
  const BASE_URL = process.env.REACT_APP_BASE_URL || '';

  // ── reference data ─────────────────────────────────────────────────────────
  const [categories,      setCategories]      = useState([]);
  const [subcategories,   setSubcategories]   = useState([]);
  const [subsubcategories,setSubsubcategories]= useState([]);
  const [users,           setUsers]           = useState([]);
  const [attributes,      setAttributes]      = useState([]);
  const [brands,          setBrands]          = useState([]);
  const [units,           setUnits]           = useState([]);
  const [currencies,      setCurrencies]      = useState([]);

  // ── list state ─────────────────────────────────────────────────────────────
  const [products,  setProducts]  = useState([]);
  const [totalPages,setTotalPages]= useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(0);
  const debouncedSearch = useDebounce(search, 400);

  const [filters, setFilters] = useState({ categoryId: '', condition: '', featured: '', minPrice: '', maxPrice: '' });
  const updateFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(0); };
  const resetFilters = () => { setFilters({ categoryId: '', condition: '', featured: '', minPrice: '', maxPrice: '' }); setPage(0); };

  // ── toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // ── drawer / form state ────────────────────────────────────────────────────
  const [isDrawerOpen,  setIsDrawerOpen]  = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [step,          setStep]          = useState(1);
  const [maxReached,    setMaxReached]    = useState(1);
  const [product,       setProduct]       = useState({ ...EMPTY_PRODUCT });
  const [errors,        setErrors]        = useState({});
  const [saving,        setSaving]        = useState(false);
  const [existingImages,setExistingImages]= useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  // ── fetch products (FIX: use params not closure-captured state) ────────────
  // FIX: pass page explicitly so pagination calls always use fresh value
  const fetchProducts = useCallback((pageOverride) => {
    const p = pageOverride !== undefined ? pageOverride : page;
    setIsLoading(true);

    const params = { page: p, size: PAGE_SIZE };
    if (debouncedSearch.trim()) params.q     = debouncedSearch.trim();
    if (filters.categoryId)     params.categoryId = filters.categoryId;
    if (filters.condition)      params.condition  = filters.condition;
    if (filters.featured !== '') params.featured   = filters.featured;
    if (filters.minPrice)       params.minPrice    = filters.minPrice;
    if (filters.maxPrice)       params.maxPrice    = filters.maxPrice;

    const url = debouncedSearch.trim() ? '/products/search' : '/products';
    axios.get(url, { params })
      .then(res => {
        const data = res.data;
        setProducts(Array.isArray(data) ? data : (data.content || []));
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => showToast('Failed to fetch products', 'error'))
      .finally(() => setIsLoading(false));
  }, [page, debouncedSearch, filters]);

  // FIX: re-fetch whenever page, search or filters change
  useEffect(() => { fetchProducts(page); }, [page, debouncedSearch, filters]); // eslint-disable-line

  // ── fetch reference data once ──────────────────────────────────────────────
  useEffect(() => {
    axios.get('/categories').then(res => {
      const all = Array.isArray(res.data) ? res.data : [];
      setCategories(all.filter(c => !c.parentId));
    }).catch(() => {});
    axios.get('/users').then(res => setUsers(Array.isArray(res.data) ? res.data : [])).catch(() => {});
    axios.get('/products/brands').then(res => setBrands(Array.isArray(res.data) ? res.data : [])).catch(() => {});
    axios.get('/units').then(res => setUnits(Array.isArray(res.data) ? res.data : [])).catch(() => {});
    axios.get('/currency').then(res => setCurrencies(Array.isArray(res.data) ? res.data : [])).catch(() => {});
  }, []);

  const loadSubcategories = (catId) => {
    if (!catId) { setSubcategories([]); return; }
    axios.get(`/categories/${catId}/subcategories`)
      .then(res => setSubcategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSubcategories([]));
  };
  const loadSubsubcategories = (subcatId) => {
    if (!subcatId) { setSubsubcategories([]); return; }
    axios.get(`/categories/${subcatId}/subcategories`)
      .then(res => setSubsubcategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSubsubcategories([]));
  };
  const loadAttributes = (catId) => {
    if (!catId) { setAttributes([]); return; }
    axios.get(`/products/attributes/category/${catId}`)
      .then(res => setAttributes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAttributes([]));
  };

  // ── reverse geocode (FIX: stable ref to prevent infinite loop) ────────────
  const geocodeRef = useRef(false);
  useEffect(() => {
    const { latitude, longitude } = product.location;
    if (!latitude || !longitude || geocodeRef.current) return;
    geocodeRef.current = true;
    axios.get('/geo/reverse', { params: { lat: latitude, lon: longitude } })
      .then(res => {
        setProduct(prev => ({
          ...prev,
          location: { ...prev.location, city: res.data.city || '', region: res.data.region || '', country: res.data.country || '', address: res.data.address || prev.location.address }
        }));
      })
      .catch(() => {})
      .finally(() => { geocodeRef.current = false; });
  }, [product.location.latitude, product.location.longitude]); // eslint-disable-line

  // ── drawer open helpers ────────────────────────────────────────────────────
  const openCreate = () => {
    setProduct({ ...EMPTY_PRODUCT });
    setExistingImages([]);
    setEditingId(null);
    setStep(1); setMaxReached(1); setErrors({});
    setSubcategories([]); setSubsubcategories([]); setAttributes([]);
    setIsDrawerOpen(true);
  };

  const openEdit = (p) => {
    const parentId = p.category?.parentId;
    setProduct({
      title: p.title || '',
      description: p.description || '',
      price: p.price ?? '',
      stock: p.stock ?? '',
      condition: p.condition || 'NEW',
      categoryId: parentId || p.categoryId || '',
      subcategoryId: parentId ? (p.categoryId || '') : '',
      subsubcategoryId: '',
      userId: p.user?.id || '',
      featured: p.featured ?? false,
      images: [],
      attributes: (p.attributes || []).map(a => ({ attributeId: a.attribute?.id || a.attributeId, value: a.value ?? '' })),
      brandId: p.brand?.id || '',
      translations: p.translations || [],
      unitId: p.unitId || '',
      currencyId: p.currency?.id || '',
      location: p.location || { ...EMPTY_PRODUCT.location },
    });
    setExistingImages(p.imageUrls || []);
    if (parentId) {
      loadSubcategories(parentId);
      // FIX: also load subsub level
      loadSubsubcategories(p.categoryId);
    }
    loadAttributes(p.categoryId);
    setEditingId(p.id);
    setStep(1); setMaxReached(4); setErrors({});
    setIsDrawerOpen(true);
  };

  // ── category cascade ───────────────────────────────────────────────────────
  const handleCategoryChange = (field, value) => {
    if (field === 'categoryId') {
      setProduct(prev => ({ ...prev, categoryId: value, subcategoryId: '', subsubcategoryId: '', attributes: [] }));
      loadSubcategories(value);
      setSubsubcategories([]);
      loadAttributes(value);
    } else if (field === 'subcategoryId') {
      setProduct(prev => ({ ...prev, subcategoryId: value, subsubcategoryId: '', attributes: [] }));
      loadSubsubcategories(value);
      loadAttributes(value);
    } else if (field === 'subsubcategoryId') {
      setProduct(prev => ({ ...prev, subsubcategoryId: value }));
      loadAttributes(value);
    }
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  // ── generic field change ───────────────────────────────────────────────────
  const set = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  // ── translations ───────────────────────────────────────────────────────────
  const addTranslation    = () => setProduct(p => ({ ...p, translations: [...p.translations, { language: '', name: '', description: '' }] }));
  const removeTranslation = (i) => setProduct(p => ({ ...p, translations: p.translations.filter((_, j) => j !== i) }));
  const updateTranslation = (i, field, value) => setProduct(p => {
    const t = [...p.translations]; t[i] = { ...t[i], [field]: value }; return { ...p, translations: t };
  });

  // ── GPS ────────────────────────────────────────────────────────────────────
  const useGPS = () => {
    if (!navigator.geolocation) return showToast('Geolocation not supported', 'error');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setProduct(prev => ({ ...prev, location: { ...prev.location, latitude: pos.coords.latitude, longitude: pos.coords.longitude, source: 'GPS' } }));
        setErrors(e => ({ ...e, location: undefined }));
      },
      () => showToast('Location permission denied', 'error')
    );
  };

  // ── step navigation ────────────────────────────────────────────────────────
  const goToStep = (n) => {
    // allow only going back freely
    if (n < step) {
      setStep(n);
      return;
    }

    // validate all steps before target
    let allErrs = {};

    for (let i = 1; i < n; i++) {
      allErrs = { ...allErrs, ...validateStep(i, product) };
    }

    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      showToast('Please complete previous steps first', 'error');
      return;
    }

    setErrors({});
    setStep(n);

    if (n > maxReached) {
      setMaxReached(n);
    }
  };

  const nextStep = () => {
    const errs = validateStep(step, product);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    goToStep(step + 1);
  };
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Validate all steps before final submit
    let allErrs = {};
    [1, 2, 3].forEach(s => { allErrs = { ...allErrs, ...validateStep(s, product) }; });
    if (Object.keys(allErrs).length > 0) { setErrors(allErrs); showToast('Please fix all errors', 'error'); return; }

    setSaving(true);
    const finalCatId = product.subsubcategoryId || product.subcategoryId || product.categoryId;
    const payload = {
      title: product.title, description: product.description,
      price: parseFloat(product.price), stock: parseInt(product.stock),
      condition: product.condition, categoryId: finalCatId,
      userId: product.userId, featured: product.featured,
      brandId: product.brandId || null, unitId: product.unitId || null,
      currencyId: product.currencyId, attributes: product.attributes,
      translations: product.translations, location: product.location,
    };

    const fd = new FormData();
    fd.append('product', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    product.images.forEach(img => fd.append('images', img));

    try {
      if (editingId) {
        await axios.put(`/products/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product updated!');
      } else {
        await axios.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product created!');
      }
      setIsDrawerOpen(false);
      fetchProducts(page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/products/${id}`);
      showToast('Product deleted');
      fetchProducts(page);
    } catch { showToast('Failed to delete', 'error'); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex gap-4">
      <Toast msg={toast?.msg} type={toast?.type} />
      
      <div className='w-[100%]'>
        
        <h1 className="text-xl font-bold">Products</h1>
        <p className="text-sm text-slate-500 mb-4">{products.length} shown</p>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-4">
          
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors">
            <span className="text-lg leading-none"><FaPlus /></span> New Product
          </button>
          <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
          >
            <span className="text-lg leading-none"><FaFilter /></span> Filters
          </button>
          {/* Search + Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                  type="text" placeholder="Search products…" value={search}
                  onChange={e => { setSearch(e.target.value); setPage(0); }}
                  className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <FaThList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {search && <button onClick={() => { setSearch(''); setPage(0); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">×</button>}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <div className="text-4xl mb-3">📦</div>
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Image','Title','Category','Price','Stock','Condition','Featured','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        {p.imageUrls?.[0]
                          ? <img src={`${BASE_URL}${p.imageUrls[0]}`} alt={p.title} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm" />
                          : <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-lg">📷</div>}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px] truncate">{p.title}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{p.category?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.price} <span className="text-slate-400 font-normal">{p.currency?.code}</span></td>
                      <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                          ${p.condition === 'NEW' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.featured
                          ? <span className="text-amber-500 font-bold text-base">★</span>
                          : <span className="text-slate-300 text-base">☆</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
              return (
                <button key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                    ${page === pageNum ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-300 hover:bg-slate-50'}`}>
                  {pageNum + 1}
                </button>
              );
            })}
            <button disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-40 hover:bg-slate-50 transition-colors">
              Next →
            </button>
          </div>
        )}

        {/* Drawer backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer */}
        <div className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 w-full md:w-[540px] flex flex-col
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <p className="text-xs text-slate-400">Step {step} of {STEPS.length}</p>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">×</button>
          </div>

          {/* Step bar */}
          <div className="px-6 pt-4 shrink-0">
            <StepBar current={step} maxReached={maxReached} onGoto={goToStep} />
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">

            {/* ── Step 1: Basics ─────────────────────────────────────────────── */}
            {step === 1 && (
              <>
                <Field label="Title" required error={errors.title}>
                  <input value={product.title} onChange={e => set('title', e.target.value)} placeholder="Product title" className={inputCls(errors.title)} />
                </Field>
                <Field label="Description">
                  <textarea value={product.description} onChange={e => set('description', e.target.value)} placeholder="Describe the product…" rows={3} className={inputCls(false) + ' resize-none'} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price" required error={errors.price}>
                    <input type="number" value={product.price} onChange={e => set('price', e.target.value)} placeholder="0.00" className={inputCls(errors.price)} />
                  </Field>
                  <Field label="Currency" required error={errors.currencyId}>
                    <select value={product.currencyId} onChange={e => set('currencyId', e.target.value)} className={inputCls(errors.currencyId)}>
                      <option value="">Select</option>
                      {currencies.map(c => <option key={c.id} value={c.id}>{c.code} {c.symbol}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Stock" required error={errors.stock}>
                    <input type="number" value={product.stock} onChange={e => set('stock', e.target.value)} placeholder="0" className={inputCls(errors.stock)} />
                  </Field>
                  <Field label="Condition">
                    <select value={product.condition} onChange={e => set('condition', e.target.value)} className={inputCls(false)}>
                      <option value="NEW">New</option>
                      <option value="USED">Used</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Brand">
                    <select value={product.brandId} onChange={e => set('brandId', e.target.value)} className={inputCls(false)}>
                      <option value="">No brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Unit">
                    <select value={product.unitId} onChange={e => set('unitId', e.target.value)} className={inputCls(false)}>
                      <option value="">No unit</option>
                      {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Assigned User" required error={errors.userId}>
                  <select value={product.userId} onChange={e => set('userId', e.target.value)} className={inputCls(errors.userId)}>
                    <option value="">Select user</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                  </select>
                </Field>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={product.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Mark as Featured <span className="text-amber-500">★</span></span>
                </label>
              </>
            )}

            {/* ── Step 2: Category & Attributes ──────────────────────────────── */}
            {step === 2 && (
              <>
                <Field label="Category" required error={errors.categoryId}>
                  <select value={product.categoryId} onChange={e => handleCategoryChange('categoryId', e.target.value)} className={inputCls(errors.categoryId)}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                {subcategories.length > 0 && (
                  <Field label="Subcategory">
                    <select value={product.subcategoryId} onChange={e => handleCategoryChange('subcategoryId', e.target.value)} className={inputCls(false)}>
                      <option value="">Select subcategory</option>
                      {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </Field>
                )}
                {subsubcategories.length > 0 && (
                  <Field label="Sub-subcategory">
                    <select value={product.subsubcategoryId} onChange={e => handleCategoryChange('subsubcategoryId', e.target.value)} className={inputCls(false)}>
                      <option value="">Select sub-subcategory</option>
                      {subsubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </Field>
                )}
                {(product.categoryId) && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Attributes</p>
                    <DynamicAttributeForm
                      categoryId={product.subsubcategoryId || product.subcategoryId || product.categoryId}
                      productId={editingId}
                      onChange={(map) => setProduct(prev => ({
                        ...prev,
                        attributes: Object.entries(map).map(([attributeId, value]) => ({ attributeId, value }))
                      }))}
                    />
                  </div>
                )}
                {/* Translations */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Translations</p>
                    <button onClick={addTranslation} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"><FaPlus /> Add</button>
                  </div>
                  {product.translations.length === 0 && <p className="text-xs text-slate-400 italic">No translations yet.</p>}
                  {product.translations.map((t, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <select value={t.language} onChange={e => updateTranslation(i, 'language', e.target.value)} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-36">
                          <option value="">Language</option>
                          {LANG_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                        <button onClick={() => removeTranslation(i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                      <input value={t.name} onChange={e => updateTranslation(i, 'name', e.target.value)} placeholder="Translated name" className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      <input value={t.description} onChange={e => updateTranslation(i, 'description', e.target.value)} placeholder="Translated description" className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 3: Location ───────────────────────────────────────────── */}
            {step === 3 && (
              <>
                <FieldErr msg={errors.location} />
                <button type="button" onClick={useGPS}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl py-3 text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">
                  <FaSatelliteDish /> Use GPS Location
                </button>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <MapPicker
                    location={product.location}
                    onChange={loc => {
                      setProduct(prev => ({ ...prev, location: { ...prev.location, ...loc } }));
                      setErrors(e => ({ ...e, location: undefined }));
                    }}
                  />
                </div>
                {product.location.latitude && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[['city','City'],['region','Region'],['country','Country']].map(([k,label]) => (
                      <Field key={k} label={label}>
                        <input value={product.location[k]} readOnly className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-default" />
                      </Field>
                    ))}
                    <Field label="Coordinates">
                      <input readOnly value={`${product.location.latitude?.toFixed(5)}, ${product.location.longitude?.toFixed(5)}`}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 font-mono cursor-default" />
                    </Field>
                    <div className="col-span-2">
                      <Field label="Address">
                        <input value={product.location.address} readOnly className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-600 cursor-default" />
                      </Field>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Step 4: Media ──────────────────────────────────────────────── */}
            {step === 4 && (
              <>
                <Field label="Images">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer hover:bg-indigo-50/30 transition-colors">
                    <FaImage className="text-2xl mb-1" />
                    <span className="text-sm text-slate-500">Click to upload images</span>
                    <span className="text-xs text-slate-400">PNG, JPG, WEBP accepted</span>
                    <input type="file" multiple accept="image/*" className="hidden"
                      onChange={e => set('images', Array.from(e.target.files))} />
                  </label>
                </Field>
                <ImagePreviews
                  files={product.images}
                  existing={existingImages}
                  onRemoveFile={i => set('images', product.images.filter((_, j) => j !== i))}
                  onRemoveExisting={i => setExistingImages(imgs => imgs.filter((_, j) => j !== i))}
                />
                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Summary</p>
                  {[
                    ['Title', product.title],
                    ['Price', `${product.price} ${currencies.find(c=>c.id===product.currencyId)?.code||''}`],
                    ['Stock', product.stock],
                    ['Condition', product.condition],
                    ['Category', categories.find(c=>c.id===product.categoryId)?.name || '—'],
                    ['Location', product.location.city ? `${product.location.city}, ${product.location.country}` : 'Not set'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-medium text-slate-800 text-right max-w-[60%] truncate">{v || '—'}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Drawer footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between shrink-0 bg-white">
            <button onClick={prevStep} disabled={step === 1}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors">
              ← Back
            </button>
            {step < STEPS.length ? (
              <button onClick={nextStep}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-colors">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <>{editingId ? '💾 Update' : '✓ Create'} Product</>}
              </button>
            )}
          </div>
        </div>
        
        {/* ───────────────────────────────────────────── */}
        {/* FILTER BACKDROP */}
        {/* ───────────────────────────────────────────── */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity
          ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsFilterOpen(false)}
        />

        {/* ───────────────────────────────────────────── */}
        {/* FILTER DRAWER */}
        {/* ───────────────────────────────────────────── */}
        <div
          className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300
          w-full md:w-[520px] flex flex-col
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >

          {/* HEADER (same style as product drawer) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Filter Products</h2>
              <p className="text-xs text-slate-400">Refine your search</p>
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              ×
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* ───────── SECTION 1 ───────── */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Basic Filters
              </p>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-600">Category</label>
                <select
                  value={tempFilters.categoryId}
                  onChange={e =>
                    setTempFilters(f => ({ ...f, categoryId: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="text-xs font-semibold text-slate-600">Condition</label>
                <select
                  value={tempFilters.condition}
                  onChange={e =>
                    setTempFilters(f => ({ ...f, condition: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                </select>
              </div>
            </div>

            {/* ───────── SECTION 2 ───────── */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Price Range
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min price"
                  value={tempFilters.minPrice}
                  onChange={e =>
                    setTempFilters(f => ({ ...f, minPrice: e.target.value }))
                  }
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <input
                  type="number"
                  placeholder="Max price"
                  value={tempFilters.maxPrice}
                  onChange={e =>
                    setTempFilters(f => ({ ...f, maxPrice: e.target.value }))
                  }
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* ───────── SECTION 3 ───────── */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Visibility
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-600">Featured</label>
                <select
                  value={tempFilters.featured}
                  onChange={e =>
                    setTempFilters(f => ({ ...f, featured: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All</option>
                  <option value="true">Featured only</option>
                  <option value="false">Not featured</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER (same style as product drawer) */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between shrink-0 bg-white">

            <button
              onClick={() => {
                const reset = {
                  categoryId: '',
                  condition: '',
                  featured: '',
                  minPrice: '',
                  maxPrice: ''
                };
                setTempFilters(reset);
              }}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>

            <button
              onClick={() => {
                setFilters(tempFilters);
                setPage(0);
                setIsFilterOpen(false);
              }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}