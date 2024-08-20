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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createCategory,
  fetchCategory,
  fetchCategoryForID,
  deleteCategory,
  updateCategory,
  fetchSubCategoryForID,
} from "src/api/useApi";
const Categories = () => {
  const [state, setState] = useState({
    categories: [],
    subCategories: [],
    searchQuery: "",
    categoriesData: {},
    subCategoriesData: {},
    filteredCategories: [],
    filteredSubCategories: [],
    modalVisible: false,
    currentPage: 1,
  });
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);

  const itemsPerPage = 10;

  const loadCategories = async () => {
    const [categories] = await Promise.all([fetchCategory()]);
    setState((prevState) => ({
      ...prevState,
      categories,
      filteredCategories: categories,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleModalOpen = async (categoryId = null) => {
    if (categoryId) {
      const data = await fetchCategoryForID(categoryId);
      setState((prevState) => ({
        ...prevState,
        categoriesData: data,
        categoryId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        categoriesData: {
          name: "",
          description: "",
          icon: "",
          orderNumber: 0,
          isActive: true,
          imageHorizontal: "",
          imageSquare: "",
        },
        categoryId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { categoryId, categoriesData } = state;

    if (categoryId) {
      setState((prevState) => ({
        ...prevState,
        categoriesData: {
          ...categoriesData,
          smallImageUrl: undefined,
          largeImageUrl: undefined,
        },
      }));

      await updateBlog(categoryId, categoriesData);
      toast.success("category başarıyla güncellendi.");
    } else {
      console.log("111111");
      await createCategory(categoriesData);
      toast.success("category başarıyla oluşturuldu.");
    }

    loadCategories();
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "small") {
          setState((prevState) => ({
            ...prevState,
            categoriesData: {
              ...prevState.categoriesData,
              imageSquare: reader.result,
            },
          }));
        } else if (id === "large") {
          setState((prevState) => ({
            ...prevState,
            categoriesData: {
              ...prevState.categoriesData,
              imageHorizontal: reader.result,
            },
          }));
        } else if (id === "icon") {
          setState((prevState) => ({
            ...prevState,
            categoriesData: {
              ...prevState.categoriesData,
              imageHorizontal: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const downloadExcel = async () => {
    try {
      const response = await fetch(
        "http://10.10.3.181:5244/api/Category/exportCategories",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Categories.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to download file:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while downloading file:", error);
    }
  };

  useEffect(() => {
    const filteredCategories = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.categories.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";

        return [name].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredCategories: filteredData,
      }));
    };

    filteredCategories();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredCategories.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (categoryId, currentStatus) => {
    const updatedCategory = {
      ...state.categories.find((item) => item.categoryId === categoryId),
      isActive: !currentStatus,
    };
    console.log(
      state.categories.find((item) => item.categoryId === categoryId)
    );

    await updateCategory(categoryId, updatedCategory);

    toast.success("Kategori durumu başarıyla güncellendi.");

    const updatedCategoryList = await fetchCategory();

    setState((prevState) => ({
      ...prevState,
      categories: prevState.categories.map((item) =>
        item.categoryId === categoryId ? updatedCategory : item
      ),
      filteredCategories: prevState.filteredCategories.map((item) =>
        item.categoryId === categoryId ? updatedCategory : item
      ),
    }));
  };

  return (
    <>
      <ToastContainer />

      <div className="d-flex justify-content-between w-100 mb-3">
        <CButton
          color="primary"
          className="mb-3"
          onClick={() => handleModalOpen()}
        >
          Yeni Kategori Ekle
        </CButton>
        <CButton color="success text-white" onClick={downloadExcel}>
          Excel İndir
        </CButton>
      </div>

      <h3>Kategoriler</h3>
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
            {state.categoriesData?.categoryIdId
              ? "Kategori Düzenle"
              : "Yeni Kategori Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Başlık", value: "name", md: 6 },
                { label: "Sıra Numarası", value: "orderNumber", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    value={state.categoriesData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        categoriesData: {
                          ...prevState.categoriesData,
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
                { label: "Etiketler", value: "description", md: 6 },
                { label: "Slug", value: "slug", md: 6 },
              ].map(({ label, value, md, type = "text" }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    key={value}
                    className="mb-3"
                    type={type}
                    label={label}
                    value={state.categoriesData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        categoriesData: {
                          ...prevState.categoriesData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
              {(state.categoriesData?.imageHorizontal ||
                state.categoriesData?.imageHorizontalUrl) && (
                <div className="mb-3 col-md-4">
                  <label>Mevcut Large Image</label>
                  <img
                    onClick={() => {
                      if (fileInputRef1.current) {
                        fileInputRef1.current.click();
                      }
                    }}
                    className="pt-2"
                    src={
                      state.categoriesData?.imageHorizontal?.startsWith(
                        "data:image"
                      )
                        ? state.categoriesData?.imageHorizontal
                        : `http://10.10.3.181:5244/${state.categoriesData?.imageHorizontalUrl}`
                    }
                    alt="Logo"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
              )}
              {(state.categoriesData?.imageSquare ||
                state.categoriesData?.imageSquareUrl) && (
                <div className="mb-3 col-md-4">
                  <label>Mevcut small Image</label>
                  <img
                    onClick={() => {
                      if (fileInputRef2.current) {
                        fileInputRef2.current.click();
                      }
                    }}
                    className="pt-2"
                    src={
                      state.categoriesData?.imageSquare?.startsWith(
                        "data:image"
                      )
                        ? state.categoriesData?.imageSquare
                        : `http://10.10.3.181:5244/${state.categoriesData?.imageSquareUrl}`
                    }
                    alt="Logo"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
              )}
              {(state.categoriesData?.icon ||
                state.categoriesData?.iconUrl) && (
                <div className="mb-3 col-md-4">
                  <label>Mevcut Icon Image</label>
                  <img
                    onClick={() => {
                      if (fileInputRef3.current) {
                        fileInputRef3.current.click();
                      }
                    }}
                    className="pt-2"
                    src={
                      state.categoriesData?.icon?.startsWith("data:image")
                        ? state.categoriesData?.icon
                        : `http://10.10.3.181:5244/${state.categoriesData?.iconUrl}`
                    }
                    alt="Logo"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </div>
              )}
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                {state.categoriesData?.categoryIdId === null && (
                  <CFormSwitch
                    label="Aktif"
                    id="isActive"
                    className="mb-3"
                    checked={state.categoriesData?.isActive}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        categoriesData: {
                          ...prevState.categoriesData,
                          isActive: e.target.checked,
                        },
                      }))
                    }
                  />
                )}
              </CCol>
            </CRow>
            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="large"
              ref={fileInputRef1}
            />
            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="small"
              ref={fileInputRef2}
            />
            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="icon"
              ref={fileInputRef3}
            />
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
            {state.categoryIdId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Kategori Adı", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value }) => (
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
          {currentItems.map((category) => (
            <CTableRow key={category.categoryId}>
              {[
                { value: "name", isImage: false, isStatus: false },
                { value: "orderNumber", isImage: false, isStatus: false },
              ].map(({ value, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {category[value]}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className="me-2"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: category.isActive ? "#d4edda" : "#f8d7da",
                    color: category.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${category.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleToggleActive(category.categoryId, category.isActive)
                  }
                >
                  {category.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CDropdown>
                  <CDropdownToggle color="primary">Seçenekler</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem
                      className="btn"
                      onClick={() => handleModalOpen(category.categoryId)}
                    >
                      Düzenle
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      Sil
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => handleSubCategoryEdit(category.categoryId)}
                    >
                      Alt Kategori Ekle
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => {
                        setParentCategoryId(category.categoryId);
                        setSelectedCategoryName(category.name);
                        if (
                          category.subCategories &&
                          category.subCategories.length > 0
                        ) {
                          setSelectedCategoryId(category.categoryId);
                        } else {
                          toast.info("Alt kategori verisi bulunmamaktadır");
                        }
                      }}
                    >
                      Alt Kategorileri Göster
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="btn btn-sm">
        {Array.from(
          { length: Math.ceil(state.filteredCategories.length / itemsPerPage) },
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
    </>
  );
};

export default Categories;
