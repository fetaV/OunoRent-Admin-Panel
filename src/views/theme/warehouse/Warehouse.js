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
  createWarehouse,
  deleteWarehouse,
  fetchWarehouse,
  fetchWarehouseForID,
  updateWarehouse,
} from "src/api/useApi";

const Warehouse = () => {
  const [state, setState] = useState({
    warehouse: [],
    warehouseData: [],
    name: "",
    logoWarehouseId: 0,
    warehouseId: null,
    modalVisible: false,
    isActive: false,
    searchQuery: "",
    filteredWarehouse: [],
    currentPage: 1,
    deleteWarehouseId: null,
  });
  const itemsPerPage = 10;

  const loadWarehouse = async () => {
    const [warehouse] = await Promise.all([fetchWarehouse()]);
    setState((prevState) => ({
      ...prevState,
      warehouse: warehouse,
      filteredWarehouse: warehouse,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadWarehouse();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchWarehouseForID(formId);
      setState((prevState) => ({
        ...prevState,
        warehouseData: {
          ...data,
        },
        warehouseId: formId,
        modalVisible: true,
        isActive: data.isActive,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        name: "",
        logoWarehouseId: "",
        isActive: false,
        warehouseId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { warehouseId, warehouseData } = state;

    if (warehouseId) {
      await updateWarehouse(warehouseId, warehouseData);

      toast.success("Warehouse başarıyla güncellendi.");
    } else {
      await createWarehouse(warehouseData);
      toast.success("Warehouse başarıyla oluşturuldu.");
    }

    loadWarehouse();
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredWarehouse.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (warehouseId, currentStatus) => {
    const warehouseUpdate = state.warehouse.find(
      (item) => item.warehouseId === warehouseId
    );

    const updatedWarehouse = {
      ...warehouseUpdate,
      isActive: !currentStatus,
      logoWarehouseId: warehouseUpdate.logoWarehouseId,
    };

    await updateWarehouse(warehouseId, updatedWarehouse);

    toast.success("Warehouse durumu başarıyla güncellendi.");

    const updatedWarehouseList = await fetchWarehouse();

    setState((prevState) => ({
      ...prevState,
      warehouse: updatedWarehouseList,
      filteredWarehouse: updatedWarehouseList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deleteWarehouseId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteWarehouse(state.deleteWarehouseId);
    toast.success("Depo başarıyla silindi!");
    const updatedWarehouse = await fetchWarehouse();
    setState((prevState) => ({
      ...prevState,
      warehouse: updatedWarehouse,
      filteredWarehouse: updatedWarehouse,
      deleteModalVisible: false,
      deleteWarehouseId: null,
    }));
  };

  useEffect(() => {
    const filterWarehouse = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.warehouse.filter((item) =>
        [item.name]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredWarehouse: filteredData,
      }));
    };

    filterWarehouse();
  }, [state.searchQuery, state.warehouse]);

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Depo Ekle
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
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.warehouseId ? "Warehouse Düzenle" : "Yeni Warehouse Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Depo Adı"
              value={state.warehouseData.name}
              onChange={(e) =>
                setState(() => ({
                  ...state,
                  warehouseData: {
                    ...state.warehouseData,
                    name: e.target.value,
                  },
                }))
              }
            />
            <CFormInput
              type="number"
              id="exampleFormControlInput2"
              label="Logo Depo ID"
              value={state.warehouseData.logoWarehouseId}
              onChange={(e) =>
                setState(() => ({
                  ...state,
                  warehouseData: {
                    ...state.warehouseData,
                    logoWarehouseId: e.target.value,
                  },
                }))
              }
            />
            {state.warehouseId === null && (
              <CFormSwitch
                label="Aktif"
                id="isActive"
                className="mb-3"
                checked={state.warehouseData.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    isActive: e.target.checked,
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
            {state.warehouseId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Depo Adı", value: "name" },
              { label: "Logo Depo ID", value: "logoWarehouseId" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value, isStatus }) => (
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
          {currentItems.map((warehouse) => (
            <CTableRow key={warehouse.warehouseId}>
              {[
                {
                  value: "name",
                  isImage: false,
                  isStatus: false,
                },
                {
                  value: "logoWarehouseId",
                  isImage: false,
                  isStatus: false,
                },
              ].map(({ value, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {warehouse[value]}
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
                    backgroundColor: warehouse.isActive ? "#d4edda" : "#f8d7da",
                    color: warehouse.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${warehouse.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleToggleActive(
                      warehouse.warehouseId,
                      warehouse.isActive
                    )
                  }
                >
                  {warehouse.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(warehouse.warehouseId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(warehouse.warehouseId)}
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
            length: Math.ceil(state.filteredWarehouse.length / itemsPerPage),
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

export default Warehouse;
