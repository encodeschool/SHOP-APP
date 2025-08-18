import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function DynamicAttributeForm({ categoryId, onChange, productId }) {
  const [attributes, setAttributes] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const loadAttributesAndValues = async () => {
      if (!categoryId) return;

      try {
        const attrRes = await axios.get(`/products/attributes/category/${categoryId}`);
        const rawAttributes = Array.isArray(attrRes.data) ? attrRes.data : [];

        const uniqueAttributes = Object.values(
          rawAttributes.reduce((acc, attr) => {
            acc[attr.id] = attr;
            return acc;
          }, {})
        );

        setAttributes(uniqueAttributes);

        if (productId) {
          const valueRes = await axios.get(`/products/attributes`, {
            params: { productId },
          });

          const existingValues = {};
          valueRes.data.forEach(attrVal => {
            existingValues[attrVal.attributeId] = attrVal.value;
          });

          setValues(existingValues);
        } else {
          setValues({});
        }

        setErrors({});
      } catch (err) {
        console.error('Failed to load attributes or values', err);
      }
    };

    loadAttributesAndValues();
  }, [categoryId, productId]);

  const handleChange = (id, value) => {
    const updatedValues = { ...values, [id]: value };
    setValues(updatedValues);
    setErrors(prev => ({ ...prev, [id]: '' }));
    onChange(updatedValues);  // call parent here directly
  };

  // Optional validation function (call it from parent before submit)
  const validate = () => {
    const newErrors = {};
    attributes.forEach(attr => {
      if (attr.required && (values[attr.id] === undefined || values[attr.id] === '' || values[attr.id] === null)) {
        newErrors[attr.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Expose validate method or have parent manage validation & submission instead

  return (
    <div className="space-y-4">
      {attributes.map((attr) => (
        <div key={attr.id}>
          <label className="block font-semibold mb-1">
            {attr.name} {attr.required && <span className="text-red-500">*</span>}
          </label>

          {attr.type === 'STRING' && (
            <input
              type="text"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}

          {attr.type === 'NUMBER' && (
            <input
              type="number"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}

          {attr.type === 'DROPDOWN' && (
            <select
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">{t("Select an option")}</option>
              {(attr.options || []).map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {attr.type === 'CHECKBOX' && (
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={values[attr.id] === 'true' || values[attr.id] === true}
                onChange={(e) => handleChange(attr.id, e.target.checked)}
                className="mr-2"
              />
              {t("Enable")}
            </label>
          )}

          {attr.type === 'DATE' && (
            <input
              type="date"
              value={values[attr.id] || ''}
              onChange={(e) => handleChange(attr.id, e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          )}

          {errors[attr.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[attr.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
