import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilTrash } from "@coreui/icons";
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
  createBlog,
  fetchBlog,
  fetchBlogForID,
  deleteBlog,
  updateBlog,
} from "src/api/useApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../blog/ckeditor-styles.css";
import { fetchCategory, fetchSubCategoryForID } from "../../../api/useApi";

function Blog() {
  const [state, setState] = useState({
    blog: [],
    title: "",
    body: "",
    largeImage: null,
    smallImage: null,
    tags: "",
    slug: "",
    orderNumber: "",
    isActive: false,
    editBlogId: null,
    categories: [],
    subCategories: [],
    editBlogData: {},
    modalVisible: false,
    modalVisible2: false,
    selectedCategoryId: "",
    selectedSubCategoryId: "",
    searchQuery: "",
    filteredBlog: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadBlog = async () => {
      const data = await fetchBlog();
      const data2 = await fetchCategory();
      setState((prevState) => ({
        ...prevState,
        categories: data2,
        blog: data,
        filteredBlog: data,
      }));
    };
    loadBlog();
  }, []);

  useEffect(() => {
    if (state.selectedSubCategoryId) {
      const subCategories = async () => {
        const data = await fetchSubCategoryForID(state.selectedSubCategoryId);
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      };

      subCategories();
    }
  }, [state.selectedSubCategoryId]);

  const handleDelete = async (formId) => {
    await deleteBlog(formId);
    toast.success("Blog başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      blogs: prevState.blog.filter((form) => form.blogId !== formId),
      filteredBlog: prevState.filteredBlog.filter(
        (form) => form.blogId !== formId
      ),
    }));
  };

  const handleEditModalOpen = async (formId) => {
    const data = await fetchBlogForID(formId);
    console.log("here", data);
    setState((prevState) => ({
      ...prevState,
      blog: {
        formId,
        ...data,
      },
      modalVisible: true,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBlog.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleEdit = async () => {
    const updatedData = state.editBlogData;
    await updateBlog(state.editBlogData.blogId, updatedData);
    toast.success("Blog başarıyla güncellendi.");
    setState((prevState) => ({
      ...prevState,
      blog: prevState.blog.map((item) =>
        item.blogId === updatedData.blogId ? updatedData : item
      ),
      modalVisible: false,
    }));
  };

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => {
          setState((prevState) => ({
            ...prevState,
            modalVisible: true,
          }));
        }}
      >
        Yeni Blog Ekle
      </CButton>

      <CModal
        visible={state.modalVisible}
        onClose={() => {
          setState((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
        }}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Düzenle</CModalTitle>
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
                  value={state.blog.title}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      title: e.target.value,
                    }));
                  }}
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  className="mb-3"
                  id="orderNumber"
                  label="Sıra Numarası"
                  value={state.orderNumber}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      orderNumber: e.target.value,
                    }));
                  }}
                />
              </CCol>
            </CRow>
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>

              <CKEditor
                editor={ClassicEditor}
                data={state.body}
                onChange={(e) => {
                  setState((prevState) => ({
                    ...prevState,
                    body: e.target.value,
                  }));
                }}
              />
            </div>
            <CFormInput
              type="file"
              className="mb-3"
              id="largeImage"
              label="Büyük Resim"
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  largeImage: e.target.files[0],
                }));
              }}
            />
            <CFormInput
              type="file"
              className="mb-3"
              id="smallImage"
              label="Küçük Resim"
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  smallImage: e.target.files[0],
                }));
              }}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="tags"
              label="Etiketler"
              value={state.tags}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  tags: e.target.value,
                }));
              }}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="slug"
              label="URL Adresi"
              value={state.slug}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  slug: e.target.value,
                }));
              }}
            />
            <CFormSelect
              label="Kategori"
              className="mb-3"
              aria-label="Select category"
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  selectedCategoryId: e.target.value,
                }));
              }}
              value={state.selectedCategoryId}
            >
              <option value="">Kategori Seçiniz</option>
              {state.categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>
            <CFormSelect
              label="Alt Kategori"
              className="mb-3"
              aria-label="Select subcategory"
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  selectedSubCategoryId: e.target.value,
                }));
              }}
              value={state.selectedSubCategoryId}
            >
              <option value="">Lütfen Önce Kategori Seçiniz</option>
              {state.subCategories.map((subCategory) => (
                <option
                  key={subCategory.subCategoryId}
                  value={subCategory.subCategoryId}
                >
                  {subCategory.name}
                </option>
              ))}
            </CFormSelect>
            <CFormSwitch
              id="isActive"
              label={state.isActive ? "Aktif" : "Pasif"}
              className="mb-3"
              checked={state.isActive}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  isActive: e.target.value,
                }));
              }}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton color="primary">Kaydet</CButton>
        </CModalFooter>
      </CModal>

      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={state.searchQuery}
        onChange={(e) => {
          setState((prevState) => ({
            ...prevState,
            searchQuery: e.target.value,
          }));
        }}
      />

      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Başlık", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Büyük Resim", value: "largeImageUrl", isImage: true },
              { label: "Küçük Resim", value: "smallImageUrl", isImage: true },
              { label: "Etiketler", value: "tags" },
              { label: "Slug", value: "slug" },
              { label: "Alt Kategori", value: "subCategoryName" },
              { label: "Durum", value: "isActive", isStatus: true },
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
          {currentItems.map((blog) => (
            <CTableRow key={blog.blogId}>
              {[
                { value: "title", isImage: false, isStatus: false },
                { value: "orderNumber", isImage: false, isStatus: false },
                { value: "largeImageUrl", isImage: true, isStatus: false },
                { value: "smallImageUrl", isImage: true, isStatus: false },
                { value: "tags", isImage: false, isStatus: false },
                { value: "slug", isImage: false, isStatus: false },
                { value: "subCategoryName", isImage: false, isStatus: false },
                { value: "isActive", isImage: false, isStatus: true },
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
                        src={`http://10.10.3.181:5244/${blog[value]}`}
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
                        backgroundColor: blog[value] ? "#d4edda" : "#f8d7da",
                        color: blog[value] ? "#155724" : "#721c24",
                        border: `1px solid ${blog[value] ? "#c3e6cb" : "#f5c6cb"}`,
                      }}
                    >
                      {blog[value] ? "Aktif" : "Pasif"}
                    </div>
                  ) : (
                    blog[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(blog.blogId)}
                >
                  <CIcon icon={cilNotes} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(blog.blogId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination>
        {Array.from(
          { length: Math.ceil(state.filteredBlog.length / itemsPerPage) },
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

export default Blog;
