import React, { useEffect, useState, useRef } from "react";
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
  CRow,
  CCol,
} from "@coreui/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  createFooterItem,
  fetchFooterItem,
  fetchFooterItemForID,
  deleteFooterItem,
  updateFooterItem,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

export const FooterItem = ({ data }) => {
  const [state, setState] = useState({
    FooterItem: [],
    searchQuery: "",
    footerItemData: {},
    filteredFooterItem: [],
    modalVisible: false,
    currentPage: 1,
    deleteModalVisible: false,
    deleteFooterItemId: null,
    deleteFooterHeaderId: null,
  });
  const fileInputRef = useRef(null);

  const fetchFooterItem = async () => {
    if (data.length) {
      const updatedFooterItemList = await fetchFooterItem(
        data[0].footerHeaderId
      );
      setState((prevState) => ({
        ...prevState,
        FooterItem: updatedFooterItemList,
        filteredFooterItem: updatedFooterItemList,
      }));
    }
  };

  useEffect(() => {
    fetchFooterItem();
  }, [data]);

  const handleToggleActive = async (item) => {
    item.isActive = !item.isActive;

    await updateFooterItem(item.FooterHeaderId, item.FooterItemId, item);

    toast.success("FooterHeader durumu başarıyla güncellendi.");

    await fetchFooterItem();
  };

  const handleModalOpen = async (FooterHeaderId, FooterItemId) => {
    if (FooterHeaderId && FooterItemId) {
      const item = await fetchFooterItemForID(FooterHeaderId, FooterItemId);
      setState((prevState) => ({
        ...prevState,
        footerItemData: {
          ...item,
          FooterHeaderId,
          FooterItemId,
        },
        modalVisible: true,
      }));
    } else if (data.length) {
      setState((prevState) => ({
        ...prevState,
        footerItemData: {
          name: "",
          description: "",
          icon: "",
          orderNumber: 0,
          isActive: false,
          FooterHeaderId: data[0].FooterHeaderId,
          FooterItemId: null,
        },
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { footerItemData } = state;

    try {
      if (footerItemData.FooterItemId) {
        await updateFooterItem(
          data[0].FooterHeaderId,
          footerItemData.FooterItemId,
          { ...footerItemData, iconUrl: undefined }
        );
        toast.success("FooterItem başarıyla güncellendi.");
      } else {
        await createFooterItem(data[0].FooterHeaderId, footerItemData);
        toast.success("FooterItem başarıyla oluşturuldu.");
      }

      await fetchFooterItem();
      setState((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "icon") {
          setState((prevState) => ({
            ...prevState,
            footerItemData: {
              ...prevState.footerItemData,
              icon: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (item) => {
    setState((prevState) => ({
      ...prevState,
      deleteFooterItemId: item.FooterItemId,
      deleteFooterHeaderId: item.FooterHeaderId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteFooterItem(
      state.deleteFooterHeaderId,
      state.deleteFooterItemId
    );
    toast.success("FooterHeader başarıyla silindi!");
    await fetchFooterItem();
    setState((prevState) => ({
      ...prevState,
      deleteModalVisible: false,
      deleteFooterItemId: null,
      deleteFooterHeaderId: null,
    }));
  };

  return (
    <>
      <ToastContainer />
      {state.FooterItem.length ? (
        <>
          <CButton
            color="primary"
            className="mb-3"
            onClick={() => handleModalOpen()}
          >
            Yeni FooterItem Ekle
          </CButton>

          <CTable>
            <CTableHead>
              <CTableRow>
                {[
                  { label: "FooterItem Adı", value: "name" },
                  { label: "Sıra Numarası", value: "orderNumber" },
                  { label: "Eylemler", value: "actions" },
                ].map(({ label, value }) => (
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
              {state.FooterItem.map((item) => (
                <CTableRow
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  key={item.FooterItemId}
                >
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.orderNumber}</CTableDataCell>
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                  >
                    <CButton
                      className={`text-white me-2 ${item.isActive ? "btn-success" : "btn-danger"}`}
                      onClick={() => handleToggleActive(item)}
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
                        handleModalOpen(item.FooterHeaderId, item.FooterItemId);
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </>
      ) : (
        <h3>FooterItem Bulunmamaktadır</h3>
      )}

      <CModal
        className="modal-xl"
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.footerItemData?.FooterHeaderId
              ? "Kategori Düzenle"
              : "Yeni Kategori Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Başlık", value: "name", md: 6 },
                { label: "Sıra Numarası", value: "orderNumber", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="text"
                    label={label}
                    value={state.footerItemData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        footerItemData: {
                          ...prevState.footerItemData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[{ label: "Açıklama", value: "description", md: 6 }].map(
                ({ label, value, md, type = "text" }) => (
                  <CCol key={value} md={md}>
                    <CFormInput
                      key={value}
                      className="mb-3"
                      type={type}
                      label={label}
                      value={state.footerItemData?.[value] || ""}
                      onChange={(e) =>
                        setState((prevState) => ({
                          ...prevState,
                          footerItemData: {
                            ...prevState.footerItemData,
                            [value]: e.target.value,
                          },
                        }))
                      }
                    />
                  </CCol>
                )
              )}
              <CCol>
                {[
                  {
                    key: "icon",
                    label: "Mevcut Icon Image",
                    ref: fileInputRef,
                    defaultImage:
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
                  },
                ].map(({ key, label, ref, defaultImage }) => (
                  <div key={key} className="mb-3 col-md-4">
                    <label className="d-flex">{label}</label>
                    <div className="image-container m-1">
                      <img
                        onClick={() => {
                          if (ref.current) {
                            ref.current.click();
                          }
                        }}
                        src={
                          state.footerItemData?.[key]?.startsWith("data:image")
                            ? state.footerItemData?.[key]
                            : state.footerItemData?.[`${key}Url`]
                              ? `http://10.10.3.181:5244/${state.footerItemData?.[`${key}Url`]}`
                              : defaultImage
                        }
                        style={{ width: 200, height: "auto" }}
                        alt={label}
                      />
                      <button
                        className="edit-button"
                        onClick={() => {
                          if (ref.current) {
                            ref.current.click();
                          }
                        }}
                      >
                        {state.footerItemData?.FooterHeaderId
                          ? "Güncelle"
                          : "Kaydet"}
                      </button>
                    </div>
                  </div>
                ))}
              </CCol>
            </CRow>

            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="icon"
              ref={fileInputRef}
            />
          </CForm>
        </CModalBody>
        <CModalFooter className="mt-5">
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
          >
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleSave()}>
            {state.footerItemData?.FooterHeaderId ? "Güncelle" : "Kaydet"}
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
            deleteFooterItemId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu FooterHeaderu silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteFooterItemId: null,
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
