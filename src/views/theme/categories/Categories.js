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
  createSubCategory,
  fetchSubCategory,
  fetchSubCategoryForID,
  deleteSubCategory,
  updateSubCategory,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";
import { SubCategories } from "./SubCategories";

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
    deleteModalVisible: false,
    deleteCategoryId: null,
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

  //SC
  useEffect(() => {
    if (state.categoriesData?.categoryId) {
      fetchSubCategory(state.categoriesData?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategoriesData: data,
        }));
      });
    }
  }, [state.categoriesData?.categoryId]);

  const handleTableOpen = async (categoryId) => {
    const data = await fetchSubCategory(categoryId);
    setState((prevState) => ({
      ...prevState,
      subCategoriesData: data,
    }));
  };

  const handleModalOpen = async (categoryId = null) => {
    if (categoryId) {
      const data = await fetchCategoryForID(categoryId);
      setState((prevState) => ({
        ...prevState,
        categoriesData: data,
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
          isActive: false,
          imageHorizontal: "",
          imageSquare: "",
          categoryId: null,
        },
        modalVisible: true,
      }));
    }
  };

  const handleSave = async (categoryId) => {
    const { categoriesData } = state;

    if (categoryId) {
      setState((prevState) => ({
        ...prevState,
        categoriesData: {
          ...categoriesData,
          smallImageUrl: undefined,
          largeImageUrl: undefined,
          iconUrl: undefined,
        },
      }));
      console.log("1112", categoriesData);

      await updateCategory(categoryId, categoriesData);
      toast.success("category başarıyla güncellendi.");
    } else {
      console.log("11", categoriesData);
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
              icon: reader.result,
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

    await updateCategory(categoryId, updatedCategory);

    toast.success("Category durumu başarıyla güncellendi.");

    const updatedCategoryList = await fetchCategory();

    setState((prevState) => ({
      ...prevState,
      categories: updatedCategoryList,
      filteredCategories: updatedCategoryList,
    }));
  };

  const handleDeleteClick = (categoryId) => {
    setState((prevState) => ({
      ...prevState,
      deleteCategoryId: categoryId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteCategory(state.deleteCategoryId);
    toast.success("Category başarıyla silindi!");
    const updatedCategory = await fetchCategory();
    setState((prevState) => ({
      ...prevState,
      categories: updatedCategory,
      filteredCategories: updatedCategory,
      deleteModalVisible: false,
      deleteCategoryId: null,
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
            {state.categoriesData?.categoryId
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
              {[
                {
                  key: "imageHorizontal",
                  label: "Mevcut Large Image",
                  ref: fileInputRef1,
                  defaultImage:
                    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
                },
                {
                  key: "imageSquare",
                  label: "Mevcut Small Image",
                  ref: fileInputRef2,
                  defaultImage:
                    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
                },
                {
                  key: "icon",
                  label: "Mevcut Icon Image",
                  ref: fileInputRef3,
                  defaultImage:
                    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
                },
              ].map(({ key, label, ref, defaultImage }) => (
                <div key={key} className="mb-3 col-md-4">
                  <label className="d-flex">{label}</label>
                  <div className="image-container m-1">
                    <img
                      onClick={() => {
                        if (ref.current) {
                          ref.current.click();
                        }
                      }}
                      src={
                        state.categoriesData?.[key]?.startsWith("data:image")
                          ? state.categoriesData?.[key]
                          : state.categoriesData?.[`${key}Url`]
                            ? `http://10.10.3.181:5244/${state.categoriesData?.[`${key}Url`]}`
                            : defaultImage
                      }
                      style={{ width: 200, height: "auto" }}
                      alt={label}
                    />
                    <button
                      className="edit-button"
                      onClick={() => {
                        if (ref.current) {
                          ref.current.click();
                        }
                      }}
                    >
                      {state.categoriesData?.categoryId ? "Güncelle" : "Kaydet"}
                    </button>
                  </div>
                </div>
              ))}
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
        <CModalFooter className="mt-5">
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
          >
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() => handleSave(state.categoriesData?.categoryId)}
          >
            {state.categoriesData?.categoryId ? "Güncelle" : "Kaydet"}
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
                  className={`text-white me-2 ${category.isActive ? "btn-success" : "btn-danger"}`}
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
                      onClick={() => handleDeleteClick(category.categoryId)}
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
                      onClick={() => handleTableOpen(category.categoryId)}
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

      <CModal
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteCategoryId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu Categoryu silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteCategoryId: null,
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

      <SubCategories data={state.subCategoriesData} />
    </>
  );
};

export default Categories;
