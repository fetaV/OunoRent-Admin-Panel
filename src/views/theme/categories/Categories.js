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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../../../config";

const Categories = () => {
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
  });
  const itemsPerPage = 10;

  const loadCategories = async () => {
    const [categories] = await Promise.all([fetchCategory()]);
    setState((prevState) => ({
      ...prevState,
      categories,
      filteredCategory: categories,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (state.categoriesData?.categoryId) {
      fetchSubCategoryForID(state.categoriesData?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.categoriesData?.categoryId]);

  const downloadExcel = async () => {
    try {
      const response = await fetch(
        "http://10.10.3.181:5244/api/Category/exportCategories",
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Categories.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to download file:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while downloading file:", error);
    }
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredCategories.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  return (
    <>
      <ToastContainer />

      <div className="d-flex justify-content-between w-100 mb-3">
        <CButton
          color="primary"
          className="mb-3"
          onClick={() => handleModalOpen()}
        >
          Yeni Blog Ekle
        </CButton>
        <CButton color="success text-white" onClick={downloadExcel}>
          Excel İndir
        </CButton>
      </div>

      <h3>Kategoriler</h3>
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
          <CTableRow>
            {[
              { label: "Kategori Adı", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Durum", value: "largeImageUrl" },
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
          {currentItems.map((category, index) => (
            <CTableRow key={index}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {category.name}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {category.orderNumber}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: category.isActive ? "#d4edda" : "#f8d7da",
                    color: category.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${category.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                  }}
                >
                  {category.isActive ? "Aktif" : "Pasif"}
                </div>
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CDropdown>
                  <CDropdownToggle color="primary">Seçenekler</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem
                      className="btn"
                      onClick={() => categoryEdit(category.categoryId)}
                    >
                      Düzenle
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      Sil
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => handleSubCategoryEdit(category.categoryId)}
                    >
                      Alt Kategori Ekle
                    </CDropdownItem>
                    <CDropdownItem
                      className="btn"
                      onClick={() => {
                        setParentCategoryId(category.categoryId);
                        setSelectedCategoryName(category.name);
                        if (
                          category.subCategories &&
                          category.subCategories.length > 0
                        ) {
                          setSelectedCategoryId(category.categoryId);
                        } else {
                          toast.info("Alt kategori verisi bulunmamaktadır");
                        }
                      }}
                    >
                      Alt Kategorileri Göster
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination
        aria-label="Page navigation"
        className="mt-3 btn border-0"
        align="center"
        items={totalPagesCategories}
        active={currentPageCategories}
        onChange={(page) => setCurrentPageCategories(page)}
      >
        {[...Array(totalPagesCategories).keys()].map((page) => (
          <CPaginationItem
            key={page + 1}
            active={page + 1 === currentPageCategories}
            onClick={() => setCurrentPageCategories(page + 1)}
          >
            {page + 1}
          </CPaginationItem>
        ))}
      </CPagination>

      {selectedCategoryId && subCategories.length > 0 && (
        <>
          <h3>
            Alt Kategoriler{" "}
            <b className="text-primary"> ({selectedCategoryName})</b>
          </h3>
          <CFormInput
            type="text"
            id="search"
            placeholder="Arama"
            value={searchQuerySubCategories}
            onChange={(e) => setSearchQuerySubCategories(e.target.value)}
          />
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Alt Kategori Adı
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Sıra
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Durum
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  Eylemler
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.SubCategories.map((subCategory, index) => (
                <CTableRow key={index}>
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                  >
                    {subCategory.name}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                  >
                    {subCategory.orderNumber}
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        backgroundColor: subCategory.isActive
                          ? "#d4edda"
                          : "#f8d7da",
                        color: subCategory.isActive ? "#155724" : "#721c24",
                        border: `1px solid ${subCategory.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                      }}
                    >
                      {subCategory.isActive ? "Aktif" : "Pasif"}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                  >
                    <CButton
                      color="primary"
                      className="me-2"
                      onClick={() =>
                        handleEditSubCategoryModalOpen(
                          selectedCategoryId,
                          subCategory.subCategoryId
                        )
                      }
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() =>
                        handleSubCategoryDelete(subCategory.subCategoryId)
                      }
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CPagination
            aria-label="Page navigation"
            className="mt-3 btn border-0"
            align="center"
            items={totalPagesSubCategories}
            active={currentPageSubCategories}
            onChange={(page) => setCurrentPageSubCategories(page)}
          >
            {[...Array(totalPagesSubCategories).keys()].map((page) => (
              <CPaginationItem
                key={page + 1}
                active={page + 1 === currentPageSubCategories}
                onClick={() => setCurrentPageSubCategories(page + 1)}
              >
                {page + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </>
      )}
    </>
  );
};

export default Categories;
