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
  fetchCategory,
  fetchSubCategoryForID,
} from "src/api/useApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../blog/ckeditor-styles.css";

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
    modalVisible: false,
    selectedCategoryId: "",
    selectedSubCategoryId: "",
    searchQuery: "",
    filteredBlog: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadBlog = async () => {
      const [blogs, categories] = await Promise.all([
        fetchBlog(),
        fetchCategory(),
      ]);
      setState((prevState) => ({
        ...prevState,
        categories,
        blog: blogs,
        filteredBlog: blogs,
      }));
    };
    loadBlog();
  }, []);

  useEffect(() => {
    if (state.selectedCategoryId) {
      fetchSubCategoryForID(state.selectedCategoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.selectedCategoryId]);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchBlogForID(formId);
      setState((prevState) => ({
        ...prevState,
        editBlogId: formId,
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
      editBlogId,
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

    const blogData = {
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

    if (editBlogId) {
      await updateBlog(editBlogId, blogData);
      toast.success("Blog başarıyla güncellendi.");
    } else {
      await createBlog(blogData);
      toast.success("Blog başarıyla oluşturuldu.");
    }

    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      blog: fetchBlog(),
      filteredBlog: fetchBlog(),
    }));
  };

  const handleDelete = async (formId) => {
    await deleteBlog(formId);
    toast.success("Blog başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      blog: prevState.blog.filter((item) => item.blogId !== formId),
      filteredBlog: prevState.filteredBlog.filter(
        (item) => item.blogId !== formId,
      ),
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBlog.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem,
  );

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Blog Ekle
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
            {state.editBlogId ? "Blog Düzenle" : "Yeni Blog Ekle"}
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
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={state.body}
                onChange={(event, editor) =>
                  setState((prevState) => ({
                    ...prevState,
                    body: editor.getData(),
                  }))
                }
              />
            </div>
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
            <CFormSelect
              label="Kategori"
              className="mb-3"
              aria-label="Select category"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  selectedCategoryId: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  selectedSubCategoryId: e.target.value,
                }))
              }
              value={state.selectedSubCategoryId}
              disabled={!state.selectedCategoryId}
            >
              <option value="">Alt Kategori Seçiniz</option>
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
              label="Aktif"
              id="isActive"
              className="mb-3"
              checked={state.isActive}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  isActive: e.target.checked,
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
            {state.editBlogId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
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
                  onClick={() => handleModalOpen(blog.blogId)}
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
          ),
        )}
      </CPagination>
    </>
  );
}

export default Blog;
