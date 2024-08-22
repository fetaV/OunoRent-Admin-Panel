import React, { useEffect, useState } from "react";
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
  CPagination,
  CPaginationItem,
  CFormSwitch,
  CFormSelect,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createFeaturedCategory,
  deleteFeaturedCategory,
  fetchFeaturedCategory,
  fetchFeaturedCategoryForID,
  updateFeaturedCategory,
  fetchCategory,
} from "src/api/useApi";

const FeaturedCategory = () => {
  const [state, setState] = useState({
    featuredCategory: [],
    modalVisible: false,
    orderNumber: 0,
    category: [],
    deletefeaturedCategoryId: null,
    searchQuery: "",
    editfeaturedCategoryId: null,
    filteredFeaturedCategory: [],
    featuredCategoryData: [],
    currentPage: 1,
    deleteModalVisible: false,
  });

  const itemsPerPage = 10;

  const loadFeaturedCategory = async () => {
    const [featuredCategory] = await Promise.all([fetchFeaturedCategory()]);
    const [category] = await Promise.all([fetchCategory()]);
    setState((prevState) => ({
      ...prevState,
      featuredCategory,
      category,
      filteredFeaturedCategory: featuredCategory,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadFeaturedCategory();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchFeaturedCategoryForID(formId);
      setState((prevState) => ({
        ...prevState,
        featuredCategoryData: {
          ...data,
          categoryId: data.getCategoryResponse?.categoryId,
        },
        editfeaturedCategoryId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        featuredCategoryData: {
          isActive: true,
          name: "",
          logo: "",
          categoryId: "",
        },
        editfeaturedCategoryId: null,
        modalVisible: true,
      }));
    }
  };

  useEffect(() => {
    const filterFeaturedCategory = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.featuredCategory.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";

        return [name].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredFeaturedCategory: filteredData,
      }));
    };

    filterFeaturedCategory();
  }, [state.searchQuery]);

  const handleSave = async () => {
    const { editfeaturedCategoryId, featuredCategoryData } = state;

    if (editfeaturedCategoryId) {
      console.log("here1", editfeaturedCategoryId, featuredCategoryData);
      await updateFeaturedCategory(
        editfeaturedCategoryId,
        featuredCategoryData
      );
      toast.success("FeaturedCategory başarıyla güncellendi.");
    } else {
      console.log("here2", editfeaturedCategoryId, featuredCategoryData);
      await createFeaturedCategory(featuredCategoryData);
      toast.success("FeaturedCategory başarıyla oluşturuldu.");
    }

    loadFeaturedCategory();
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredFeaturedCategory.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (featuredCategoryId, currentStatus) => {
    const categoryToUpdate = state.featuredCategory.find(
      (item) => item.featuredCategoryId === featuredCategoryId
    );

    const updatedFeaturedCategory = {
      ...categoryToUpdate,
      isActive: !currentStatus,
      categoryId: categoryToUpdate.getCategoryResponse.categoryId,
    };

    await updateFeaturedCategory(featuredCategoryId, updatedFeaturedCategory);

    toast.success("FeaturedCategory durumu başarıyla güncellendi.");

    const updatedFeaturedCategoryList = await fetchFeaturedCategory();

    setState((prevState) => ({
      ...prevState,
      featuredCategory: updatedFeaturedCategoryList,
      filteredFeaturedCategory: updatedFeaturedCategoryList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deletefeaturedCategoryId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteFeaturedCategory(state.deletefeaturedCategoryId);
    toast.success("FeaturedCategory başarıyla silindi!");
    const updatedFeaturedCategory = await fetchFeaturedCategory();
    setState((prevState) => ({
      ...prevState,
      FeaturedCategory: updatedFeaturedCategory,
      filteredFeaturedCategory: updatedFeaturedCategory,
      deleteModalVisible: false,
      deletefeaturedCategoryId: null,
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
        Yeni Kanal Ekle
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

      <CTable>
        <CTableHead>
          <CTableRow style={{ textAlign: "center", verticalAlign: "middle" }}>
            {["Katerogi Adı", "Sıra Numarası", "Eylemler"].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((featuredCategory, index) => (
            <CTableRow key={index}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {featuredCategory.getCategoryResponse?.name}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {featuredCategory.orderNumber}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${featuredCategory.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() =>
                    handleToggleActive(
                      featuredCategory.featuredCategoryId,
                      featuredCategory.isActive
                    )
                  }
                >
                  {featuredCategory.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(featuredCategory.featuredCategoryId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() =>
                    handleDeleteClick(featuredCategory.featuredCategoryId)
                  }
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
          {
            length: Math.ceil(
              state.filteredFeaturedCategory.length / itemsPerPage
            ),
          },
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
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.editfeaturedCategoryId ? "Kanal Düzenle" : "Yeni Kanal Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              className="mb-3"
              label="Kategori Adı"
              value={state.featuredCategoryData.categoryId || ""}
              onChange={(e) =>
                setState({
                  ...state,
                  featuredCategoryData: {
                    ...state.featuredCategoryData,
                    categoryId: e.target.value,
                  },
                })
              }
            >
              <option value="">Kategori Seçin</option>
              {state.category.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </CFormSelect>

            <CFormInput
              type="text"
              className="mb-3"
              label="Sıra Numarası"
              value={state.featuredCategoryData.orderNumber}
              onChange={(e) =>
                setState({
                  ...state,
                  featuredCategoryData: {
                    ...state.featuredCategoryData,
                    orderNumber: e.target.value,
                  },
                })
              }
            />

            {state.editfeaturedCategoryId === null && (
              <CFormSwitch
                id="isActive"
                label={state.featuredCategoryData.isActive ? "Aktif" : "Pasif"}
                checked={state.featuredCategoryData.isActive}
                onChange={(e) =>
                  setState({
                    ...state,
                    featuredCategoryData: {
                      ...state.featuredCategoryData,
                      isActive: e.target.checked,
                    },
                  })
                }
              />
            )}
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
            {state.editfeaturedCategoryId ? "Güncelle" : "Kaydet"}
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
            deletefeaturedCategoryId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>Bu Kanalı silmek istediğinize emin misiniz?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deletefeaturedCategoryId: null,
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

export default FeaturedCategory;
