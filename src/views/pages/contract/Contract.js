import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilCheckCircle, cilXCircle } from "@coreui/icons";
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
  CFormTextarea,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createContract,
  fetchContract,
  updateContract,
  fetchContractForID,
} from "src/api/useApi";

const Contract = () => {
  const [state, setState] = useState({
    contracts: [],
    filteredContract: [],
    contractData: {},
    editContractId: null,
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
    type: 0,
  });
  const itemsPerPage = 10;

  const loadContract = async () => {
    const data = await fetchContract();
    setState((prevState) => ({
      ...prevState,
      contract: data,
      filteredContract: data,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadContract();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchContractForID(formId);
      setState((prevState) => ({
        ...prevState,
        contractData: {
          body: data.body || "",
          contractId: data.contractId || "",
          createDate: data.createDate || "",
          isActive: data.isActive || false,
          name: data.name || "",
          previousVersion: data.previousVersion || 0,
          requiresAt: data.requiresAt || "",
          type: data.type || 0,
          version: data.version || 1,
        },
        editContractId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        contractData: {
          body: "",
          contractId: "",
          createDate: "",
          isActive: false,
          name: "",
          previousVersion: 0,
          requiresAt: "",
          type: 0,
          version: 1,
        },
        editContractId: null,
        modalVisible: true,
      }));
    }
  };

  useEffect(() => {
    const filterContract = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.contracts.filter((item) =>
        [item.name, item.version]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredContract: filteredData,
      }));
    };

    filterContract();
  }, [state.searchQuery]);

  const handleSave = async () => {
    const { editContractId, contractData } = state;

    if (editContractId) {
      console.log("here1", editContractId, contractData);
      await updateContract(editContractId, contractData);
      toast.success("Contract başarıyla güncellendi.");
    } else {
      console.log("here2", editContractId, contractData);
      await createContract(contractData);
      toast.success("Contract başarıyla oluşturuldu.");
    }

    loadContract();
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredContract.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (contractId, currentStatus) => {
    const updatedContract = {
      ...state.contracts.find((item) => item.contractId === contractId),
      isActive: !currentStatus,
      contractId,
    };

    await updateContract(contractId, updatedContract); // contractId gönderiyoruz

    toast.success("Contract durumu başarıyla güncellendi.");

    const updatedContractList = await fetchContract();

    setState((prevState) => ({
      ...prevState,
      contracts: updatedContractList,
      filteredContract: updatedContractList,
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
            {["Sözleşme Adı", "Versiyon", "Eylemler"].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((contract) => (
            <CTableRow key={contract.contractId}>
              {["name", "version"].map((key) => (
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  key={key}
                >
                  {contract[key]}
                </CTableDataCell>
              ))}

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${contract.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() =>
                    handleToggleActive(contract.contractId, contract.isActive)
                  }
                >
                  {contract.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleModalOpen(contract.contractId)}
                >
                  <CIcon icon={cilNotes} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="btn btn-sm">
        {Array.from(
          {
            length: Math.ceil(state.filteredContract.length / itemsPerPage),
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
            {state.editContractId ? "Kanal Düzenle" : "Yeni Kanal Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              {
                label: "Sözleşme Adı",
                value: "name",
                type: "text",
                readOnly: false,
              },
              {
                label: "Versiyon",
                value: "version",
                type: "number",
                readOnly: true,
              },
              {
                label: "Önceki Versiyon",
                value: "previousVersion",
                type: "number",
                readOnly: true,
              },
              {
                label: "Sözleşme Tipi",
                value: "type",
                type: "number",
                readOnly: false,
              },
              {
                label: "Gereklilik",
                value: "requiresAt",
                type: "text",
                readOnly: false,
              },
            ].map(({ label, value, type, readOnly }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.contractData[value]}
                readOnly={readOnly}
                onChange={(e) =>
                  !readOnly &&
                  setState((prevState) => ({
                    ...prevState,
                    contractData: {
                      ...prevState.contractData,
                      [value]:
                        type === "number"
                          ? parseInt(e.target.value, 10)
                          : e.target.value,
                    },
                  }))
                }
              />
            ))}

            <CFormTextarea
              className="mb-3"
              rows={5}
              label="Kullanıcı Sözleşmesi Detayı"
              value={state.contractData.body}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  contractData: {
                    ...prevState.contractData,
                    body: e.target.value,
                  },
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
          {!state.contractData.contractId && (
            <CButton color="primary" onClick={handleSave}>
              Kaydet
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Contract;
