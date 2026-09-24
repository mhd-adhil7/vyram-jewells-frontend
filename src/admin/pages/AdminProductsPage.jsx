import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categoryLabels, formatPrice } from '../../storefront/data/catalog';
import { useProductCatalog } from '../../storefront/context/ProductCatalogContext';
import { getImageKitAuthFromDB, uploadFileToImageKit } from '../../utils/neon';
import { getThumbnailImage } from '../../utils/imagekit';

const CATEGORY_OPTIONS = Object.entries(categoryLabels).filter(([key]) => key !== 'all');

const BRIDAL_COLLECTION_OPTIONS = [
  { value: '', label: 'None (Standard Product)' },
  { value: 'Malayali Manga', label: 'Malayali Manga' },
  { value: 'Kerala Bridal Collection', label: 'Kerala Bridal Collection' },
  { value: 'Antique Bridal Collection', label: 'Antique Bridal Collection' },
  { value: 'Trending Bridal Collection', label: 'Trending Bridal Collection' },
  { value: 'Budget Friendly Collection', label: 'Budget Friendly Collection' },
  { value: 'Premium Sets Collection', label: 'Premium Sets Collection' }
];

const INITIAL_FORM = {
  name: '',
  category: CATEGORY_OPTIONS[0]?.[1] || 'Necklaces',
  bridal_collection: '',
  price: '',
  sale_price: '',
  sku: '',
  stock: '10',
  description: '',
  search_keywords: '',
  is_active: true
};

const generateImageFileName = (productName, originalFileName) => {
  const ext = originalFileName.substring(originalFileName.lastIndexOf('.')).toLowerCase() || '.jpg';
  const cleanTitle = (productName || 'product')
    .slice(0, 24)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  return `vyram_${cleanTitle}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}${ext}`;
};

const AdminProductsPage = () => {
  const { products, createProduct, fetchProducts } = useProductCatalog();

  // Form State
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Status & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [createdProduct, setCreatedProduct] = useState(null);

  const fileInputRef = useRef(null);

  // Check whether all required fields are filled for enabling the submit button
  const isFormValid = useMemo(() => {
    const hasName = formState.name.trim().length > 0;
    const hasCategory = Boolean(formState.category);
    const parsedPrice = Number(formState.price);
    const hasValidPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;
    const hasImage = Boolean(selectedFile);
    return hasName && hasCategory && hasValidPrice && hasImage;
  }, [formState.name, formState.category, formState.price, selectedFile]);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFieldErrors((prev) => ({ ...prev, image: 'Please select a valid image (PNG, JPG, WEBP).' }));
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, image: 'Image size must be less than 15MB.' }));
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, image: null }));
    setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmitting) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isSubmitting) return;

    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerFileInput = () => {
    if (!isSubmitting && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formState.name.trim();
    const parsedPrice = Number(formState.price);
    const parsedStock = Number(formState.stock);

    if (!trimmedName) {
      errors.name = 'Product name is required.';
    }

    if (!formState.category) {
      errors.category = 'Please select a category.';
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be a valid number greater than 0.';
    }

    if (formState.sale_price) {
      const parsedSale = Number(formState.sale_price);
      if (!Number.isFinite(parsedSale) || parsedSale <= 0) {
        errors.sale_price = 'Sale price must be greater than 0.';
      } else if (parsedSale >= parsedPrice) {
        errors.sale_price = 'Sale price should be lower than original price.';
      }
    }

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      errors.stock = 'Stock units must be 0 or greater.';
    }

    const trimmedSku = formState.sku.trim();
    if (trimmedSku && products.some((p) => String(p.id).toLowerCase() === trimmedSku.toLowerCase())) {
      errors.sku = 'This SKU / Product ID is already in use. Please enter a unique ID.';
    }

    if (!selectedFile) {
      errors.image = 'Product image is required. Please upload an image.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      values: {
        id: trimmedSku || undefined,
        name: trimmedName,
        category: formState.category,
        bridal_collection: formState.bridal_collection || null,
        price: parsedPrice,
        sale_price: formState.sale_price ? Number(formState.sale_price) : null,
        stock: Math.floor(parsedStock),
        description:
          formState.description.trim() ||
          `Exquisite handcrafted ${trimmedName}, designed with timeless artistry for elegance and celebration.`,
        search_keywords: formState.search_keywords.trim(),
        is_active: formState.is_active
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError('');
    setCreatedProduct(null);

    const { isValid, errors, values } = validateForm();
    setFieldErrors(errors);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Obtain ImageKit upload authorization tokens securely from Neon PostgreSQL
      const authData = await getImageKitAuthFromDB();
      const uniqueFileName = generateImageFileName(values.name, selectedFile.name);

      // 2. Upload file directly to ImageKit CDN
      const uploadResult = await uploadFileToImageKit(
        selectedFile,
        uniqueFileName,
        authData,
        '/vyram-jewells/products'
      );

      // 3. Assemble complete product payload with real ImageKit CDN URL and identifiers
      const payload = {
        ...values,
        image_url: uploadResult.url,
        image: uploadResult.url,
        image_file_id: uploadResult.fileId || null,
        image_path: uploadResult.filePath || null
      };

      // 4. Insert product record into Neon PostgreSQL
      const saved = await createProduct(payload);

      // Refresh catalog cache
      if (typeof fetchProducts === 'function') {
        fetchProducts().catch(console.error);
      }

      // 5. Success state and clean reset
      setCreatedProduct(saved);
      setFormState(INITIAL_FORM);
      setSelectedFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFieldErrors({});
    } catch (err) {
      console.error('Failed to add product:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to upload product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setCreatedProduct(null);
    setFormState(INITIAL_FORM);
    handleRemoveImage();
  };

  return (
    <div className="admin-product-add-wrapper">
      {/* Page Header */}
      <div className="admin-page-intro">
        <div className="admin-page-tag">Product Management</div>
        <h1 className="admin-page-title">Add New Product</h1>
        <p className="admin-page-desc">
          Upload fine jewelry imagery and publish handcrafted pieces directly to the Vyram live catalog.
        </p>
      </div>

      {/* Success Banner */}
      {createdProduct && (
        <div className="admin-success-card" role="alert">
          <div className="admin-success-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="admin-success-body">
            <h3>Product Published Successfully!</h3>
            <p>
              <strong>{createdProduct.name}</strong> ({formatPrice(createdProduct.price)}) has been securely uploaded to
              ImageKit and saved to the live database.
            </p>
            <div className="admin-success-meta">
              <div className="admin-success-thumb">
                <img
                  src={getThumbnailImage(createdProduct.image_url || createdProduct.image)}
                  alt={createdProduct.name}
                />
              </div>
              <div className="admin-success-details">
                <span className="admin-success-badge">{createdProduct.category}</span>
                {createdProduct.bridal_collection && (
                  <span className="admin-success-badge gold">{createdProduct.bridal_collection}</span>
                )}
                <span className="admin-success-sku">SKU: {createdProduct.id}</span>
              </div>
            </div>
          </div>
          <div className="admin-success-actions">
            <button type="button" className="admin-btn-secondary" onClick={handleResetSuccess}>
              <i className="fa-solid fa-plus"></i> Add Another Product
            </button>
            <Link to="/" target="_blank" rel="noreferrer" className="admin-btn-primary">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> View on Store
            </Link>
          </div>
        </div>
      )}

      {/* Global Form Error Banner */}
      {formError && (
        <div className="admin-alert-error" role="alert">
          <i className="fa-solid fa-triangle-exclamation"></i>
          <div>
            <strong>Upload Error:</strong> {formError}
          </div>
        </div>
      )}

      {/* Product Add Form */}
      <form className="admin-add-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-form-columns">
          {/* Left Column: Image Upload & Status */}
          <div className="admin-form-col-left">
            {/* Image Upload Card */}
            <div className="admin-card-section">
              <div className="admin-card-header-clean">
                <h2>Upload Product Image *</h2>
                <span className="admin-hint-tag">Direct ImageKit CDN</span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                id="product-image-file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{ display: 'none' }}
              />

              {!imagePreview ? (
                /* Dropzone State */
                <div
                  className={`admin-dropzone ${isDragOver ? 'drag-over' : ''} ${fieldErrors.image ? 'has-error' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleTriggerFileInput}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTriggerFileInput()}
                  aria-label="Upload Product Image: Drag and drop or click to upload"
                >
                  <div className="admin-dropzone-icon">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <div className="admin-dropzone-title">Upload Product Image</div>
                  <div className="admin-dropzone-subtitle">Drag & drop or click to upload</div>
                  <div className="admin-dropzone-note">Supports PNG, JPG, or WEBP up to 15MB</div>
                </div>
              ) : (
                /* Selected Preview State */
                <div className="admin-preview-container">
                  <div className="admin-preview-image-wrap">
                    <img src={imagePreview} alt="Selected Product Preview" className="admin-preview-img" />
                    {isSubmitting && (
                      <div className="admin-preview-loading-overlay">
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Uploading to ImageKit...</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-preview-meta">
                    <div className="admin-preview-info">
                      <strong className="admin-preview-filename" title={selectedFile?.name}>
                        {selectedFile?.name}
                      </strong>
                      <span className="admin-preview-filesize">
                        {selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) + ' KB' : ''}
                      </span>
                    </div>

                    {!isSubmitting && (
                      <div className="admin-preview-actions">
                        <button
                          type="button"
                          className="admin-btn-secondary admin-btn-sm"
                          onClick={handleTriggerFileInput}
                          title="Select a different image"
                        >
                          <i className="fa-solid fa-arrow-rotate-right"></i> Replace
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger admin-btn-sm"
                          onClick={handleRemoveImage}
                          title="Remove image"
                        >
                          <i className="fa-solid fa-trash-can"></i> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {fieldErrors.image && <p className="admin-field-error-text">{fieldErrors.image}</p>}
            </div>

            {/* Availability & Status Card */}
            <div className="admin-card-section">
              <div className="admin-card-header-clean">
                <h2>Availability & Status</h2>
              </div>

              <div className="admin-field-group">
                <label className="admin-label">Product Visibility</label>
                <div className="admin-status-toggle-wrap">
                  <button
                    type="button"
                    className={`admin-status-pill ${formState.is_active ? 'active' : ''}`}
                    onClick={() => handleInputChange('is_active', true)}
                    disabled={isSubmitting}
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>Active (Visible on Storefront)</span>
                  </button>
                  <button
                    type="button"
                    className={`admin-status-pill inactive ${!formState.is_active ? 'active' : ''}`}
                    onClick={() => handleInputChange('is_active', false)}
                    disabled={isSubmitting}
                  >
                    <i className="fa-solid fa-eye-slash"></i>
                    <span>Draft / Inactive (Hidden)</span>
                  </button>
                </div>
              </div>

              <div className="admin-field-group" style={{ marginTop: '16px' }}>
                <label htmlFor="product-stock" className="admin-label">
                  Stock Units
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  className="admin-input"
                  value={formState.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  disabled={isSubmitting}
                  placeholder="10"
                />
                {fieldErrors.stock && <p className="admin-field-error-text">{fieldErrors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Product Information Fields */}
          <div className="admin-form-col-right">
            <div className="admin-card-section">
              <div className="admin-card-header-clean">
                <h2>Product Details</h2>
                <span className="admin-required-hint">* Required fields</span>
              </div>

              {/* Product Name */}
              <div className="admin-field-group">
                <label htmlFor="product-name" className="admin-label">
                  Product Name *
                </label>
                <input
                  id="product-name"
                  type="text"
                  required
                  className={`admin-input ${fieldErrors.name ? 'input-error' : ''}`}
                  value={formState.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Royal Palakka Choker Set"
                  disabled={isSubmitting}
                />
                {fieldErrors.name && <p className="admin-field-error-text">{fieldErrors.name}</p>}
              </div>

              {/* Category & Collection Row */}
              <div className="admin-field-row">
                <div className="admin-field-group">
                  <label htmlFor="product-category" className="admin-label">
                    Category *
                  </label>
                  <select
                    id="product-category"
                    required
                    className={`admin-select ${fieldErrors.category ? 'input-error' : ''}`}
                    value={formState.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={isSubmitting}
                  >
                    {CATEGORY_OPTIONS.map(([key, label]) => (
                      <option key={key} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && <p className="admin-field-error-text">{fieldErrors.category}</p>}
                </div>

                <div className="admin-field-group">
                  <label htmlFor="product-bridal-col" className="admin-label">
                    Bridal Collection
                  </label>
                  <select
                    id="product-bridal-col"
                    className="admin-select"
                    value={formState.bridal_collection}
                    onChange={(e) => handleInputChange('bridal_collection', e.target.value)}
                    disabled={isSubmitting}
                  >
                    {BRIDAL_COLLECTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="admin-field-row">
                <div className="admin-field-group">
                  <label htmlFor="product-price" className="admin-label">
                    Price (₹ INR) *
                  </label>
                  <div className="admin-input-prefix-wrap">
                    <span className="admin-input-prefix">₹</span>
                    <input
                      id="product-price"
                      type="number"
                      min="1"
                      step="1"
                      required
                      className={`admin-input has-prefix ${fieldErrors.price ? 'input-error' : ''}`}
                      value={formState.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="2499"
                      disabled={isSubmitting}
                    />
                  </div>
                  {fieldErrors.price && <p className="admin-field-error-text">{fieldErrors.price}</p>}
                </div>

                <div className="admin-field-group">
                  <label htmlFor="product-sale-price" className="admin-label">
                    Sale Price (Optional)
                  </label>
                  <div className="admin-input-prefix-wrap">
                    <span className="admin-input-prefix">₹</span>
                    <input
                      id="product-sale-price"
                      type="number"
                      min="1"
                      step="1"
                      className={`admin-input has-prefix ${fieldErrors.sale_price ? 'input-error' : ''}`}
                      value={formState.sale_price}
                      onChange={(e) => handleInputChange('sale_price', e.target.value)}
                      placeholder="Leave empty if regular price"
                      disabled={isSubmitting}
                    />
                  </div>
                  {fieldErrors.sale_price && <p className="admin-field-error-text">{fieldErrors.sale_price}</p>}
                </div>
              </div>

              {/* SKU / Product ID */}
              <div className="admin-field-group">
                <label htmlFor="product-sku" className="admin-label">
                  SKU / Product ID <span className="admin-label-optional">(Optional)</span>
                </label>
                <input
                  id="product-sku"
                  type="text"
                  className={`admin-input ${fieldErrors.sku ? 'input-error' : ''}`}
                  value={formState.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="e.g. VYR-CH-108 (Auto-generated if left empty)"
                  disabled={isSubmitting}
                />
                <span className="admin-field-help">
                  Unique identifier used in catalog tracking. Leave blank for auto-generation.
                </span>
                {fieldErrors.sku && <p className="admin-field-error-text">{fieldErrors.sku}</p>}
              </div>

              {/* Description */}
              <div className="admin-field-group">
                <label htmlFor="product-description" className="admin-label">
                  Description
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  className="admin-textarea"
                  value={formState.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter handcrafted craftsmanship notes, motif details, gold plating standards, or bridal styling tips..."
                  disabled={isSubmitting}
                />
              </div>

              {/* Search Keywords */}
              <div className="admin-field-group">
                <label htmlFor="product-keywords" className="admin-label">
                  Search Keywords <span className="admin-label-optional">(Optional)</span>
                </label>
                <input
                  id="product-keywords"
                  type="text"
                  className="admin-input"
                  value={formState.search_keywords}
                  onChange={(e) => handleInputChange('search_keywords', e.target.value)}
                  placeholder="e.g. kundan, bridal haar, gold choker, south indian wedding"
                  disabled={isSubmitting}
                />
                <span className="admin-field-help">Helps clients discover this jewelry piece in search filters.</span>
              </div>

              {/* Form Action Bar */}
              <div className="admin-form-submit-bar">
                <button
                  type="submit"
                  className="admin-submit-btn"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Uploading to ImageKit & Saving...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-gem"></i>
                      <span>Add Product to Collection</span>
                    </>
                  )}
                </button>

                {!isFormValid && !isSubmitting && (
                  <p className="admin-submit-helper">
                    {!formState.name.trim()
                      ? 'Please enter a product name.'
                      : !formState.price
                      ? 'Please enter a valid price.'
                      : !selectedFile
                      ? 'Please upload a product image to proceed.'
                      : 'Please complete all required fields.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductsPage;
