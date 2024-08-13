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
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteAddress,
  fetchAddress,
  fetchAddressForID,
  updateAddressForID,
} from "src/api/useApi";

const Address = () => {
  const [state, setState] = useState({
    addresses: [],
    filteredAddresses: [],
    editAddressData: {},
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadAddresses = async () => {
      const data = await fetchAddress();
      setState((prevState) => ({
        ...prevState,
        addresses: data,
        filteredAddresses: data,
      }));
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    const filterAddresses = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.addresses.filter((addr) =>
        [
          addr.title,
          addr.addressDetail,
          addr.city,
          addr.companyName,
          addr.district,
          addr.neighborhood,
          addr.taxNo.toString(),
          addr.taxOffice,
          addr.type ? "kurumsal" : "bireysel",
          addr.user.name,
        ]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredAddresses: filteredData,
      }));
    };

    filterAddresses();
  }, [state.searchQuery, state.addresses]);

  const handleDelete = async (addressId) => {
    await deleteAddress(addressId);
    toast.success("Adres başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      addresses: prevState.addresses.filter(
        (addr) => addr.addressId !== addressId
      ),
      filteredAddresses: prevState.filteredAddresses.filter(
        (addr) => addr.addressId !== addressId
      ),
    }));
  };

  const handleEditModalOpen = async (addressId) => {
    const data = await fetchAddressForID(addressId);
    setState((prevState) => ({
      ...prevState,
      editAddressData: {
        addressId,
        ...data,
      },
      modalVisible: true,
    }));
  };

  const handleEdit = async () => {
    const updatedData = state.editAddressData;
    await updateAddressForID(state.editAddressData.addressId, updatedData);
    toast.success("Adres başarıyla güncellendi.");
    setState((prevState) => ({
      ...prevState,
      addresses: prevState.addresses.map((addr) =>
        addr.addressId === updatedData.addressId ? updatedData : addr
      ),
      modalVisible: false,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredAddresses.slice(
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
          <CModalTitle>Adres Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              { label: "Başlık", value: "title" },
              { label: "Şehir", value: "city" },
              { label: "İlçe", value: "district" },
              { label: "Semt", value: "neighborhood" },
              { label: "Adres Detayı", value: "addressDetail" },
              { label: "Vergi No", value: "taxNo", type: "number" },
              { label: "Vergi Dairesi", value: "taxOffice" },
              { label: "Şirket Adı", value: "companyName" },
            ].map(({ label, value, type = "text" }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.editAddressData[value] || ""}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    editAddressData: {
                      ...prevState.editAddressData,
                      [value]: e.target.value,
                    },
                  }))
                }
              />
            ))}
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
            {[
              "Başlık",
              "Şehir",
              "İlçe",
              "Semt",
              "Vergi No",
              "Vergi Dairesi",
              "Adres Tipi",
              "Şirket Adı",
              "Aksiyonlar",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((addr) => (
            <CTableRow key={addr.addressId}>
              {[
                "title",
                "city",
                "district",
                "neighborhood",
                "taxNo",
                "taxOffice",
                "type",
                "companyName",
              ].map((key) => (
                <CTableDataCell key={key}>{addr[key]}</CTableDataCell>
              ))}
              <CTableDataCell>
                <CButton
                  color="info"
                  className="me-2"
                  onClick={() => handleEditModalOpen(addr.addressId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDelete(addr.addressId)}
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
          )
        )}
      </CPagination>
    </>
  );
};

export default Address;
