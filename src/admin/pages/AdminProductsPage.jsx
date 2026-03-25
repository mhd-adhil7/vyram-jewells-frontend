import { useMemo, useState } from 'react';
import { categoryLabels, formatPrice } from '../../storefront/data/catalog';
import { useProductCatalog } from '../../storefront/context/ProductCatalogContext';

const ID_PATTERN = /^[a-z0-9-]+$/;
const CATEGORY_OPTIONS = Object.entries(categoryLabels).filter(([key]) => key !== 'all');

const EMPTY_FORM_STATE = {
  id: '',
  name: '',
  category: CATEGORY_OPTIONS[0]?.[0] ?? 'bridal',
  price: '',
  image: '',
  stock: ''
};

const toFormState = (product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  price: String(product.price),
  image: product.image,
  stock: String(product.stock)
});

const normalizeId = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const AdminProductsPage = () => {
  const { products, createProduct, updateProduct, deleteProduct } = useProductCatalog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [activeId, setActiveId] = useState('');
  const [formState, setFormState] = useState(EMPTY_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap = useMemo(() => Object.fromEntries(CATEGORY_OPTIONS), []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const query = searchTerm.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
  }, [products, searchTerm]);

  const resetForm = () => {
    setFieldErrors({});
    setFormError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMode('create');
    setActiveId('');
    setFormState(EMPTY_FORM_STATE);
    resetForm();
  };

  const openCreateModal = () => {
    setMode('create');
    setActiveId('');
    setFormState(EMPTY_FORM_STATE);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setMode('edit');
    setActiveId(product.id);
    setFormState(toFormState(product));
    resetForm();
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    const normalizedId = normalizeId(formState.id);
    const trimmedName = formState.name.trim();
    const image = formState.image.trim();
    const parsedPrice = Number(formState.price);
    const parsedStock = Number(formState.stock);

    if (mode === 'create') {
      if (!normalizedId) {
        errors.id = 'Product ID is required.';
      } else if (!ID_PATTERN.test(normalizedId)) {
        errors.id = 'Use lowercase letters, numbers, and hyphens only.';
      } else if (products.some((product) => product.id === normalizedId)) {
        errors.id = 'This product ID already exists.';
      }
    }

    if (!trimmedName) {
      errors.name = 'Product name is required.';
    }

    if (!CATEGORY_OPTIONS.some(([key]) => key === formState.category)) {
      errors.category = 'Select a valid category.';
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Enter a price greater than 0.';
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      errors.stock = 'Stock must be a whole number 0 or higher.';
    }

    return {
      errors,
      values: {
        id: normalizedId,
        name: trimmedName,
        category: formState.category,
        price: parsedPrice,
        image,
        stock: parsedStock
      }
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { errors, values } = validateForm();
    setFieldErrors(errors);
    setFormError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      if (mode === 'create') {
        createProduct(values);
      } else {
        updateProduct(activeId, values);
      }

      closeModal();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save product.');
    }
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      deleteProduct(product.id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to delete product.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Products</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                border: '1px solid #c4cec0',
                borderRadius: '4px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button type="button" onClick={openCreateModal}>
              <i className="fa-solid fa-plus"></i>
              Add Product
            </button>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty-row">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{categoryMap[product.category] ?? product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td className="admin-row-actions">
                      <button type="button" aria-label="Edit product" onClick={() => openEditModal(product)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button type="button" aria-label="Delete product" onClick={() => handleDelete(product)}>
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && closeModal()}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-product-form-title">
            <header className="admin-modal-head">
              <h3 id="admin-product-form-title">{mode === 'create' ? 'Add Product' : 'Edit Product'}</h3>
              <button type="button" className="admin-modal-close" aria-label="Close form" onClick={closeModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label htmlFor="product-id">
                  Product ID
                  <input
                    id="product-id"
                    type="text"
                    value={formState.id}
                    onChange={(event) => setFormState((prev) => ({ ...prev, id: event.target.value.toLowerCase() }))}
                    placeholder="diamond-drop-earrings"
                    disabled={mode === 'edit'}
                  />
                  {fieldErrors.id ? <p className="admin-field-error">{fieldErrors.id}</p> : null}
                </label>

                <label htmlFor="product-name">
                  Name
                  <input
                    id="product-name"
                    type="text"
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Diamond Drop Earrings"
                  />
                  {fieldErrors.name ? <p className="admin-field-error">{fieldErrors.name}</p> : null}
                </label>

                <label htmlFor="product-category">
                  Category
                  <select
                    id="product-category"
                    value={formState.category}
                    onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                  >
                    {CATEGORY_OPTIONS.map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category ? <p className="admin-field-error">{fieldErrors.category}</p> : null}
                </label>

                <label htmlFor="product-price">
                  Price (USD)
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    placeholder="0.00"
                  />
                  {fieldErrors.price ? <p className="admin-field-error">{fieldErrors.price}</p> : null}
                </label>

                <label htmlFor="product-stock">
                  Stock
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formState.stock}
                    onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
                    placeholder="0"
                  />
                  {fieldErrors.stock ? <p className="admin-field-error">{fieldErrors.stock}</p> : null}
                </label>

                <label htmlFor="product-image" className="admin-form-full">
                  Image URL
                  <input
                    id="product-image"
                    type="text"
                    value={formState.image}
                    onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                    placeholder="/assets/vyram-cover.jpg"
                  />
                </label>
              </div>

              {formError ? <p className="admin-form-error">{formError}</p> : null}

              <footer className="admin-form-actions">
                <button type="button" className="admin-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {mode === 'create' ? 'Create Product' : 'Save Changes'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
};

export default AdminProductsPage;
