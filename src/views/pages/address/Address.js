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
  CFormTextarea,
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
    addressData: {},
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;

  const loadAddresses = async () => {
    const data = await fetchAddress();
    setState((prevState) => ({
      ...prevState,
      addresses: data,
      filteredAddresses: data,
    }));
  };

  useEffect(() => {
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
  }, [state.searchQuery]);

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
      addressData: {
        addressId,
        ...data,
      },
      modalVisible: true,
    }));
  };

  const handleEdit = async () => {
    const updatedData = {
      ...state.addressData,
      userId: state.addressData.user?.userId,
    };

    await updateAddressForID(updatedData.addressId, updatedData);
    toast.success("Adres başarıyla güncellendi.");

    setState((prevState) => ({
      ...prevState,
      addresses: prevState.addresses.map((addr) =>
        addr.addressId === updatedData.addressId ? updatedData : addr
      ),
      modalVisible: false,
    }));
    loadAddresses();
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
            ].map(({ label, value, type = "text" }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.addressData[value] || ""}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    addressData: {
                      ...prevState.addressData,
                      [value]: e.target.value,
                    },
                  }))
                }
              />
            ))}

            <CFormSelect
              className="mb-3"
              label="Adres Tipi"
              value={state.addressData.type}
              onChange={(e) =>
                setState({
                  ...state,
                  addressData: {
                    ...state.addressData,
                    type: e.target.value,
                  },
                })
              }
            >
              <option value="1">Bireysel</option>
              <option value="2">Kurumsal</option>
            </CFormSelect>
            <CFormTextarea
              className="mb-3"
              rows={5}
              label="Adres Detayı"
              value={state.addressData.addressDetail || ""}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  addressData: {
                    ...prevState.addressData,
                    addressDetail: e.target.value,
                  },
                }))
              }
            />
            {state.addressData.type === 2 && (
              <>
                <CFormInput
                  className="mb-3"
                  type="number"
                  label="Vergi No"
                  value={state.addressData.taxNo || ""}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      addressData: {
                        ...prevState.addressData,
                        taxNo: e.target.value,
                      },
                    }))
                  }
                />
                <CFormInput
                  className="mb-3"
                  label="Vergi Dairesi"
                  value={state.addressData.taxOffice || ""}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      addressData: {
                        ...prevState.addressData,
                        taxOffice: e.target.value,
                      },
                    }))
                  }
                />
                <CFormInput
                  className="mb-3"
                  label="Şirket Adı"
                  value={state.addressData.companyName || ""}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      addressData: {
                        ...prevState.addressData,
                        companyName: e.target.value,
                      },
                    }))
                  }
                />
              </>
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
          <CButton color="primary" onClick={handleEdit}>
            Güncelle
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable hover>
        <CTableHead>
          <CTableRow style={{ textAlign: "center", verticalAlign: "middle" }}>
            {[
              "Başlık",
              "Şehir",
              "İlçe",
              "Semt",
              "Vergi No",
              "Vergi Dairesi",
              "Şirket Adı",
              "Adres Tipi",
              "Aksiyonlar",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((addr) => (
            <CTableRow
              style={{ textAlign: "center", verticalAlign: "middle" }}
              key={addr.addressId}
            >
              {[
                "title",
                "city",
                "district",
                "neighborhood",
                "taxNo",
                "taxOffice",
                "companyName",
              ].map((key) => (
                <CTableDataCell key={key}>{addr[key]}</CTableDataCell>
              ))}
              <CTableDataCell>
                {addr.type === 1 ? "Bireysel" : "Kurumsal"}
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(addr.addressId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(addr.addressId)}
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
