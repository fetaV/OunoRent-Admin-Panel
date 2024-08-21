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
  useEffect(() => {
    console.log("props", data);
  }, [data]);

  return (
    <>
      {data.length ? (
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Sub Category Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Order Number</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((item, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell>{item.name}</CTableHeaderCell>
                <CTableDataCell>{item.orderNumber}</CTableDataCell>
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
