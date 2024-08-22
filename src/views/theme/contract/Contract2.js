import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilPencil, cilTrash } from "@coreui/icons";
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
  CFormTextarea,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteAddress,
  deleteContract,
  fetchAddressForID,
  fetchContract,
  fetchContractForID,
  updateAddressForID,
  updateContractForID,
} from "src/api/useApi";

const Address = () => {
  const [state, setState] = useState({
    data: [],
    filteredData: [],
    editData: {},
    newData: [],
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContract();
      setState((prevState) => ({
        ...prevState,
        data: data,
        filteredData: data,
      }));
    };

    loadData();
  }, []);

  useEffect(() => {
    const filterContracts = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.data
        .filter((contract) =>
          [
            contract.name,
            contract.version && contract.version.toString(), // Handle version as a string
          ]
            .filter(Boolean) // Remove any undefined or null values
            .map((item) => item.toLowerCase())
            .some((item) => item.includes(lowercasedQuery)),
        )
        .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));

      setState((prevState) => ({
        ...prevState,
        filteredData: filteredData,
      }));
    };

    filterContracts();
  }, [state.searchQuery, state.data]);

  const handleEditModalOpen = async (contractId) => {
    const data = await fetchContractForID(id);
    setState((prevState) => ({
      ...prevState,
      editData: {
        contractId,
        ...data,
      },
      modalVisible: true,
    }));
  };

  const handleEdit = async () => {
    const updatedData = state.editData;
    await updateContractForID(state.editData.contractId, updatedData);
    toast.success("Adres başarıyla güncellendi.");
    setState((prevState) => ({
      ...prevState,
      data: prevState.data.map((item) =>
        item.contractId === updatedData.contractId ? updatedData : item,
      ),
      modalVisible: false,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredAddresses.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem,
  );

  return (
    <>
      <ToastContainer />
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
      >
        <CModalHeader>
          <CModalTitle>Adres Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              { label: "Versiyon", value: "version" },
              { label: "Önceki Versiyon", value: "previousVersion" },
              { label: "Gereklilik", value: "requiresAt" },
            ].map(({ label, value, type = "text" }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.editData[value] || ""}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    editData: {
                      ...prevState.editData,
                      [value]: e.target.value,
                    },
                  }))
                }
              />
            ))}
            <CFormTextarea
              type="text"
              className="mb-3"
              label="İçerik"
              rows={5}
              value={state.editData ? state.editData.body : state.newData.body}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  newData: {
                    ...prevState.newData,
                    body: e.target.value,
                  },
                }))
              }
            />
            <CFormSwitch
              label={isActive ? "Aktif" : "Pasif"}
              checked={isActive}
              onChange={(e) =>
                state.data
                  ? setCurrentContract({
                      ...currentContract,
                      isActive: e.target.checked,
                    })
                  : setNewContract({
                      ...newContract,
                      isActive: e.target.checked,
                    })
              }
              readOnly={isReadOnly}
            />

            <CFormSelect
              className="mb-3"
              label="Adres Tipi"
              value={state.editAddressData.type}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  editAddressData: {
                    ...prevState.editAddressData,
                    type: e.target.value,
                  },
                }))
              }
            >
              <option value="0">Bireysel</option>
              <option value="1">Kurumsal</option>
            </CFormSelect>
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
          <CButton color="primary" onClick={handleEdit}>
            Güncelle
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable hover>
        <CTableHead>
          <CTableRow>
            {["Sözleşme Adı", "Versiyon", "Durum", "Eylemler"].map((header) => (
              <CTableHeaderCell
                key={header}
                style={header !== "Eylemler" ? { width: "45%" } : {}}
              >
                {header}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.contractId}>
              {["title", "city"].map((key) => (
                <CTableDataCell key={key}>{item[key]}</CTableDataCell>
              ))}
              <CTableDataCell>
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    marginRight: 10,
                  }}
                >
                  {item.isActive ? "Aktif" : "Pasif"}
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditModalOpen(item.contractId)}
                >
                  <CIcon icon={cilNotes} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination>
        {Array.from(
          { length: Math.ceil(state.filteredAddresses.length / itemsPerPage) },
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
          ),
        )}
      </CPagination>
    </>
  );
};

export default Address;
