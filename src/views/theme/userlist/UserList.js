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
  createUser,
  deleteUser,
  fetchUser,
  fetchUserForID,
  updateUser,
} from "src/api/useApi";

const Typography = () => {
  const [state, setState] = useState({
    users: [],
    name: "",
    surname: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
    email: "",
    password: "",
    passwordConfirm: "",
    editUserId: null,
    modalVisible: false,
    searchQuery: "",
    filteredUser: [],
    editUserData: {},
    currentPage: 1,
    deleteModalVisible: false,
  });
  const itemsPerPage = 10;

  const loadUser = async () => {
    const [users] = await Promise.all([fetchUser()]);
    setState((prevState) => ({
      ...prevState,
      users: users,
      filteredUser: users,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchUserForID(formId);
      setState((prevState) => ({
        ...prevState,
        editUserData: {
          userId: data.userId || "",
          name: data.name || "",
          surname: data.surname || "",
          phoneNumber: data.phoneNumber || "",
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().substring(0, 10) // Tarihi YYYY-MM-DD formatında sakla
            : "",
          address: data.address || "",
          email: data.email || "",
          isActive: data.isActive || false,
        },
        editUserId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        editUserData: {
          email: "",
          password: "",
          passwordConfirm: "",
        },
        editUserId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editUserId, editUserData } = state;

    if (editUserId) {
      console.log("here1", editUserId, editUserData);
      await updateUser(editUserId, editUserData);
      toast.success("User başarıyla güncellendi.");
    } else {
      console.log("here2", editUserId, editUserData);
      await createUser(editUserData);
      toast.success("User başarıyla oluşturuldu.");
    }

    loadUser();
  };

  useEffect(() => {
    const filterUser = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state?.users?.filter((item) => {
        const address = item.address ? item.address.toLowerCase() : "";
        const email = item.email ? item.email.toLowerCase() : "";
        const name = item.name ? item.name.toString().toLowerCase() : "";
        const surname = item.surname ? item.surname.toString().lowercase() : "";
        return [address, email, name, surname].some((value) =>
          value.includes(lowercasedQuery)
        );
      });

      setState((prevState) => ({
        ...prevState,
        filteredUser: filteredData,
      }));
    };

    filterUser();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredUser.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deleteUserId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteUser(state.deleteUserId);
    toast.success("User başarıyla silindi!");
    const updatedUser = await fetchUser();
    setState((prevState) => ({
      ...prevState,
      user: updatedUser,
      filteredUser: updatedUser,
      deleteModalVisible: false,
      deleteUserId: null,
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
        Yeni User Ekle
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
            {[
              "İsim",
              "Soyisim",
              "Emal",
              "Telefon",
              "Doğum Tarihi",
              "Adres",
              "Eylemler",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((user, index) => {
            const formattedDate = user.birthDate
              ? new Date(user.birthDate).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "";

            return (
              <CTableRow key={index}>
                {[
                  "name",
                  "surname",
                  "email",
                  "phoneNumber",
                  formattedDate,
                  "address",
                ].map((key) => (
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    key={key}
                  >
                    {key === formattedDate ? formattedDate : user[key]}
                  </CTableDataCell>
                ))}
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <CButton
                    color="primary text-white"
                    className="me-2"
                    onClick={() => handleModalOpen(user.userId)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger text-white"
                    onClick={() => handleDeleteClick(user.userId)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      </CTable>

      <CPagination className="btn btn-sm">
        {Array.from(
          { length: Math.ceil(state.filteredUser.length / itemsPerPage) },
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
            {state.editUserId ? "User Düzenle" : "Yeni User Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {state.editUserId === null
              ? [
                  { label: "Email", value: "email" },
                  { label: "Şifre", value: "password" },
                  { label: "Şifre Tekrarı", value: "passwordConfirm" },
                ].map(({ label, value, type = "text" }) => (
                  <CFormInput
                    key={value}
                    className="mb-3"
                    type={type}
                    label={label}
                    value={state.editUserData[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editUserData: {
                          ...prevState.editUserData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                ))
              : [
                  { label: "İsim", value: "name" },
                  { label: "Soyisim", value: "surname" },
                  { label: "Email", value: "email" },
                  { label: "Telefon", value: "phoneNumber" },
                  {
                    label: "Doğum Tarihi",
                    value: "birthDate",
                    type: "date",
                  },
                  { label: "Adres", value: "address" },
                ].map(({ label, value, type = "text" }) => (
                  <CFormInput
                    key={value}
                    className="mb-3"
                    type={type}
                    label={label}
                    value={
                      value === "birthDate" && state.editUserData[value]
                        ? new Date(state.editUserData[value])
                            .toISOString()
                            .split("T")[0]
                        : state.editUserData[value] || ""
                    }
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        editUserData: {
                          ...prevState.editUserData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                ))}
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
            {state.editUserId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteUserId: null,
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
                deleteUserId: null,
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

export default Typography;
