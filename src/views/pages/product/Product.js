import React, { useEffect, useState, useRef } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from "@coreui/icons";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createProduct,
  fetchProduct,
  fetchProductForID,
  deleteProduct,
  updateProduct,
  fetchBrand,
  fetchCategory,
  fetchSubCategory,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

function Product() {
  const [state, setState] = useState({
    product: [],
    categories: [],
    subCategories: [],
    brands: [],
    modalVisible: false,
    searchQuery: "",
    deleteModalVisible: null,
    filteredProduct: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  const loadProduct = async () => {
    const [product, brands, categories] = await Promise.all([
      fetchProduct(),
      fetchBrand(),
      fetchCategory(),
    ]);
    setState((prevState) => ({
      ...prevState,
      brands,
      categories,
      product,
      filteredProduct: product,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadProduct();
  }, []);

  useEffect(() => {
    if (state.product?.categoryId) {
      fetchSubCategory(state.product?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.product?.categoryId]);

  const handleModalOpen = async (productId = null) => {
    if (productId) {
      const data = await fetchProductForID(productId);
      setState((prevState) => ({
        ...prevState,
        product: data,
        modalVisible: true,
      }));
      console.log(data);
    } else {
      setState((prevState) => ({
        ...prevState,
        product: [],
        productId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { product } = state;

    console.log(product);

    if (product?.productId) {
      await updateProduct(product.productId, product);
      toast.success("Product başarıyla güncellendi.");
    } else {
      await createProduct(product);
      toast.success("Product başarıyla oluşturuldu.");
    }

    loadProduct();
  };

  useEffect(() => {
    const filterProduct = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.product.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";

        return [name].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredProduct: filteredData,
      }));
    };

    filterProduct();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredProduct.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (product) => {
    await updateProduct(product.productId, product);
    toast.success("Özellik durumu başarıyla güncellendi.");
    loadProduct();
  };

  const handleDeleteClick = (productId) => {
    setState((prevState) => ({
      ...prevState,
      productId: productId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteProduct(state.productId);
    toast.success("Özellik başarıyla silindi!");

    const updatedProduct = await fetchProduct();
    setState((prevState) => ({
      ...prevState,
      product: updatedProduct,
      filteredProduct: updatedProduct,
      deleteModalVisible: false,
      productId: null,
    }));
  };

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Özellik Ekle
      </CButton>
      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={state.searchQuery}
        onChange={(e) =>
          setState((prevState) => ({
            ...prevState,
            searchQuery: e.target.value,
          }))
        }
      />

      <CModal
        className="modal-xl"
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.product?.productId ? "Özellik Düzenle" : "Yeni Özellik Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Ürün Adı", value: "name", md: 6 },
                { label: "Marka", value: "brandName", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.product?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        product: {
                          ...prevState.product,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[
                { label: "Model", value: "model", md: 6 },
                { label: "Barkod", value: "barcode", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.product?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        product: {
                          ...prevState.product,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>

            <CRow>
              <CCol>
                <CFormSelect
                  label="Marka"
                  className="mb-3"
                  aria-label="Select brand"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      brands: {
                        ...prevState.brands,
                        brandId: e.target.value,
                      },
                    }));
                  }}
                  value={state.brands?.brandId}
                >
                  <option value="">Marka Seçiniz</option>
                  {state.brands.map((brands) => (
                    <option key={brands.brandId} value={brands.brandId}>
                      {brands.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CFormSelect
                  label="Kategori"
                  className="mb-3"
                  aria-label="Select category"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      product: {
                        ...prevState.product,
                        categoryId: e.target.value,
                        subCategoryId: "",
                      },
                    }));
                  }}
                  value={state.product?.categoryId}
                >
                  <option value="">Kategori Seçiniz</option>
                  {state.categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  label="Alt Kategori"
                  className="mb-3"
                  aria-label="Select subcategory"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      product: {
                        ...prevState.product,
                        subCategoryId: e.target.value,
                      },
                    }));
                  }}
                  value={state.product?.subCategoryId}
                  disabled={!state.product?.categoryId}
                >
                  <option value="">Alt Kategori Seçiniz</option>
                  {state.subCategories.map((subCategory) => (
                    <option
                      key={subCategory.subCategoryId}
                      value={subCategory.subCategoryId}
                    >
                      {subCategory.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
          >
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            {state.product?.productId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Barkod", value: "barcode" },
              { label: "Model", value: "model" },
              { label: "İsim", value: "name" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value, isImage, isStatus }) => (
              <CTableHeaderCell
                key={value}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((product) => (
            <CTableRow key={product.productId}>
              {[
                { value: "barcode", isImage: false, isStatus: false },
                { value: "model", isImage: false, isStatus: false },
                { value: "name", isImage: false, isStatus: false },
              ].map(({ value }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {value}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${product.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleToggleActive(product)}
                >
                  {product.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(product.productId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(product.productId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="btn btn-sm">
        {Array.from(
          { length: Math.ceil(state.filteredProduct.length / itemsPerPage) },
          (_, i) => (
            <CPaginationItem
              key={i + 1}
              active={i + 1 === state.currentPage}
              onClick={() =>
                setState((prevState) => ({ ...prevState, currentPage: i + 1 }))
              }
            >
              {i + 1}
            </CPaginationItem>
          )
        )}
      </CPagination>

      <CModal
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            productId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu Özelliği silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                productId: null,
              }))
            }
          >
            İptal
          </CButton>
          <CButton color="danger text-white" onClick={confirmDelete}>
            Sil
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Product;
