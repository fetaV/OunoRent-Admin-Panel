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
    searchQuery: "",
    editUserId: null,
    modalVisible: false,
    deleteModalVisible: false,
    deleteUserId: null,
    currentPage: 1,
    editUserData: {},
  });
  const itemsPerPage = 10;
  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state?.filteredUser?.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem,
  );

  const loadUsers = async () => {
    const users = await fetchUser();
    setState((prev) => ({
      ...prev,
      users,
      filteredUser: users,
    }));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.users.filter((user) => {
        const fields = ["address", "email", "name", "surname"];
        return fields.some((field) =>
          user[field]?.toLowerCase().includes(lowercasedQuery),
        );
      });

      setState((prev) => ({
        ...prev,
        filteredUser: filteredData,
      }));
    };

    filterUsers();
  }, [state.searchQuery, state.users]);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchUserForID(formId);
      setState((prev) => ({
        ...prev,
        editUserData: {
          ...data,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().substring(0, 10)
            : "",
        },
        editUserId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        editUserData: {},
        editUserId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editUserId, editUserData } = state;

    try {
      if (editUserId) {
        await updateUser(editUserId, editUserData);
        toast.success("Kullanıcı başarıyla güncellendi.");
      } else {
        await createUser(editUserData);
        toast.success("Kullanıcı başarıyla oluşturuldu.");
      }
      setState((prev) => ({
        ...prev,
        modalVisible: false,
      }));
      await loadUsers();
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDeleteClick = (formId) => {
    setState((prev) => ({
      ...prev,
      deleteUserId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteUser(state.deleteUserId);
    toast.success("User başarıyla silindi!");
    const updatedUser = await fetchUser();
    setState((prev) => ({
      ...prev,
      users: updatedUser,
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
        placeholder="Arama"
        value={state.searchQuery}
        onChange={(e) =>
          setState((prev) => ({ ...prev, searchQuery: e.target.value }))
        }
      />

      <CTable>
        <CTableHead>
          <CTableRow>
            {[
              "İsim",
              "Soyisim",
              "Email",
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
          {currentItems?.map((user) => (
            <CTableRow key={user.userId}>
              {[
                user.name,
                user.surname,
                user.email,
                user.phoneNumber,
                user.birthDate
                  ? new Date(user.birthDate).toLocaleDateString("tr-TR")
                  : "",
                user.address,
              ].map((data, idx) => (
                <CTableDataCell key={idx} style={{ textAlign: "center" }}>
                  {data}
                </CTableDataCell>
              ))}
              <CTableDataCell style={{ textAlign: "center" }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleModalOpen(user.userId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDeleteClick(user.userId)}
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
          { length: Math.ceil(state.filteredUser?.length / itemsPerPage) },
          (_, i) => (
            <CPaginationItem
              key={i + 1}
              active={i + 1 === state.currentPage}
              onClick={() =>
                setState((prev) => ({ ...prev, currentPage: i + 1 }))
              }
            >
              {i + 1}
            </CPaginationItem>
          ),
        )}
      </CPagination>

      <CModal
        visible={state.modalVisible}
        onClose={() => setState((prev) => ({ ...prev, modalVisible: false }))}
      >
        <CModalHeader>
          <CModalTitle>
            {state.editUserId ? "User Düzenle" : "Yeni User Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              { label: "İsim", value: "name" },
              { label: "Soyisim", value: "surname" },
              { label: "Email", value: "email" },
              { label: "Telefon", value: "phoneNumber" },
              { label: "Doğum Tarihi", value: "birthDate", type: "date" },
              { label: "Adres", value: "address" },
              state.editUserId === null && {
                label: "Şifre",
                value: "password",
                type: "password",
              },
              state.editUserId === null && {
                label: "Şifre Tekrarı",
                value: "passwordConfirm",
                type: "password",
              },
            ]
              .filter(Boolean)
              .map(({ label, value, type = "text" }) => (
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
                    setState((prev) => ({
                      ...prev,
                      editUserData: {
                        ...prev.editUserData,
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
              setState((prev) => ({ ...prev, modalVisible: false }))
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
          setState((prev) => ({
            ...prev,
            deleteModalVisible: false,
            deleteUserId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu Kullanıcıyı silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                deleteModalVisible: false,
                deleteUserId: null,
              }))
            }
          >
            İptal
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Sil
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Typography;
