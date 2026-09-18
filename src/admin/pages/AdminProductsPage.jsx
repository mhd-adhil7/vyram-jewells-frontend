import { useMemo, useState, useRef } from 'react';
import { categoryLabels, formatPrice } from '../../storefront/data/catalog';
import { useProductCatalog } from '../../storefront/context/ProductCatalogContext';
import { getImageKitAuthFromDB, uploadFileToImageKit } from '../../utils/neon';
import { getThumbnailImage, DEFAULT_FALLBACK_IMAGE } from '../../utils/imagekit';

const CATEGORY_OPTIONS = Object.entries(categoryLabels).filter(([key]) => key !== 'all');

const EMPTY_FORM_STATE = {
  id: '',
  name: '',
  category: CATEGORY_OPTIONS[0]?.[1] ?? 'Necklaces',
  bridal_collection: '',
  description: '',
  price: '',
  sale_price: '',
  stock: '10',
  search_keywords: '',
  image_url: '',
  image_file_id: '',
  image_path: ''
};

const generateImageFileName = (productName, originalFileName) => {
  const ext = originalFileName.substring(originalFileName.lastIndexOf('.')).toLowerCase() || '.jpg';
  const cleanTitle = (productName || 'item').slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `vyram_${cleanTitle}_${Math.random().toString(36).slice(2, 9)}${ext}`;
};

const toFormState = (product) => ({
  id: String(product.id),
  name: product.name || '',
  category: product.category || CATEGORY_OPTIONS[0]?.[1] || 'Necklaces',
  bridal_collection: product.bridal_collection || product.collection || '',
  description: product.description || '',
  price: String(product.price ?? ''),
  sale_price: product.sale_price !== null && product.sale_price !== undefined ? String(product.sale_price) : '',
  stock: String(product.stock ?? 10),
  search_keywords: product.search_keywords || product.searchKeywords || '',
  image_url: product.image_url || product.image || '',
  image_file_id: product.image_file_id || '',
  image_path: product.image_path || ''
});

const AdminProductsPage = () => {
  const { products, createProduct, updateProduct, deleteProduct, fetchProducts, isLoading } = useProductCatalog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [activeId, setActiveId] = useState('');
  const [formState, setFormState] = useState(EMPTY_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (categoryFilter !== 'all') {
      result = result.filter(
        (p) =>
          String(p.category || '').toLowerCase() === categoryFilter.toLowerCase() ||
          String(p.categorySlug || '').toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          String(p.id).toLowerCase().includes(query) ||
          String(p.category || '').toLowerCase().includes(query) ||
          String(p.search_keywords || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, searchTerm, categoryFilter]);

  const resetForm = () => {
    setFieldErrors({});
    setFormError('');
    setSelectedFile(null);
    setImagePreview(null);
    setIsSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    setActiveId(String(product.id));
    setFormState(toFormState(product));
    resetForm();
    setImagePreview(product.image_url || product.image || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setFieldErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
      return;
    }

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, image: 'Image size should not exceed 15MB.' }));
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formState.name.trim();
    const parsedPrice = Number(formState.price);
    const parsedStock = Number(formState.stock);

    if (mode === 'create') {
      const trimmedId = formState.id.trim();
      if (trimmedId && products.some((p) => String(p.id) === trimmedId)) {
        errors.id = 'This product ID is already in use.';
      }
      if (!selectedFile) {
        errors.image = 'Please upload a product image.';
      }
    } else {
      if (!selectedFile && !formState.image_url && !formState.image) {
        errors.image = 'Please upload a product image.';
      }
    }

    if (!trimmedName) {
      errors.name = 'Product name is required.';
    }

    if (!formState.category) {
      errors.category = 'Category is required.';
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      errors.stock = 'Stock must be 0 or greater.';
    }

    return {
      errors,
      values: {
        id: formState.id.trim() || undefined,
        name: trimmedName,
        category: formState.category,
        bridal_collection: formState.bridal_collection || null,
        description: formState.description.trim(),
        price: parsedPrice,
        sale_price: formState.sale_price ? Number(formState.sale_price) : null,
        stock: Math.floor(parsedStock),
        search_keywords: formState.search_keywords.trim()
      }
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errors, values } = validateForm();
    setFieldErrors(errors);
    setFormError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        // --- ADD PRODUCT FLOW (Strictly separated: no old image fallback) ---
        if (!selectedFile) {
          setFieldErrors((prev) => ({ ...prev, image: 'Please select an image file.' }));
          setIsSubmitting(false);
          return;
        }

        console.log('[ImageKit Upload - Add Product] Selected file name:', selectedFile.name);
        console.log('[ImageKit Upload - Add Product] Selected file object:', selectedFile);

        const authData = await getImageKitAuthFromDB();
        const cleanName = generateImageFileName(values.name, selectedFile.name);

        const uploadResult = await uploadFileToImageKit(
          selectedFile,
          cleanName,
          authData,
          '/vyram-jewells/products'
        );

        console.log('[ImageKit Upload - Add Product] ImageKit response:', uploadResult);
        console.log('[ImageKit Upload - Add Product] Exact returned URL:', uploadResult.url);

        const uploadedImageUrl = uploadResult.url;
        const uploadedFileId = uploadResult.fileId;
        const uploadedFilePath = uploadResult.filePath;

        console.log('[Database Insert - Add Product] Final image URL being inserted:', uploadedImageUrl);

        const payload = {
          ...values,
          image_url: uploadedImageUrl,
          image: uploadedImageUrl,
          image_file_id: uploadedFileId || null,
          image_path: uploadedFilePath || null
        };

        await createProduct(payload);

        if (typeof fetchProducts === 'function') {
          await fetchProducts();
        }

        closeModal();
      } else {
        // --- EDIT PRODUCT FLOW ---
        let finalImageUrl = formState.image_url || formState.image || null;
        let finalImageFileId = formState.image_file_id || null;
        let finalImagePath = formState.image_path || null;

        if (selectedFile) {
          console.log('[ImageKit Upload - Edit Product] Selected file name:', selectedFile.name);
          console.log('[ImageKit Upload - Edit Product] Selected file object:', selectedFile);

          const authData = await getImageKitAuthFromDB();
          const cleanName = generateImageFileName(values.name, selectedFile.name);

          const uploadResult = await uploadFileToImageKit(
            selectedFile,
            cleanName,
            authData,
            '/vyram-jewells/products'
          );

          console.log('[ImageKit Upload - Edit Product] ImageKit response:', uploadResult);
          console.log('[ImageKit Upload - Edit Product] Exact returned URL:', uploadResult.url);

          finalImageUrl = uploadResult.url;
          finalImageFileId = uploadResult.fileId;
          finalImagePath = uploadResult.filePath;
        }

        console.log('[Database Update - Edit Product] Final image URL being updated:', finalImageUrl);

        const payload = {
          ...values,
          image_url: finalImageUrl,
          image: finalImageUrl,
          image_file_id: finalImageFileId,
          image_path: finalImagePath
        };

        await updateProduct(activeId, payload);

        if (typeof fetchProducts === 'function') {
          await fetchProducts();
        }

        closeModal();
      }
    } catch (error) {
      console.error('Save product error:', error);
      setFormError(error instanceof Error ? error.message : 'Unable to save product.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${product.name}"? This product will be deactivated in Neon.`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id, true);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to delete product.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2>Products Management</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#687763' }}>
              Connected to Neon PostgreSQL & ImageKit CDN ({products.length} total products)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem',
                border: '1px solid #c4cec0',
                borderRadius: '4px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map(([key, label]) => (
                <option key={key} value={label}>
                  {label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem',
                border: '1px solid #c4cec0',
                borderRadius: '4px',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                minWidth: '200px'
              }}
            />

            <button type="button" onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-plus"></i>
              Add Product
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th style={{ width: '70px' }}>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ width: '90px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-empty-row">
                    Loading products from Neon database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-empty-row">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          background: '#f2f4f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={getThumbnailImage(product.image || product.image_url)}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>{product.id}</code>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.bridal_collection ? (
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#c9933b',
                            marginTop: '2px'
                          }}
                        >
                          {product.bridal_collection}
                        </span>
                      ) : null}
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock ?? 10}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: product.is_active ? '#e7f4e8' : '#fbeae8',
                          color: product.is_active ? '#2b7a35' : '#c93b2b'
                        }}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="admin-row-actions">
                      <button
                        type="button"
                        aria-label="Edit product"
                        title="Edit product"
                        onClick={() => openEditModal(product)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        aria-label="Delete product"
                        title="Delete/Deactivate product"
                        onClick={() => handleDelete(product)}
                      >
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
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={(event) => event.target === event.currentTarget && !isSubmitting && closeModal()}
        >
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-product-form-title">
            <header className="admin-modal-head">
              <h3 id="admin-product-form-title">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h3>
              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close form"
                disabled={isSubmitting}
                onClick={closeModal}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label htmlFor="product-name" className="admin-form-full">
                  Product Name *
                  <input
                    id="product-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="e.g. Kerala Royal Choker"
                    disabled={isSubmitting}
                  />
                  {fieldErrors.name ? <p className="admin-field-error">{fieldErrors.name}</p> : null}
                </label>

                <label htmlFor="product-category">
                  Category *
                  <select
                    id="product-category"
                    value={formState.category}
                    disabled={isSubmitting}
                    onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                  >
                    {CATEGORY_OPTIONS.map(([key, label]) => (
                      <option key={key} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category ? <p className="admin-field-error">{fieldErrors.category}</p> : null}
                </label>

                <label htmlFor="product-bridal-col">
                  Bridal Collection (Optional)
                  <select
                    id="product-bridal-col"
                    value={formState.bridal_collection}
                    disabled={isSubmitting}
                    onChange={(event) => setFormState((prev) => ({ ...prev, bridal_collection: event.target.value }))}
                  >
                    <option value="">None (Standard Product)</option>
                    <option value="Kerala Bridal Collection">Kerala Bridal Collection</option>
                    <option value="Antique Bridal Collection">Antique Bridal Collection</option>
                    <option value="Trending Bridal Collection">Trending Bridal Collection</option>
                    <option value="Budget Friendly Collection">Budget Friendly Collection</option>
                    <option value="Premium Sets Collection">Premium Sets Collection</option>
                  </select>
                </label>

                <label htmlFor="product-price">
                  Price (₹ INR) *
                  <input
                    id="product-price"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={formState.price}
                    onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
                    placeholder="e.g. 1499"
                    disabled={isSubmitting}
                  />
                  {fieldErrors.price ? <p className="admin-field-error">{fieldErrors.price}</p> : null}
                </label>

                <label htmlFor="product-stock">
                  Stock Units
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formState.stock}
                    onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
                    placeholder="10"
                    disabled={isSubmitting}
                  />
                  {fieldErrors.stock ? <p className="admin-field-error">{fieldErrors.stock}</p> : null}
                </label>

                <label htmlFor="product-id">
                  Custom Product ID (Optional)
                  <input
                    id="product-id"
                    type="text"
                    value={formState.id}
                    onChange={(event) => setFormState((prev) => ({ ...prev, id: event.target.value }))}
                    placeholder="Leave empty for auto-generated ID"
                    disabled={mode === 'edit' || isSubmitting}
                  />
                  {fieldErrors.id ? <p className="admin-field-error">{fieldErrors.id}</p> : null}
                </label>

                <label htmlFor="product-keywords">
                  Search Keywords
                  <input
                    id="product-keywords"
                    type="text"
                    value={formState.search_keywords}
                    onChange={(event) => setFormState((prev) => ({ ...prev, search_keywords: event.target.value }))}
                    placeholder="e.g. gold choker, bridal, temple"
                    disabled={isSubmitting}
                  />
                </label>

                <label htmlFor="product-desc" className="admin-form-full">
                  Description
                  <textarea
                    id="product-desc"
                    rows="2"
                    value={formState.description}
                    onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Handcrafted piece with exquisite details..."
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.8rem',
                      border: '1px solid #c4cec0',
                      borderRadius: '4px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </label>

                {/* Direct ImageKit Upload Section */}
                <div className="admin-form-full" style={{ marginTop: '5px' }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                    Product Image (Direct ImageKit Upload) *
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f9faf8',
                      border: '1px dashed #b8c4b4',
                      borderRadius: '6px'
                    }}
                  >
                    {imagePreview ? (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid #dcdfd9',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '4px',
                          background: '#ebeee9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#849380',
                          flexShrink: 0
                        }}
                      >
                        <i className="fa-regular fa-image" style={{ fontSize: '1.6rem' }}></i>
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        id="product-image-file"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="product-image-file"
                        className="admin-btn-secondary"
                        style={{
                          display: 'inline-block',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          padding: '6px 14px',
                          fontSize: '0.85rem',
                          marginBottom: '4px'
                        }}
                      >
                        <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: '6px' }}></i>
                        {selectedFile ? 'Change Selected File' : mode === 'edit' ? 'Replace Image' : 'Select Image File'}
                      </label>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#667761' }}>
                        {selectedFile
                          ? `Selected: ${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`
                          : mode === 'edit'
                          ? 'Current image preserved from ImageKit. Choose a file to replace it.'
                          : 'PNG, JPG, WEBP, HEIC up to 15MB. Automatically optimized by ImageKit.'}
                      </p>
                    </div>
                  </div>
                  {fieldErrors.image ? <p className="admin-field-error">{fieldErrors.image}</p> : null}
                </div>
              </div>

              {formError ? <p className="admin-form-error">{formError}</p> : null}

              <footer className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      {selectedFile ? 'Uploading to ImageKit...' : 'Saving to Neon...'}
                    </>
                  ) : mode === 'create' ? (
                    'Create Product'
                  ) : (
                    'Save Changes'
                  )}
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
