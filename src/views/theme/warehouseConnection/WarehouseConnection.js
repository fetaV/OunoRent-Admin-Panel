import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
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
    editWarehouseConnectionId: null,
    warehouse: [],
    channel: [],
    modalVisible: false,
    editWarehouseConnectionData: {},
    selectedChannelId: "",
    selectedWarehouseId: "",
    searchQuery: "",
    filteredWarehouseConnection: [],
    currentPage: 1,
  });
  const itemsPerPage = 10;

  useEffect(() => {
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
      }));
    };
    loadWarehouseConnection();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchWarehouseConnectionForID(formId);
      setState((prevState) => ({
        ...prevState,
        editWarehouseConnectionId: formId,
        selectedChannelId: data.channelId,
        selectedWarehouseId: data.warehouseId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        selectedChannelId: "",
        selectedWarehouseId: "",
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const {
      editWarehouseConnectionId,
      isActive,
      selectedChannelId,
      selectedWarehouseId,
    } = state;

    const WarehouseConnectionData = {
      isActive,
      channelId: selectedChannelId,
      warehouseId: selectedWarehouseId,
      warehouseConnectionId: editWarehouseConnectionId,
    };

    if (editWarehouseConnectionId) {
      console.log("here3", WarehouseConnectionData);

      await updateWarehouseConnection(
        editWarehouseConnectionId,
        WarehouseConnectionData
      );

      toast.success("WarehouseConnection başarıyla güncellendi.");
    } else {
      await createWarehouseConnection(WarehouseConnectionData);
      toast.success("WarehouseConnection başarıyla oluşturuldu.");
    }

    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      WarehouseConnection: fetchWarehouseConnection(),
      filteredWarehouseConnection: fetchWarehouseConnection(),
    }));
  };

  useEffect(() => {
    const filterWarehouseConnection = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.warehouseConnection.filter((item) =>
        [item.channelName, item.warehouseName]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredWarehouseConnection: filteredData,
      }));
    };

    filterWarehouseConnection();
  }, [state.searchQuery, state.warehouseConnection]);

  const handleDelete = async (formId) => {
    await deleteWarehouseConnection(formId);
    toast.success("WarehouseConnection başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      WarehouseConnection: prevState.warehouseConnection.filter(
        (item) => item.warehouseConnectionId !== formId
      ),
      filteredWarehouseConnection: prevState.filteredWarehouseConnection.filter(
        (item) => item.warehouseConnectionId !== formId
      ),
    }));
  };

  const handleEdit = async () => {
    const updatedData = state.editWarehouseConnectionData;
    await updateWarehouseConnection(
      state.editWarehouseConnectionData.warehouseConnectionId,
      updatedData
    );
    toast.success("Warehouseconnection başarıyla güncellendi.");
    setState((prevState) => ({
      ...prevState,
      warehouseConnection: prevState.warehouseConnection.map((item) =>
        item.warehouseConnectionId === updatedData.warehouseConnectionId
          ? updatedData
          : item
      ),
      modalVisible: false,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredWarehouseConnection.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

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
            {state.editWarehouseConnectionId
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
                  selectedChannelId: e.target.value,
                }))
              }
              value={state.selectedChannelId}
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
                  selectedWarehouseId: e.target.value,
                }))
              }
              value={state.selectedWarehouseId}
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
            <CFormSwitch
              label="Aktif"
              id="isActive"
              className="mb-3"
              checked={state.isActive}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  isActive: e.target.checked,
                }))
              }
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
            {state.editWarehouseConnectionId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Depo Adı", value: "warehouseName" },
              { label: "Kanal Adı", value: "channelName" },
              { label: "Durum", value: "isActive", isStatus: true },
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
                { value: "isActive", isImage: false, isStatus: true },
              ].map(({ value, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {isStatus ? (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        backgroundColor: warehouseConnection[value]
                          ? "#d4edda"
                          : "#f8d7da",
                        color: warehouseConnection[value]
                          ? "#155724"
                          : "#721c24",
                        border: `1px solid ${
                          warehouseConnection[value] ? "#c3e6cb" : "#f5c6cb"
                        }`,
                      }}
                    >
                      {warehouseConnection[value] ? "Aktif" : "Pasif"}
                    </div>
                  ) : (
                    warehouseConnection[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() =>
                    handleModalOpen(warehouseConnection.warehouseConnectionId)
                  }
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() =>
                    handleDelete(warehouseConnection.warehouseConnectionId)
                  }
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination>
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
    </>
  );
}

export default WarehouseConnection;
