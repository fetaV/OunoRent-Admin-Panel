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
} from "@coreui/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSubCategory,
  fetchSubCategory,
  fetchSubCategoryForID,
  deleteSubCategory,
  updateSubCategory,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

export const SubCategories = ({ data }) => {
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
    deleteSubCategoryId: null,
    deleteCategoryId: null,
  });
  const fileInputRef3 = useRef(null);

  const handleToggleActive = async (item) => {
    item.isActive = !item.isActive;

    await updateSubCategory(item.categoryId, item.subCategoryId, item);

    toast.success("Category durumu başarıyla güncellendi.");

    const updatedSubCategoryList = await fetchSubCategory(item.categoryId);
    console.log(updatedSubCategoryList);

    setState((prevState) => ({
      ...prevState,
      subCategories: updatedSubCategoryList,
      filteredSubCategories: updatedSubCategoryList,
    }));
  };
  const handleModalOpen = async (categoryId, subCategoryId) => {
    if (categoryId && subCategoryId) {
      const item = await fetchSubCategoryForID(categoryId, subCategoryId);
      setState((prevState) => ({
        ...prevState,
        subCategoriesData: {
          ...item,
          categoryId,
          subCategoryId,
        },
        modalVisible: true,
      }));
    } else if (data.length) {
      setState((prevState) => ({
        ...prevState,
        subCategoriesData: {
          name: "",
          description: "",
          icon: "",
          orderNumber: 0,
          isActive: false,
          categoryId: null,
          subCategoryId: null,
        },
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { subCategoriesData } = state;
    const { subCategoryId } = subCategoriesData;

    if (subCategoryId) {
      setState((prevState) => ({
        ...prevState,
        subCategoriesData: {
          ...subCategoriesData,
          iconUrl: undefined,
        },
        modalVisible: false,
      }));
      await updateSubCategory(
        data[0].categoryId,
        subCategoryId,
        subCategoriesData
      );
      toast.success("Alt kategori başarıyla güncellendi.");
    } else {
      await createSubCategory(data[0].categoryId, subCategoriesData);
      toast.success("Alt kategori başarıyla oluşturuldu.");
    }
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "icon") {
          setState((prevState) => ({
            ...prevState,
            categoriesData: {
              ...prevState.subCategoriesData,
              icon: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (item) => {
    setState((prevState) => ({
      ...prevState,
      deleteSubCategoryId: item.subCategoryId,
      deleteCategoryId: item.categoryId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteSubCategory(state.deleteCategoryId, state.deleteSubCategoryId);
    toast.success("Category başarıyla silindi!");
    const updatedSubCategory = await fetchSubCategory(state.deleteCategoryId);
    setState((prevState) => ({
      ...prevState,
      subCategories: updatedSubCategory,
      filteredSubCategories: updatedSubCategory,
      deleteModalVisible: false,
      deleteSubCategoryId: null,
      deleteCategoryId: null,
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
        Yeni Alt Kategori Ekle
      </CButton>
      {data.length ? (
        <CTable>
          <CTableHead>
            <CTableRow>
              {[
                { label: "Alt Kategori Adı", value: "name" },
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
            {data.map((item) => (
              <CTableRow
                style={{ textAlign: "center", verticalAlign: "middle" }}
                key={item.subCategoryId}
              >
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>{item.orderNumber}</CTableDataCell>
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <CButton
                    className={`text-white me-2 ${item.isActive ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleToggleActive(item)}
                  >
                    {item.isActive ? (
                      <CIcon icon={cilCheckCircle} />
                    ) : (
                      <CIcon icon={cilXCircle} />
                    )}
                  </CButton>
                  <CButton
                    color="primary text-white"
                    className="me-2"
                    onClick={() => {
                      handleModalOpen(item.categoryId, item.subCategoryId);
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger text-white"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <h3>Alt Kategori Bulunmamaktadır</h3>
      )}

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
            {state.subCategoriesData?.categoryId
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
                    value={state.subCategoriesData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        subCategoriesData: {
                          ...prevState.subCategoriesData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[{ label: "Açıklama", value: "description", md: 6 }].map(
                ({ label, value, md, type = "text" }) => (
                  <CCol key={value} md={md}>
                    <CFormInput
                      key={value}
                      className="mb-3"
                      type={type}
                      label={label}
                      value={state.subCategoriesData?.[value] || ""}
                      onChange={(e) =>
                        setState((prevState) => ({
                          ...prevState,
                          subCategoriesData: {
                            ...prevState.subCategoriesData,
                            [value]: e.target.value,
                          },
                        }))
                      }
                    />
                  </CCol>
                )
              )}
              <CCol>
                {[
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
                          state.subCategoriesData?.[key]?.startsWith(
                            "data:image"
                          )
                            ? state.subCategoriesData?.[key]
                            : state.subCategoriesData?.[`${key}Url`]
                              ? `http://10.10.3.181:5244/${state.subCategoriesData?.[`${key}Url`]}`
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
                        {state.subCategoriesData?.categoryId
                          ? "Güncelle"
                          : "Kaydet"}
                      </button>
                    </div>
                  </div>
                ))}
              </CCol>
            </CRow>

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
          <CButton color="primary" onClick={() => handleSave()}>
            {state.subCategoriesData?.categoryId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteSubCategoryId: null,
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
                deleteSubCategoryId: null,
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
};
