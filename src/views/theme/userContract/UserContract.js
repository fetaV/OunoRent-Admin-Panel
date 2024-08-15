import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilCheckCircle, cilXCircle, cilTrash } from "@coreui/icons";
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
  CRow,
  CCol,
  CFormTextarea,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserContract, fetchUserContractForID } from "src/api/useApi";

const UserContract = () => {
  const [state, setState] = useState({
    UserContract: [],
    filteredUserContract: [],
    editUserContractData: {},
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadUserContract = async () => {
      const data = await fetchUserContract();
      setState((prevState) => ({
        ...prevState,
        UserContract: data,
        filteredUserContract: data,
      }));
    };

    loadUserContract();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchUserContractForID(formId);
      setState((prevState) => ({
        ...prevState,
        editUserContractData: {
          contractName: data.contract?.name || "",
          contractBody: data.contract?.body || "",
          contractType: data.contract?.type || "",
          contractVersion: data.contract?.version || "",
          requiresAt: data.contract?.requiresAt || "",
          fileName: data.fileName || "",
          contractId: data.contractId || "",
          createDate: data.createDate || "",
          isActive: data.isActive || false,
          date: data.date || "",
          userName: data.user?.name || "",
          userSurname: data.user?.surname || "",
          userEmail: data.user?.email || "",
          address: data.address || "",
          birthDate: data.birthDate || "",
          phoneNumber: data.phoneNumber || "",
          tc: data.tc || "",
        },
        editUserContractId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        editUserContractData: {
          contractName: "",
          contractVersion: "",
          requiresAt: "",
          fileName: "",
          contractId: "",
          createDate: "",
          isActive: false,
          date: "",
          userName: "",
          userSurname: "",
          userEmail: "",
          address: "",
          birthDate: "",
          phoneNumber: "",
          tc: "",
        },
        editUserContractId: null,
        modalVisible: true,
      }));
    }
  };

  useEffect(() => {
    const filterUserContract = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.UserContract.filter((item) =>
        [item.fileName, item.contract.name, item.user.name]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredUserContract: filteredData,
      }));
    };

    filterUserContract();
  }, [state.searchQuery, state.UserContract]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredUserContract.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
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
          <CModalTitle>Kullanıcı Sözleşmesi Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Sözleşme Adı", value: "contractName", md: 6 },
                {
                  label: "Sözleşme Versiyonu",
                  value: "contractVersion",
                  md: 6,
                },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    value={state.editUserContractData[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editUserContractData: {
                          ...prevState.editUserContractData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[
                { label: "Sözleşme Tipi", value: "contractType", md: 6 },
                { label: "Dosya Adı", value: "fileName", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    value={state.editUserContractData[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editUserContractData: {
                          ...prevState.editUserContractData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[
                { label: "İsim", value: "userName", md: 6 },
                { label: "Soyisim", value: "userSurname", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    value={state.editUserContractData[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editUserContractData: {
                          ...prevState.editUserContractData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CFormTextarea
              className="mb-3"
              rows={5}
              label="Kullanıcı Sözleşmesi Detayı"
              value={state.editUserContractData.contractBody || ""}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  editUserContractData: {
                    ...prevState.editUserContractData,
                    contractBody: e.target.value,
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
        </CModalFooter>
      </CModal>

      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              "Sözleşme Adı",
              "Sözleşme Versiyonu",
              "Dosya Adı",
              "İsim",
              "Soyisim",
              "Aksiyonlar",
            ].map((header) => (
              <CTableHeaderCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
                key={header}
              >
                {header}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow
              style={{ textAlign: "center", verticalAlign: "middle" }}
              key={item.userContractId}
            >
              {[
                "contract.name",
                "contract.version",
                "fileName",
                "user.name",
                "user.surname",
              ].map((key) => {
                const keys = key.split(".");
                let value = item;
                keys.forEach((k) => {
                  value = value?.[k];
                });
                return (
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    key={key}
                  >
                    {value?.toString()}
                  </CTableDataCell>
                );
              })}
              <CTableDataCell>
                <CButton
                  color="info"
                  className="me-2"
                  onClick={() => handleModalOpen(item.userContractId)}
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
            length: Math.ceil(state.filteredUserContract.length / itemsPerPage),
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
export default UserContract;
