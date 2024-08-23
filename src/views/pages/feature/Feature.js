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
  createFeature,
  fetchFeature,
  fetchFeatureForID,
  deleteFeature,
  updateFeature,
  fetchCategory,
  fetchSubCategory,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

function Feature() {
  const [state, setState] = useState({
    features: [],
    categories: [],
    subCategories: [],
    modalVisible: false,
    searchQuery: "",
    deleteModalVisible: null,
    filteredFeature: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  const loadFeature = async () => {
    const [features, categories] = await Promise.all([
      fetchFeature(),
      fetchCategory(),
    ]);
    setState((prevState) => ({
      ...prevState,
      categories,
      features,
      filteredFeature: features,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadFeature();
  }, []);

  useEffect(() => {
    if (state.features?.category?.categoryId) {
      fetchSubCategory(state.features?.category.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.features?.category?.categoryId]);

  const handleModalOpen = async (featureId = null) => {
    if (featureId) {
      const data = await fetchFeatureForID(featureId);
      setState((prevState) => ({
        ...prevState,
        features: data,
        modalVisible: true,
      }));
      console.log(data);
    } else {
      setState((prevState) => ({
        ...prevState,
        features: [],
        featureId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { features } = state;

    console.log(features);

    if (features?.featureId) {
      await updateFeature(features.featureId, features);
      toast.success("Feature başarıyla güncellendi.");
    } else {
      await createFeature(features);
      toast.success("Feature başarıyla oluşturuldu.");
    }

    loadFeature();
  };

  useEffect(() => {
    const filterFeature = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.features.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";

        return [name].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredFeature: filteredData,
      }));
    };

    filterFeature();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredFeature.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (feature) => {
    await updateFeature(feature.featureId, feature);
    toast.success("Özellik durumu başarıyla güncellendi.");
    loadFeature();
  };

  const handleDeleteClick = (featureId) => {
    setState((prevState) => ({
      ...prevState,
      featureId: featureId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteFeature(state.featureId);
    toast.success("Özellik başarıyla silindi!");

    const updatedFeature = await fetchFeature();
    setState((prevState) => ({
      ...prevState,
      features: updatedFeature,
      filteredFeature: updatedFeature,
      deleteModalVisible: false,
      featureId: null,
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
            {state.features?.featureId
              ? "Özellik Düzenle"
              : "Yeni Özellik Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Özellik Adı", value: "name", md: 6 },
                { label: "Özellik Tipi", value: "featureType", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.features?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        features: {
                          ...prevState.features,
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
                  label="Kategori"
                  className="mb-3"
                  aria-label="Select category"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      features: {
                        ...prevState.features,
                        category: {
                          categoryId: e.target.value,
                        },
                      },
                    }));
                  }}
                  value={state.features?.category?.categoryId}
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
                      features: {
                        ...prevState.features,
                        subCategory: {
                          subCategoryId: e.target.value,
                        },
                      },
                    }));
                  }}
                  value={state.features?.subCategory?.subCategoryId}
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
            {state.features?.featureId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Özellik Adı", value: "name" },
              { label: "Özellik Tipi", value: "featureType" },
              { label: "Kategori Adı", value: "tags" },
              { label: "Alt Kategori Adı", value: "subCategoryName" },
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
          {currentItems.map((feature) => (
            <CTableRow key={feature.featureId}>
              {[
                { value: "name", isImage: false, isStatus: false },
                { value: "featureType", isImage: false, isStatus: false },
                { value: "category.name", isImage: false, isStatus: false }, // category name
                { value: "subCategory.name", isImage: false, isStatus: false }, // subCategory name
              ].map(({ value }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {value.split(".").reduce((obj, key) => obj?.[key], feature)}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${feature.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleToggleActive(feature)}
                >
                  {feature.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(feature.featureId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(feature.featureId)}
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
          { length: Math.ceil(state.filteredFeature.length / itemsPerPage) },
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
            featureId: null,
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
                featureId: null,
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

export default Feature;
