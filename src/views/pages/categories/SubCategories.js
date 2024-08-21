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
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSubCategory,
  fetchSubCategory,
  fetchSubCategoryForID,
  deleteSubCategory,
  updateSubCategory,
} from "src/api/useApi";
import "../blog/ckeditor-styles.css";

export const SubCategories = ({ data }) => {
  const [state, setState] = useState({
    categories: [],
    subCategories: [],
    searchQuery: "",
    categoriesData: {},
    subCategoriesData: {},
    filteredCategories: [],
    filteredSubCategories: [],
    modalVisible: false,
    currentPage: 1,
    deleteModalVisible: false,
    deleteCategoryId: null,
  });

  const handleToggleActive = async (data) => {
    data.isActive = !data.isActive;

    await updateSubCategory(data.categoryId, data.subCategoryId, data);

    toast.success("Category durumu başarıyla güncellendi.");

    const updatedSubCategoryList = await fetchSubCategory(data.categoryId);
    console.log(updatedSubCategoryList);

    setState((prevState) => ({
      ...prevState,
      subCategories: updatedSubCategoryList,
      filteredSubCategories: updatedSubCategoryList,
    }));
  };

  return (
    <>
      {data.length ? (
        <CTable>
          <CTableHead>
            <CTableRow>
              {[
                { label: "Alt Kategori Adı", value: "name" },
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
            {data.map((item) => (
              <CTableRow
                style={{ textAlign: "center", verticalAlign: "middle" }}
                key={item.subCategoryId}
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
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <h3>Alt Kategori Bulunmamaktadır</h3>
      )}
    </>
  );
};
