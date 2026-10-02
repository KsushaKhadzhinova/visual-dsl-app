import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateForm, hasErrors, validateField } from '../../utils/validationUtils';

const EntityForm = ({ onSubmit, initialData = {}, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validationRules = {
    name: {
      required: true,
      maxLength: 50,
      minLength: 2,
      fieldName: 'Название'
    },
    description: {
      required: true,
      maxLength: 200,
      minLength: 5,
      fieldName: 'Описание'
    },
    category: {
      required: true,
      maxLength: 30,
      fieldName: 'Категория'
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));

    if (touched[fieldName]) {
      const error = validateField(value, validationRules[fieldName]);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error
      }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true
    }));

    const error = validateField(formData[fieldName], validationRules[fieldName]);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData, validationRules);
    setErrors(formErrors);

    const allTouched = {};
    Object.keys(validationRules).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (hasErrors(formErrors)) {
      console.log('❌ Форма содержит ошибки:', formErrors);
      return;
    }

    console.log('✅ Отправляем данные:', formData);

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: initialData.name || '',
      description: initialData.description || '',
      category: initialData.category || ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <h2>{mode === 'create' ? '✨ Создать сущность' : '✏️ Редактировать сущность'}</h2>

      <Input
        name="name"
        label="Название"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        onBlur={() => handleFieldBlur('name')}
        placeholder="Введите название..."
        maxLength={50}
        required
        error={errors.name}
      />

      <Input
        name="description"
        label="Описание"
        value={formData.description}
        onChange={(value) => handleInputChange('description', value)}
        onBlur={() => handleFieldBlur('description')}
        placeholder="Введите описание..."
        maxLength={200}
        required
        error={errors.description}
      />

      <Input
        name="category"
        label="Категория"
        value={formData.category}
        onChange={(value) => handleInputChange('category', value)}
        onBlur={() => handleFieldBlur('category')}
        placeholder="Введите категорию..."
        maxLength={30}
        required
        error={errors.category}
      />

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>

        <Button type="button" variant="secondary" onClick={handleReset}>
          Отменить
        </Button>
      </div>
    </form>
  );
};

export default EntityForm;