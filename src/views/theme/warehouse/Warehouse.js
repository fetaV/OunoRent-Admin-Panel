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
    name: "",
    logoWarehouseId: 0,
    editWarehouseId: null,
    modalVisible: false,
    isActive: false,
    searchQuery: "",
    filteredWarehouse: [],
    currentPage: 1,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const loadWarehouse = async () => {
      const [warehouse] = await Promise.all([fetchWarehouse()]);
      setState((prevState) => ({
        ...prevState,
        warehouse: warehouse,
        filteredWarehouse: warehouse,
      }));
    };
    loadWarehouse();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchWarehouseForID(formId);
      setState((prevState) => ({
        ...prevState,
        name: data.name,
        logoWarehouseId: data.logoWarehouseId,
        editWarehouseId: formId,
        modalVisible: true,
        isActive: data.isActive,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        name,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editWarehouseId, isActive } = state;

    const WarehouseData = {
      name: state.name,
      logoWarehouseId: state.logoWarehouseId,
      isActive: state.isActive,
    };

    if (editWarehouseId) {
      await updateWarehouse(editWarehouseId, WarehouseData);

      toast.success("Warehouse başarıyla güncellendi.");
    } else {
      await createWarehouse(WarehouseData);
      toast.success("Warehouse başarıyla oluşturuldu.");
    }

    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      Warehouse: fetchWarehouse(),
      filteredWarehouse: fetchWarehouse(),
    }));
  };

  const handleDelete = async (formId) => {
    await deleteWarehouse(formId);
    toast.success("Warehouse başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      Warehouse: prevState.warehouse.filter(
        (item) => item.warehouseId !== formId
      ),
      filteredWarehouse: prevState.filteredWarehouse.filter(
        (item) => item.warehouseId !== formId
      ),
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredWarehouse.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

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
            {state.editWarehouseId
              ? "Warehouse Düzenle"
              : "Yeni Warehouse Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Depo Adı"
              value={state.name}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
            <CFormInput
              type="number"
              id="exampleFormControlInput2"
              label="Logo Depo ID"
              value={state.logoWarehouseId}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  logoWarehouseId: e.target.value,
                }))
              }
            />
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
            {state.editWarehouseId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Depo Adı", value: "name" },
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
          {currentItems.map((warehouse) => (
            <CTableRow key={warehouse.warehouseId}>
              {[
                { value: "name", isImage: false, isStatus: false },
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
                        backgroundColor: warehouse[value]
                          ? "#d4edda"
                          : "#f8d7da",
                        color: warehouse[value] ? "#155724" : "#721c24",
                        border: `1px solid ${
                          warehouse[value] ? "#c3e6cb" : "#f5c6cb"
                        }`,
                      }}
                    >
                      {warehouse[value] ? "Aktif" : "Pasif"}
                    </div>
                  ) : (
                    warehouse[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleModalOpen(warehouse.warehouseId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(warehouse.warehouseId)}
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
    </>
  );
};

export default Warehouse;
