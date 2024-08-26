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
  CFormSelect,
  CPagination,
  CPaginationItem,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createWarehouseConnection,
  deleteWarehouseConnection,
  fetchWarehouseConnection,
  fetchChannel,
  fetchWarehouse,
  fetchWarehouseConnectionForID,
  updateWarehouseConnection,
} from "src/api/useApi";

function WarehouseConnection() {
  const [state, setState] = useState({
    warehouseConnection: [],
    isActive: false,
    warehouseConnectionId: null,
    deleteWarehouseConnectionId: null,
    warehouse: [],
    channel: [],
    modalVisible: false,
    warehouseConnectionData: {},
    channelId: "",
    warehouseId: "",
    searchQuery: "",
    filteredWarehouseConnection: [],
    currentPage: 1,
    deleteModalVisible: false,
  });
  const itemsPerPage = 10;

  const loadWarehouseConnection = async () => {
    const [warehouseConnections, channel, warehouse] = await Promise.all([
      fetchWarehouseConnection(),
      fetchChannel(),
      fetchWarehouse(),
    ]);
    setState((prevState) => ({
      ...prevState,
      channel,
      warehouse,
      warehouseConnection: warehouseConnections,
      filteredWarehouseConnection: warehouseConnections,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadWarehouseConnection();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchWarehouseConnectionForID(formId);
      setState((prevState) => ({
        ...prevState,
        warehouseConnectionId: formId,
        channelId: data.channelId,
        warehouseId: data.warehouseId,
        isActive: data.isActive,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        warehouseConnectionId: null,
        channelId: "",
        warehouseId: "",
        isActive: false,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { warehouseConnectionId, channelId, warehouseId, isActive } = state;

    const warehouseConnectionData = {
      warehouseConnectionId,
      channelId,
      warehouseId,
      isActive,
    };

    try {
      if (warehouseConnectionId) {
        await updateWarehouseConnection(
          warehouseConnectionId,
          warehouseConnectionData
        );
        toast.success("WarehouseConnection başarıyla güncellendi.");
      } else {
        await createWarehouseConnection(warehouseConnectionData);
        toast.success("WarehouseConnection başarıyla oluşturuldu.");
      }
      loadWarehouseConnection();
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    const filterWarehouseConnection = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.warehouseConnection.filter((item) =>
        [item.WarehouseConnectionName, item.warehouseName]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredWarehouseConnection: filteredData,
      }));
    };

    filterWarehouseConnection();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredWarehouseConnection.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (warehouseConnectionId, currentStatus) => {
    const warehouseConnectionUpdate = state.warehouseConnection.find(
      (item) => item.warehouseConnectionId === warehouseConnectionId
    );

    const updatedWarehouseConnection = {
      ...warehouseConnectionUpdate,
      isActive: !currentStatus,
      channelId: warehouseConnectionUpdate.channelId,
      warehouseId: warehouseConnectionUpdate.warehouseId,
    };

    await updateWarehouseConnection(
      warehouseConnectionId,
      updatedWarehouseConnection
    );

    toast.success("WarehouseConnection durumu başarıyla güncellendi.");

    const updatedWarehouseConnectionList = await fetchWarehouseConnection();

    setState((prevState) => ({
      ...prevState,
      warehouseConnection: updatedWarehouseConnectionList,
      filteredWarehouseConnection: updatedWarehouseConnectionList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deleteWarehouseConnectionId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteWarehouseConnection(state.deleteWarehouseConnectionId);
    toast.success("WarehouseConnection başarıyla silindi!");
    const updatedWarehouseConnection = await fetchWarehouseConnection();
    setState((prevState) => ({
      ...prevState,
      warehouseConnection: updatedWarehouseConnection,
      filteredWarehouseConnection: updatedWarehouseConnection,
      deleteModalVisible: false,
      deleteWarehouseConnectionId: null,
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
        Yeni Depo-Kanal Yönetimi Ekle
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
            {state.warehouseConnectionId
              ? "WarehouseConnection Düzenle"
              : "Yeni WarehouseConnection Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Kanal"
              className="mb-3"
              aria-label="Select Channel"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  channel: {
                    channelId: e.target.value,
                  },
                }))
              }
              value={state.channel?.channelId}
            >
              <option value="">Kanal Seçiniz</option>
              {state.channel.map((channel) => (
                <option key={channel.channelId} value={channel.channelId}>
                  {channel.name}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              label="Depo"
              className="mb-3"
              aria-label="Select Warehouse"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  warehouse: {
                    warehouseId: e.target.value,
                  },
                }))
              }
              value={state.warehouse?.warehouseId}
            >
              <option value="">Depo Seçiniz</option>
              {state.warehouse.map((warehouse) => (
                <option
                  key={warehouse.warehouseId}
                  value={warehouse.warehouseId}
                >
                  {warehouse.name}
                </option>
              ))}
            </CFormSelect>
            {state.warehouseConnectionId === null && (
              <CFormSwitch
                id="isActive"
                label={state.isActive ? "Aktif" : "Pasif"}
                checked={state.isActive}
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
            {state.warehouseConnectionId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Depo Adı", value: "warehouseName" },
              { label: "Kanal Adı", value: "channelName" },
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
          {currentItems.map((warehouseConnection) => (
            <CTableRow key={warehouseConnection.warehouseConnectionId}>
              {[
                { value: "warehouseName", isImage: false, isStatus: false },
                { value: "channelName", isImage: false, isStatus: false },
              ].map(({ value, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {warehouseConnection[value]}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${warehouseConnection.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() =>
                    handleToggleActive(
                      warehouseConnection.warehouseConnectionId,
                      warehouseConnection.isActive
                    )
                  }
                >
                  {warehouseConnection.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(warehouseConnection.warehouseConnectionId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() =>
                    handleDeleteClick(warehouseConnection.warehouseConnectionId)
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
              state.filteredWarehouseConnection.length / itemsPerPage
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
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteWarehouseConnectionId: null,
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
                deleteWarehouseConnectionId: null,
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

export default WarehouseConnection;
