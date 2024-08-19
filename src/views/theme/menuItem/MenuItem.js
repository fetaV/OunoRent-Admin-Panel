import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from "@coreui/icons";
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
  createMenuItem,
  deleteMenuItem,
  fetchMenuItem,
  fetchMenuItemForID,
  updateMenuItem,
} from "src/api/useApi";

const MenuItem = () => {
  const [state, setState] = useState({
    MenuItem: [],
    modalVisible: false,
    icon: null,
    deleteMenuItemId: null,
    searchQuery: "",
    editMenuItemId: null,
    filteredMenuItem: [],
    menuItemData: {},
    currentPage: 1,
    deleteModalVisible: false,
  });

  const itemsPerPage = 10;

  const loadMenuItem = async () => {
    const [MenuItem] = await Promise.all([fetchMenuItem()]);
    setState((prevState) => ({
      ...prevState,
      MenuItem,
      filteredMenuItem: MenuItem,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadMenuItem();
  }, []);

  const handleModalOpen = async (formId = null) => {
    console.log("asddasdasad");
    if (formId) {
      const data = await fetchMenuItemForID(formId);
      setState((prevState) => ({
        ...prevState,
        menuItemData: data,
        editMenuItemId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        menuItemData: {
          isActive: true,
          label: "",
          icon: "",
          targetUrl: "",
          orderNumber: 0,
          onlyToMembers: true,
        },
        editMenuItemId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editMenuItemId, menuItemData } = state;

    if (editMenuItemId) {
      console.log("here1", editMenuItemId, menuItemData);
      await updateMenuItem(editMenuItemId, menuItemData);
      toast.success("MenuItem başarıyla güncellendi.");
    } else {
      console.log("here2", editMenuItemId, menuItemData);
      await createMenuItem(menuItemData);
      toast.success("MenuItem başarıyla oluşturuldu.");
    }

    loadMenuItem();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setState((prevState) => ({
          ...prevState,
          menuItemData: { ...prevState.menuItemData, icon: reader.result },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterMenuItem = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.MenuItem.filter((item) => {
        const label = item.label ? item.label.toLowerCase() : "";

        return [label].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredMenuItem: filteredData,
      }));
    };

    filterMenuItem();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredMenuItem.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (MenuItemId, currentStatus) => {
    console.log("here10");
    const updatedMenuItem = {
      ...state.MenuItem.find((item) => item.menuItemId === MenuItemId),
      isActive: !currentStatus,
    };

    await updateMenuItem(MenuItemId, updatedMenuItem);

    toast.success("MenuItem durumu başarıyla güncellendi.");

    const updatedMenuItemList = await fetchMenuItem();

    setState((prevState) => ({
      ...prevState,
      MenuItem: updatedMenuItemList,
      filteredMenuItem: updatedMenuItemList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deleteMenuItemId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteMenuItem(state.deleteMenuItemId);
    toast.success("MenuItem başarıyla silindi!");
    const updatedMenuItem = await fetchMenuItem();
    setState((prevState) => ({
      ...prevState,
      MenuItem: updatedMenuItem,
      filteredMenuItem: updatedMenuItem,
      deleteModalVisible: false,
      deleteMenuItemId: null,
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
        Yeni Ana Başlık Ekle
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
              "Hedef URL",
              "Sıra Numarası",
              "Kullanıcıya Özel",
              "Eylemler",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.menuItemId}>
              {["label", "targetUrl", "orderNumber", "onlyToMembers"].map(
                (key) => (
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    key={key}
                  >
                    {key === "onlyToMembers" ? (
                      <div
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          backgroundColor: item[key] ? "#d4edda" : "#f8d7da",
                          color: item[key] ? "#155724" : "#721c24",
                          border: `1px solid ${item[key] ? "#c3e6cb" : "#f5c6cb"}`,
                        }}
                      >
                        {item[key] ? "Aktif" : "Pasif"}
                      </div>
                    ) : (
                      item[key]
                    )}
                  </CTableDataCell>
                )
              )}

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className="me-2"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleToggleActive(item.menuItemId, item.isActive)
                  }
                >
                  {item.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(item.menuItemId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(item.menuItemId)}
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
          { length: Math.ceil(state.filteredMenuItem.length / itemsPerPage) },
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
            {state.editMenuItemId
              ? "Ana Başlık Düzenle"
              : "Yeni Ana Başlık Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              { label: "MenuItem Adı", value: "label" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Hedef URL", value: "targetUrl" },
            ].map(({ label, value, type = "text" }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.menuItemData[value] || ""}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    menuItemData: {
                      ...prevState.menuItemData,
                      [value]: e.target.value,
                    },
                  }))
                }
              />
            ))}
            {state.menuItemData?.icon && (
              <div className="mb-3">
                <label>Mevcut icon</label>
                <img
                  src={
                    state.menuItemData.icon &&
                    state.menuItemData.icon.startsWith("data:image")
                      ? state.menuItemData.icon
                      : `http://10.10.3.181:5244/${state.menuItemData.iconUrl || ""}`
                  }
                  alt="icon"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            )}

            <CFormInput
              type="file"
              className="mb-3"
              label="icon Yükle"
              onChange={handleFileChange}
            />
            <CFormSwitch
              id="onlyToMembers"
              label={`Kullanıcıya Özel:  ${state.menuItemData.onlyToMembers ? "Aktif" : "Pasif"}`}
              checked={state.menuItemData.onlyToMembers}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  menuItemData: {
                    ...prevState.menuItemData,
                    onlyToMembers: e.target.checked,
                  },
                }))
              }
            />

            {state.editMenuItemId === null && (
              <CFormSwitch
                id="isActive"
                label={`Durum: ${state.menuItemData.isActive ? "Aktif" : "Pasif"}`}
                checked={state.menuItemData.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    menuItemData: {
                      ...prevState.menuItemData,
                      isActive: e.target.checked,
                    },
                  }))
                }
              />
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
          <CButton color="primary" onClick={handleSave}>
            {state.editMenuItemId ? "Güncelle" : "Kaydet"}
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
            deleteMenuItemId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu Ana Başlıkı silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteMenuItemId: null,
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
    </div>
  );
};

export default MenuItem;
