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
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSlider,
  fetchSlider,
  fetchSliderForID,
  deleteSlider,
  updateSlider,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

function Slider() {
  const [state, setState] = useState({
    slider: [],
    categories: [],
    subCategories: [],
    modalVisible: false,
    searchQuery: "",
    categoryData: {},
    deleteModalVisible: null,
    filteredslider: [],
    currentPage: 1,
  });
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const itemsPerPage = 10;

  const loadslider = async () => {
    const [slider] = await Promise.all([fetchSlider()]);
    setState((prevState) => ({
      ...prevState,
      slider,
      filteredslider: slider,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadslider();
  }, []);

  useEffect(() => {
    if (state.slider?.categoryId) {
      fetchSubCategory(state.slider?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.slider?.categoryId]);

  const handleModalOpen = async (sliderId = null) => {
    if (sliderId) {
      const data = await fetchSliderForID(sliderId);
      setState((prevState) => ({
        ...prevState,
        slider: data,
        modalVisible: true,
      }));
      console.log("11", data);
    } else {
      setState((prevState) => ({
        ...prevState,
        slider: [],
        sliderId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { slider } = state;

    if (slider?.sliderId) {
      await updateSlider(slider.sliderId, slider);
      toast.success("slider başarıyla güncellendi.");
    } else {
      await createSlider(slider);
      toast.success("slider başarıyla oluşturuldu.");
    }

    loadslider();
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "small") {
          setState((prevState) => ({
            ...prevState,
            slider: {
              ...prevState.slider,
              mobileImage: reader.result,
            },
          }));
        } else if (id === "large") {
          setState((prevState) => ({
            ...prevState,
            slider: {
              ...prevState.slider,
              mainImage: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterslider = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.slider.filter((item) => {
        const title = item.title ? item.title.toLowerCase() : "";

        return [title].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredslider: filteredData,
      }));
    };

    filterslider();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredslider.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (sliderId, currentStatus) => {
    const updatedslider = {
      ...state.slider.find((item) => item.sliderId === sliderId),
      isActive: !currentStatus,
    };
    console.log(updatedslider);

    await updateSlider(sliderId, updatedslider);

    toast.success("slider durumu başarıyla güncellendi.");

    const updatedsliderList = await fetchSlider();

    setState((prevState) => ({
      ...prevState,
      slider: updatedsliderList,
      filteredslider: updatedsliderList,
    }));
  };

  const handleDeleteClick = (sliderId) => {
    setState((prevState) => ({
      ...prevState,
      deleteSliderId: sliderId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteSlider(state.deleteSliderId);
    toast.success("slider başarıyla silindi!");
    const updatedslider = await fetchSlider();
    setState((prevState) => ({
      ...prevState,
      slider: updatedslider,
      filteredslider: updatedslider,
      deleteModalVisible: false,
      deleteSliderId: null,
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
        Yeni slider Ekle
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
            {state.slider?.sliderId ? "slider Düzenle" : "Yeni slider Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Başlık", value: "title", md: 6 },
                { label: "Sıra Numarası", value: "orderNumber", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.slider?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        slider: {
                          ...prevState.slider,
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
                { label: "Hedef URL", value: "targetUrl", md: 6 },
                { label: "Ekran Süresi(sn)", value: "duration", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.slider?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        slider: {
                          ...prevState.slider,
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
                { label: "Başlangıç tarihi", value: "activeFrom", md: 6 },
                { label: "Bitiş Tarihi", value: "activeTo", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    type="date"
                    label={label}
                    value={
                      state.slider?.[value]
                        ? new Date(state.slider[value])
                            .toISOString()
                            .substr(0, 10)
                        : ""
                    }
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        slider: {
                          ...prevState.slider,
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
                {
                  key: "mainImage",
                  label: "Mevcut Büyük Resim",
                  ref: fileInputRef1,
                  defaultImage:
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
                },
                {
                  key: "mobileImage",
                  label: "Mevcut Mobil Resim",
                  ref: fileInputRef2,
                  defaultImage:
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
                },
              ].map(({ key, label, ref, defaultImage }) => (
                <div key={key} className="mb-3 col-md-6">
                  <label className="d-flex">{label}</label>
                  <div className="image-container m-1">
                    <img
                      onClick={() => {
                        if (ref.current) {
                          ref.current.click();
                        }
                      }}
                      src={
                        state.slider?.[key]?.startsWith("data:image")
                          ? state.slider?.[key]
                          : state.slider?.[`${key}Url`]
                            ? `http://10.10.3.181:5244/${state.slider?.[`${key}Url`]}`
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
                      {state.slider?.categoryId ? "Güncelle" : "Kaydet"}
                    </button>
                  </div>
                </div>
              ))}
            </CRow>

            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="large"
              ref={fileInputRef1}
            />

            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="small"
              ref={fileInputRef2}
            />

            {state.slider?.sliderId === null && (
              <CFormSwitch
                label="Aktif"
                id="isActive"
                className="mb-3"
                checked={state.slider?.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    slider: {
                      ...prevState.slider,
                      isActive: e.target.checked,
                    },
                  }))
                }
              />
            )}
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
          <CButton color="primary" onClick={handleSave}>
            {state.slider?.sliderId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Başlık", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Hedef URL", value: "targetUrl" },
              { label: "Büyük Resim", value: "mainImageUrl", isImage: true },
              { label: "Mobil Resim", value: "mobileImageUrl", isImage: true },
              { label: "Ekran Süresi(sn)", value: "duration" },
              { label: "Başlangıç Tarihi", value: "activeFrom" },
              { label: "Bitiş Tarihi", value: "activeTo" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value, isImage, isStatus }) => (
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
          {currentItems.map((slider) => (
            <CTableRow key={slider.sliderId}>
              {[
                { value: "title", isImage: false, isStatus: false },
                { value: "orderNumber", isImage: false, isStatus: false },
                { value: "targetUrl", isImage: false, isStatus: false },
                { value: "duration", isImage: false, isStatus: false },
                { value: "mainImageUrl", isImage: true, isStatus: false },
                { value: "mobileImageUrl", isImage: true, isStatus: false },
                { value: "activeFrom", isImage: false, isStatus: false },
                { value: "activeTo", isImage: false, isStatus: false },
              ].map(({ value, isImage, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {isImage ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`http://10.10.3.181:5244/${slider[value]}`}
                        style={{
                          width: isImage ? "100px" : "50px",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : value === "activeFrom" || value === "activeTo" ? (
                    new Date(slider[value]).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  ) : (
                    slider[value]
                  )}
                </CTableDataCell>
              ))}

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${slider.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() =>
                    handleToggleActive(slider.sliderId, slider.isActive)
                  }
                >
                  {slider.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(slider.sliderId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(slider.sliderId)}
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
          { length: Math.ceil(state.filteredslider.length / itemsPerPage) },
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
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteSliderId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>
            Bu slideru silmek istediğinize emin misiniz?
          </CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteSliderId: null,
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
}

export default Slider;
