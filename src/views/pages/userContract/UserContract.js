import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes } from "@coreui/icons";
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
  CFormTextarea,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserContract, fetchUserContractForID } from "src/api/useApi";

const UserContract = () => {
  const [state, setState] = useState({
    UserContract: [],
    filteredUserContract: [],
    userContractData: {},
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;
  const currentItems = state.filteredUserContract.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage
  );
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

  useEffect(() => {
    const filterUserContract = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.UserContract.filter((item) =>
        [item.fileName, item.contract?.name, item.user?.name]
          .map((item) => item?.toLowerCase() || "")
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredUserContract: filteredData,
      }));
    };

    filterUserContract();
  }, [state.searchQuery, state.UserContract]);

  const handleModalOpen = async (formId = null) => {
    const data = formId ? await fetchUserContractForID(formId) : {};
    setState((prevState) => ({
      ...prevState,
      userContractData: {
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
      editUserContractId: formId || null,
      modalVisible: true,
    }));
  };

  const handleInputChange = (e, key) => {
    setState((prevState) => ({
      ...prevState,
      userContractData: {
        ...prevState.userContractData,
        [key]: e.target.value,
      },
    }));
  };

  const handlePageChange = (page) => {
    setState((prevState) => ({ ...prevState, currentPage: page }));
  };

  const tableHeaders = [
    "Sözleşme Adı",
    "Sözleşme Versiyonu",
    "Dosya Adı",
    "İsim",
    "Soyisim",
    "Aksiyonlar",
  ];

  const formFields = [
    { label: "Sözleşme Adı", readOnly: true, key: "contractName" },
    { label: "Sözleşme Versiyonu", readOnly: true, key: "contractVersion" },
    { label: "Sözleşme Tipi", readOnly: true, key: "contractType" },
    { label: "Dosya Adı", readOnly: true, key: "fileName" },
    { label: "İsim", readOnly: true, key: "userName" },
    { label: "Soyisim", readOnly: true, key: "userSurname" },
  ];

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
              {formFields.map(({ label, key, readOnly }) => (
                <CCol key={key} md={6}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    readOnly={readOnly}
                    value={state.userContractData[key] || ""}
                    onChange={(e) => handleInputChange(e, key)}
                  />
                </CCol>
              ))}
            </CRow>
            <CFormTextarea
              className="mb-3"
              rows={5}
              readOnly={true}
              label="Kullanıcı Sözleşmesi Detayı"
              value={state.userContractData.contractBody || ""}
              onChange={(e) => handleInputChange(e, "contractBody")}
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
            {tableHeaders.map((header) => (
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
                item.contract?.name,
                item.contract?.version,
                item.fileName,
                item.user?.name,
                item.user?.surname,
              ].map((value, index) => (
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  key={index}
                >
                  {value?.toString()}
                </CTableDataCell>
              ))}
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
              onClick={() => handlePageChange(i + 1)}
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
