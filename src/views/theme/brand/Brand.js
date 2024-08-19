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
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrand,
  deleteBrand,
  fetchBrand,
  fetchBrandForID,
  updateBrand,
} from "src/api/useApi";

const Brand = () => {
  const [state, setState] = useState({
    Brand: [],
    modalVisible: false,
    logo: null,
    deletebrandId: null,
    searchQuery: "",
    editbrandId: null,
    filteredBrand: [],
    brandData: {},
    currentPage: 1,
    deleteModalVisible: false,
  });

  const itemsPerPage = 10;

  const loadBrand = async () => {
    const [Brand] = await Promise.all([fetchBrand()]);
    setState((prevState) => ({
      ...prevState,
      Brand,
      filteredBrand: Brand,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadBrand();
  }, []);

  const handleModalOpen = async (formId = null) => {
    console.log("asddasdasad");
    if (formId) {
      const data = await fetchBrandForID(formId);
      setState((prevState) => ({
        ...prevState,
        brandData: data,
        editbrandId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        brandData: {
          isActive: true,
          name: "",
          logo: "",
          targetUrl: "",
          orderNumber: 0,
          showOnBrands: true,
        },
        editbrandId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editbrandId, brandData } = state;

    if (editbrandId) {
      console.log("here1", editbrandId, brandData);
      await updateBrand(editbrandId, brandData);
      toast.success("Brand başarıyla güncellendi.");
    } else {
      console.log("here2", editbrandId, brandData);
      await createBrand(brandData);
      toast.success("Brand başarıyla oluşturuldu.");
    }

    loadBrand();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setState((prevState) => ({
          ...prevState,
          brandData: { ...prevState.brandData, logo: reader.result },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterBrand = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.Brand.filter((item) => {
        const label = item.label ? item.label.toLowerCase() : "";

        return [label].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredBrand: filteredData,
      }));
    };

    filterBrand();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBrand.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (brandId, currentStatus) => {
    console.log("here10");
    const updatedBrand = {
      ...state.Brand.find((item) => item.brandId === brandId),
      isActive: !currentStatus,
    };

    await updateBrand(brandId, updatedBrand);

    toast.success("Brand durumu başarıyla güncellendi.");

    const updatedBrandList = await fetchBrand();

    setState((prevState) => ({
      ...prevState,
      Brand: updatedBrandList,
      filteredBrand: updatedBrandList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deletebrandId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteBrand(state.deletebrandId);
    toast.success("Brand başarıyla silindi!");
    const updatedBrand = await fetchBrand();
    setState((prevState) => ({
      ...prevState,
      Brand: updatedBrand,
      filteredBrand: updatedBrand,
      deleteModalVisible: false,
      deletebrandId: null,
    }));
  };

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Ana Başlık Ekle
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
            {["İsim", "Anasayfada Göster", "Logo", "Eylemler"].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.brandId}>
              {["name", "showOnBrands"].map((key) => (
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  key={key}
                >
                  {key === "showOnBrands" ? (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        backgroundColor: item[key] ? "#d4edda" : "#f8d7da",
                        color: item[key] ? "#155724" : "#721c24",
                        border: `1px solid ${item[key] ? "#c3e6cb" : "#f5c6cb"}`,
                      }}
                    >
                      {item[key] ? "Aktif" : "Pasif"}
                    </div>
                  ) : (
                    item[key]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <img
                  src={`http://10.10.3.181:5244/${item.logoUrl}`}
                  alt="Mobil Resim"
                  style={{
                    width: "50px",
                    Height: "auto",
                  }}
                />
              </CTableDataCell>

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className="me-2"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleToggleActive(item.brandId, item.isActive)
                  }
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
                    handleModalOpen(item.brandId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(item.brandId)}
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
          { length: Math.ceil(state.filteredBrand.length / itemsPerPage) },
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
            {state.editbrandId ? "Ana Başlık Düzenle" : "Yeni Ana Başlık Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Kanal İsmi"
              value={state.brandData.name}
              onChange={(e) =>
                setState({
                  ...state,
                  brandData: { ...state.brandData, name: e.target.value },
                })
              }
            />
            {state.brandData.logo && (
              <div className="mb-3">
                <label>Mevcut Logo</label>
                <img
                  src={
                    state.brandData.logo.startsWith("data:image")
                      ? state.brandData.logo
                      : `http://10.10.3.181:5244/${state.brandData.logo}`
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

            <CFormInput
              type="file"
              className="mb-3"
              label="Logo Yükle"
              onChange={handleFileChange}
            />

            <CFormSwitch
              id="showOnBrands"
              label={`Anasayfada Göster:  ${state.brandData.showOnBrands ? "Aktif" : "Pasif"}`}
              checked={state.brandData.showOnBrands}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  brandData: {
                    ...prevState.brandData,
                    showOnBrands: e.target.checked,
                  },
                }))
              }
            />

            {state.editbrandId === null && (
              <CFormSwitch
                id="isActive"
                label={`Durum: ${state.brandData.isActive ? "Aktif" : "Pasif"}`}
                checked={state.brandData.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    brandData: {
                      ...prevState.brandData,
                      isActive: e.target.checked,
                    },
                  }))
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
            {state.editbrandId ? "Güncelle" : "Kaydet"}
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
            deletebrandId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu Ana Başlıkı silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deletebrandId: null,
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
    </div>
  );
};

export default Brand;
