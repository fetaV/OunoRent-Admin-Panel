import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilCheckCircle, cilXCircle, cilTrash } from "@coreui/icons";
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
  createBrand,
  fetchBrand,
  fetchBrandForID,
  deleteBrand,
  updateBrand,
} from "src/api/useApi";

function Brand() {
  const [state, setState] = useState({
    Brand: [],
    title: "",
    body: "",
    logo: null,
    isActive: false,
    editBrandId: null,
    modalVisible: false,
    searchQuery: "",
    filteredBrand: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadBrand = async () => {
      const [Brands, categories] = await Promise.all([fetchBrand()]);
      setState((prevState) => ({
        ...prevState,
        categories,
        Brand: Brands,
        filteredBrand: Brands,
      }));
    };
    loadBrand();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchBrandForID(formId);
      setState((prevState) => ({
        ...prevState,
        editBrandId: formId,
        title: data.title,
        body: data.body,
        largeImage: data.largeImage,
        smallImage: data.smallImage,
        tags: data.tags,
        slug: data.slug,
        orderNumber: data.orderNumber,
        isActive: data.isActive,
        selectedCategoryId: data.categoryId,
        selectedSubCategoryId: data.subCategoryId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        title: "",
        body: "",
        largeImage: null,
        smallImage: null,
        tags: "",
        slug: "",
        orderNumber: "",
        isActive: false,
        selectedCategoryId: "",
        selectedSubCategoryId: "",
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const {
      editBrandId,
      title,
      body,
      largeImage,
      smallImage,
      tags,
      slug,
      orderNumber,
      isActive,
      selectedCategoryId,
      selectedSubCategoryId,
    } = state;

    const BrandData = {
      title,
      body,
      largeImage,
      smallImage,
      tags,
      slug,
      orderNumber,
      isActive,
      categoryId: selectedCategoryId,
      subCategoryId: selectedSubCategoryId,
    };

    if (editBrandId) {
      await updateBrand(editBrandId, BrandData);
      toast.success("Brand başarıyla güncellendi.");
    } else {
      await createBrand(BrandData);
      toast.success("Brand başarıyla oluşturuldu.");
    }

    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      Brand: fetchBrand(),
      filteredBrand: fetchBrand(),
    }));
  };

  const handleDelete = async (formId) => {
    await deleteBrand(formId);
    toast.success("Brand başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      Brand: prevState.Brand.filter((item) => item.BrandId !== formId),
      filteredBrand: prevState.filteredBrand.filter(
        (item) => item.BrandId !== formId
      ),
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBrand.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (brandId, currentStatus) => {
    const updatedBrand = {
      ...state.Brand.find((item) => item.brandId === brandId),
      isActive: !currentStatus,
    };

    await updateBrand(brandId, updatedBrand);

    toast.success("Brand durumu başarıyla güncellendi.");

    const updatedBrandList = await fetchBrand();

    setState((prevState) => ({
      ...prevState,
      Brand: updatedBrandList,
      filteredBrand: updatedBrandList,
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
        Yeni Brand Ekle
      </CButton>

      <CModal
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.editBrandId ? "Marka Düzenle" : "Yeni Marka Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol>
                <CFormInput
                  type="text"
                  className="mb-3"
                  id="title"
                  label="Başlık"
                  value={state.title}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }))
                  }
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  className="mb-3"
                  id="orderNumber"
                  label="Sıra Numarası"
                  value={state.orderNumber}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      orderNumber: e.target.value,
                    }))
                  }
                />
              </CCol>
            </CRow>
            <CFormInput
              type="file"
              className="mb-3"
              id="largeImage"
              label="Büyük Resim"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  largeImage: e.target.files[0],
                }))
              }
            />
            <CFormInput
              type="file"
              className="mb-3"
              id="smallImage"
              label="Küçük Resim"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  smallImage: e.target.files[0],
                }))
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="tags"
              label="Etiketler"
              value={state.tags}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  tags: e.target.value,
                }))
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="slug"
              label="URL Adresi"
              value={state.slug}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  slug: e.target.value,
                }))
              }
            />

            <CFormSwitch
              label="Aktif"
              id="showOnBrands"
              className="mb-3"
              checked={state.showOnBrands}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  showOnBrands: e.target.checked,
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
          <CButton color="primary" onClick={handleSave}>
            {state.editBrandId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Marka Adı", value: "name" },
              { label: "Logo", value: "logo", isImage: true },
              {
                label: "Anasayfada Göster",
                value: "showOnBrands",
                isStatus: true,
              },
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
          {currentItems.map((Brand) => (
            <CTableRow key={Brand.brandId}>
              {[
                { value: "name", isImage: false, isStatus: false },
                { value: "logo", isImage: true, isStatus: false },
                { value: "showOnBrands", isImage: false, isStatus: true },
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
                        src={`http://10.10.3.181:5244/${Brand[value]}`}
                        alt={state.label}
                        style={{
                          width: isImage ? "100px" : "50px",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : isStatus ? (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        backgroundColor: Brand[value] ? "#d4edda" : "#f8d7da",
                        color: Brand[value] ? "#155724" : "#721c24",
                        border: `1px solid ${Brand[value] ? "#c3e6cb" : "#f5c6cb"}`,
                      }}
                    >
                      {Brand[value] ? "Aktif" : "Pasif"}
                    </div>
                  ) : (
                    Brand[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className="me-2"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: Brand.isActive ? "#d4edda" : "#f8d7da",
                    color: Brand.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${Brand.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleToggleActive(Brand.brandId)}
                >
                  {Brand.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleModalOpen(Brand.BrandId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(Brand.BrandId)}
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
          { length: Math.ceil(state.filteredBrand.length / itemsPerPage) },
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
}

export default Brand;
